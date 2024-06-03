

import React from "react";
import logo from '../components/assets/Logo_CSW-full-redimens.png';
import ConfirmationAccountForm from "../components/forms/ConfirmAccountForm.js";

const ChangePassword = () => {
    return (
      <div>
        <div className="header-secondary">
          <img src={logo} alt="CSW Logo" style={{ width: '250px', height: 'auto'}}/>
        </div>
        <div className="login-page-container">
          <ConfirmationAccountForm/>
        </div>
      </div>
    );
  };
  
  export default ChangePassword;
