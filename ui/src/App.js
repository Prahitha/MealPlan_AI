import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/" element={<Home />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
