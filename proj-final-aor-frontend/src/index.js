import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import './components/forms/FormStyle.css';
import './index.css';
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';
import ForgetPassword from './pages/ForgetPassword.js';
import Register from './pages/Register.js';
import { ToastContainer } from 'react-toastify';
import ChangePassword from './pages/ChangePassword.js';
import ConfirmationAccount from './pages/ConfirmationAccount.js';
import UserProfile from './pages/UserProfile.js';


function Routing() {
  
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<>
          <Login />
        </>} />
        <Route path="/home" element={<>
          <Home />
        </>} />
        <Route path="/forgot-password" element={<>
          <ForgetPassword />
        </>} />
        <Route path="/register" element={<>
          <Register />
        </>} />
        <Route path="/change-password" element={<>
          <ChangePassword />
        </>} />
        <Route path="/confirm-account" element={<>
          <ConfirmationAccount />
        </>} />
        <Route path="/profile" element={<> <UserProfile /> </>} />
      </Routes>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
