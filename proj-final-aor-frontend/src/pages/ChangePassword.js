

import React from "react";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import ChangePasswordForm from "../components/forms/ChangePasswordForm.js";

const ChangePassword = () => {
    return (
      <div>
        <div className="header-secondary">
          <img src={logo} alt="CSW Logo" style={{ width: '250px', height: 'auto'}}/>
        </div>
        <div className="login-page-container">
          <ChangePasswordForm/>
        </div>
      </div>
    );
  };
  
  export default ChangePassword;
