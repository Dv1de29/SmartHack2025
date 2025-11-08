import React from 'react';

import { Link, Navigate, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

import './App.css';

function App() {
  return (
    <>
      <nav>
        <div className="links">
          <Link to={"/"}>Home</Link>
          <Link to={"/login"}>Login</Link>
        </div>

      </nav>

      <main>
        <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
        </Routes>
      </main>
  
    </>
  );
}

export default App;
