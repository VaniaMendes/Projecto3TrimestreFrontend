import React from "react";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import LoginForm from "../components/forms/LoginForm";
import TopHeader from "../components/header/TopHeader";

const Login = () => {

   
  return (
    <div>
       
   <div className="initial-Header"><TopHeader /></div>
      
      <div className="header-left">
        <img className = "header-image" src={logo} alt="CSW Logo"/>
      </div>
      <div className="login-page-container">
        <LoginForm />
      </div>
  
    </div>
  );
};

export default Login;