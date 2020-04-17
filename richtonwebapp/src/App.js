import React from 'react';
import {Route, Switch} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage'

function App() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
    </Switch>
  );
}

export default App;
