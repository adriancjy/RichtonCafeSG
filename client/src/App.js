import React from 'react';
import logo from './richtonlogo.png';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import CreateTodo from "./components/create-todo.component";
import EditTodo from "./components/edit-todo.component";
import TodosList from "./components/todo-list.component";
import MenuList from "./components/menu";

//react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Router>
    <div className="App">
    <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand">
              <img src={logo} width="30" height="30"/>
            </a>
            <Link to="/" className="navbar-brand">Richton Cafe Ordering Website</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                {/* <li className="navbar-item">
                  <Link to="/" className="nav-link">Todos</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Todo</Link>
                </li> */}
                {/* hidden */}
                <li className="navbar-item">
                  <Link to="/menu" className="nav-link">Menu</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={MenuList} />
          <Route path="/edit/:id" component={EditTodo} />
          <Route path="/create" component={CreateTodo} />
          <Route path="/menu" component={MenuList} />
        </div>
        </div>
      </Router>
  );
}

export default App;
