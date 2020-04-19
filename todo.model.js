const mongoose = require('mongoose');
const Schema = mongoose.Schema;let Todos = new Schema({
    todo_description: {
        type: String
    },
    todo_responsible: {
        type: String
    },
    todo_priority: {
        type: String
    },
    todo_completed: {
        type: Boolean
    }
                   /*mongoose.model('','collection name')*/
});module.exports = mongoose.model('Todo', Todos, 'Todo');