import React from 'react';

import { Link, Navigate, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

import './App.css';

function App() {
  return (
    <>
      <nav>
        <Link to={"/"}>Home</Link>
        <Link to={"/login"}>Login</Link>
      </nav>

      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
      </Routes>
    </>
  );
}

export default App;
