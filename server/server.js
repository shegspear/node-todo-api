// THIRD PARTY LIBRZRY
var express = require('express');
var bodyParser = require('body-parser');

// LOCAL LIBRARY
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
const { ObjectID } = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    // VALIDATE ID USING isValid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // findById
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send('Really sorry, no todos found');
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send(e);
    });

});

app.delete('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id;

    // validate the id -> not valid ? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Sorry, an error was encountered, please check and ensure the id is correct.');
    }

    // remove todo by id
    Todo.findByIdAndRemove('5f5f8f905689d3956fe4c67b').then((todo) => {
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

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = { app };