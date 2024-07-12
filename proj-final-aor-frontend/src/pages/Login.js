import React from "react";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import LoginForm from "../components/forms/LoginForm";
import TopHeader from "../components/header/TopHeader";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate(); 

  return (
    <div>
       
   <div className="initial-Header"><TopHeader /></div>
      
      <div className="header-left">
        <img className="header-image" src={logo} alt="CSW Logo" onClick={() => navigate('/')}/>
      </div>
      <div className="login-page-container">
        <LoginForm />
      </div>
  
    </div>
  );
};

export default Login;