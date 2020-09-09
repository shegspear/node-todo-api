// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

const Mongoose = require('mongoose');
const { Db } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {
    useUnifiedTopology: true
}, function(err, db) {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insert({
        name: 'Segun',
        age: 23,
        location: 'Abuja'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }

        console.log(result.ops);
    });

    db.close();
});