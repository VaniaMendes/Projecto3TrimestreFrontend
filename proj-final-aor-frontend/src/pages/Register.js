
import React from "react";
import RegisterForm from "../components/forms/RegisterForm";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import './Login.css';

const Register = () => {
    return (
        
        <div>
        <div className="header-secondary">
          <img src={logo} alt="CSW Logo" style={{ width: '250px', height: 'auto'}}/>
        </div>
        <div className="register-page-container">
          <RegisterForm />
        </div>
      </div>
    );
};

export default Register;