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
let Order = require('./model/order.model');
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

//Insert order into db

apiRoute.route('/richton/saveOrder').post(function(req, res) {
    let order = Order(req.body);
    Order.insertMany(req.body)
        .then(order => {
            res.status(200).json({'order': 1});
        })
        .catch(err => {
            res.status(400).send(0);
        });
});


app.use(express.static(path.join(__dirname, 'client', 'build')))

const port = process.env.PORT || 4000;
app.use('/api', apiRoute);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, function() {
    console.log("Server is running on Port: " + port);
});