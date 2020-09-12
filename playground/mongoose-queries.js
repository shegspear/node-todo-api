const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// var id = '5f5bc3e8353ea25aa4692367';

var id = '5f5a6518dc20f227644a35d6';

// if (!ObjectID.isValid(id)) {
//     console.log('Is not validd');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// })

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

User.findById(id).then((user) => {
    if (!user) {
        return console.log('User Id not found');
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => {
    console.log(e);
});