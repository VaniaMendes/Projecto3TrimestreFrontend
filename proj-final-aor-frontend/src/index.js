import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import './components/forms/FormStyle.css'
import './index.css';
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';


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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
