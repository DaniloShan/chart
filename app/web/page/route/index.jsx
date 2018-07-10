import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import Home from '../home';

export default () => (
    <Router>
        <Route path="/" component={Home}/>
    </Router>
);
