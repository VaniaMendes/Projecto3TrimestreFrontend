
import React from "react";
import RegisterForm from "../components/forms/RegisterForm";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import TopHeader from "../components/header/TopHeader";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();

    return (
        
      <div>
      
  <div className="initial-Header"><TopHeader /></div>
     
     <div className="header-left">
       <img className = "header-image" src={logo} alt="CSW Logo" onClick={() => navigate('/')}/>
     </div>
     <div className="login-page-container">
       <RegisterForm />
     </div>
     
   </div>
    );
};

export default Register;