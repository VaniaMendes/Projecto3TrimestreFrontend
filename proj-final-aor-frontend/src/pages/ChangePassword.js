

import React from "react";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import ChangePasswordForm from "../components/forms/ChangePasswordForm.js";
import TopHeader from "../components/header/TopHeader";

const ChangePassword = () => {

  return (
      
    <div>
<div className="initial-Header"><TopHeader /></div>
   
   <div className="header-left">
     <img className = "header-image" src={logo} alt="CSW Logo"/>
   </div>
   <div className="login-page-container">
     <ChangePasswordForm />
   </div>

 </div>
   );
 };
  
  export default ChangePassword;
