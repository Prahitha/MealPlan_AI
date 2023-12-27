import React, { useState } from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';

const App = () => {

  return (
    <div>
    <ChakraProvider>
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/users/:userId/profile" element={<Profile />} />
        <Route exact path="/" element={<Home />} />
      </Routes>
    </Router>
    </ChakraProvider>
    </div>
  );
}

export default App;
