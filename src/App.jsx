import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './styles/App.css';

import Login from './components/user/Login';
import List from './components/list/List';
import Home from './components/Home';



export default function App() {

  return (
    <Router>
        <div className='Wrapper'>
          <div className='App'>

            <Switch>
              <Route path='/login'> <Login /> </Route>
              <Route path='/list'> <List/></Route>
              <Route path='/'><Home/></Route>
            </Switch>

          </div>
        </div>
    </Router>
  );
}