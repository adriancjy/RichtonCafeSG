const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoute = express.Router();
let Todo = require('./model/todo.model');
let Menu = require('./model/menu.model');
let SideDish = require('./model/sidedish.model');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const url = process.env.MONGO_URL; 
// const url = 'mongodb+srv://richtoncafe:zcbm1234A@richtoncafe-fkfp1.mongodb.net/Richton?retryWrites=true&w=majority';
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));
}
app.get('*',(req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

//todo API route -- to be deleted.
apiRoute.route('/todo/getAlldata').get(function(req, res) {
    Todo.find(function(err, todo) {
        if (err) {
            console.log(err);
        } else {
            res.json(todo);
        }
    });
});

apiRoute.route('/todo/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

apiRoute.route('/todo/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;            
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

apiRoute.route('/todo/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});


//Richton Menu testing api route

apiRoute.route('/richton/getMenuData').get(function(req, res) {
    Menu.find(function(err, menu) {
        if (err) {
            console.log(err);
        } else {
            res.json(menu);
        }
    });
});


//Richton Sidedish API

apiRoute.route('/richton/getSideDish').get(function(req, res) {
    SideDish.find(function(err, menu) {
        if (err) {
            console.log(err);
        } else {
            res.json(menu);
        }
    });
});


if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'client/build' ));

    
}

const port = process.env.PORT || 4000;
app.use('/api', apiRoute);
app.listen(port, function() {
    console.log("Server is running on Port: " + port);
});