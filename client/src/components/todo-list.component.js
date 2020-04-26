import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from "react-bootstrap";

const Todo = props => (
    <tr>
        <td>{props.todo.todo_description}</td>
        <td>{props.todo.todo_responsible}</td>
        <td>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
        </td>
    </tr>
)

export default class TodosList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            retrieved: false
        };
    }

    componentDidMount() {
        axios.get('/api/todo/getAlldata')
            .then(response => {
                console.log(response.data);
                this.setState({ todos: response.data, retrieved: true });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    
    todoList() {
        return this.state.todos.map(function(currentTodo, i){
            return <Todo todo={currentTodo} key={i} />;
        })
    }

    render() {
        return (
            <div>
                {this.state.retrieved ? (<div>
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Responsible</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.todoList() }
                    </tbody>
                </table>
            </div>):(<div class="row h-100 page-container">
            <div class="col-sm-12 my-auto">
              <h3>Loading</h3>
              <Spinner class="" animation="grow" />
            </div>
          </div>)}
        </div>
           
            
        )
    }
}