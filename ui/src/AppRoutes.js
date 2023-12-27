// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import Home from './components/Home';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/users/:userId/profile" component={Profile} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
