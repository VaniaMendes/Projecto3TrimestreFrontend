

import React from "react";
import logo from '../components/assets/Logo_CSW-full-redimens.png';
import ForgetPasswordForm from "../components/forms/ForgotPasswordForm.js";

const ForgetPassword = () => {
    return (
      <div>
        <div className="header-secondary">
          <img src={logo} alt="CSW Logo" style={{ width: '250px', height: 'auto'}}/>
        </div>
        <div className="login-page-container">
          <ForgetPasswordForm/>
        </div>
      </div>
    );
  };
  
  export default ForgetPassword;
