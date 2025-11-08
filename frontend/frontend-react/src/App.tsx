import React from 'react';

import { useLocation, Link, Navigate, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

import './App.css';

function App() {
  return (
    <>
      {useLocation().pathname !== "/login" &&(<nav>
        <div className="links">
          <Link className='home-link lk' to={"/"}>Home</Link>
          <div className="home-browser">
            <Link className='lk' to={"/"}>Browse</Link>
            <Link className='lk' to={"/bookings"}>My bookings</Link>
          </div>

          <Link className='login-link lk' to={"/login"}>Login</Link>
        </div>
      </nav>)}

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
