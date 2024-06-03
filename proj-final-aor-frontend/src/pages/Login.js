import React from "react";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import './Login.css';
import LoginForm from "../components/forms/LoginForm";


const Login = () => {
  return (
    <div>
      <div className="header-secondary">
        <img src={logo} alt="CSW Logo" style={{ width: '250px', height: 'auto'}}/>
      </div>
      <div className="login-page-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;