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
        <Route path="/forget-password" element={<>
          <ForgetPassword />
        </>} />
        <Route path="/register" element={<>
          <Register />
        </>} />
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
