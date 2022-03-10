import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import NavBar from './components/NavBar';
import Home from './components/Home';
import AdminPage from './components/AdminPage';

ReactDOM.render(
    <Router history={history}>
        <NavBar />
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/admin' component={AdminPage} />
        </Switch>
    </Router>,
    document.getElementById('root')
);

serviceWorker.unregister();