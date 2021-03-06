// THIRD PARTY LIBRZRY
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

// LOCAL LIBRARY
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
const { ObjectID, BSONType } = require('mongodb');
const todo = require('./models/todo');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    // VALIDATE ID USING isValid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // findById
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send('Really sorry, no todos found');
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send(e);
    });

});

app.delete('/todos/:id', authenticate, (req, res) => {
    // get the id
    var id = req.params.id;

    // validate the id -> not valid ? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Sorry, an error was encountered, please check and ensure the id is correct.');
    }

    // remove todo by id
    Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
            // success if no doc, send 404
            if (!todo) {
                return res.status(404).send('Really sorry could not find your todo');
            }

            // success if doc , send doc back with 200
            res.status(200).send({ todo });

        })
        // error , error message with 400
        .catch((e) => {
            res.status(400).send('Sorry an error occured :', e);
        });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send('Could not find your update');
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send('Sorry an error occured with your update');
    });

});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
        // res.send(user);
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

// example of private route
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {

        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });

    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = { app };