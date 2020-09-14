const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

// Todo.findOneAndRemove({ _id: '5f5f8f905689d3956fe4c67b' }).then((todo) => {
//     console.log(todo);
// });

// Todo.findByIdAndRemove('5f5f8f615689d3956fe4c663').then((todo) => {
//     console.log(todo);
// });