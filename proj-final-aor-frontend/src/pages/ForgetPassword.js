

import React from "react";
import ForgetPasswordForm from "../components/forms/ForgotPasswordForm.js";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import TopHeader from "../components/header/TopHeader";

const ForgetPassword = () => {
   
   return (
       
     <div>

 <div className="initial-Header"><TopHeader /></div>
    
    <div className="header-left">
      <img className = "header-image" src={logo} alt="CSW Logo"/>
    </div>
    <div className="login-page-container">
      <ForgetPasswordForm />
    </div>

  </div>
    );
  };
  
  export default ForgetPassword;
