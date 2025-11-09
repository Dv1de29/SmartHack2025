import React from 'react';

import { useLocation, Link, Navigate, Routes, Route, useNavigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BookingPage from './pages/Bookings';
import Requests from './pages/Requests';

import './App.css';

function App() {
  const employee_role = localStorage.getItem("userRole")
  const navigate = useNavigate()

    const handleLogClick = () => {
      if (!employee_role) navigate("/login")
        else{
      localStorage.removeItem("authToken")
      localStorage.removeItem("userRole")
      localStorage.removeItem("")
      }
    }


  return (
    <>
      {useLocation().pathname !== "/login" &&(<nav>
        <div className="links">
          <Link className='home-link lk' to={"/"}>Home</Link>
          <div className="home-browser">
            <Link className='lk' to={"/"}>Browse</Link>
            <Link className='lk' to={"/bookings"}>My bookings</Link>
            {employee_role === "manager" && (
              <>
                <Link id='admin-link' className='lk' to={"/requests"}>Requests</Link>
              </>
            )}
          </div>

          <Link id='login-link' className='lk' to={"/login"} onClick={() => handleLogClick()}>{!employee_role ? "Log in" : "Logout"}</Link>
        </div>
      </nav>)}

      <main>
        <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/bookings' element={<BookingPage />}></Route>
          <Route path='/requests' element={<Requests />}></Route>
          <Route path='*' element={<Navigate to={"/"} replace />}></Route>
        </Routes>
      </main>
  
    </>
  );
}

export default App;