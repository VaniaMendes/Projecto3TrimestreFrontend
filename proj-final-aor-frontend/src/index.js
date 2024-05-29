import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import './components/forms/FormStyle.css'
import './index.css';
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import reportWebVitals from './reportWebVitals';

function Routing() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<>
          <Login />
        </>} />
        <Route path="/home" element={<>
          <Home />
        </>} />
      </Routes>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode> 
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
