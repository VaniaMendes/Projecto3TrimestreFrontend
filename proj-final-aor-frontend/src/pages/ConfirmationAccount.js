import React from "react";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import ConfirmationAccountForm from "../components/forms/ConfirmAccountForm.js";
import TopHeader from "../components/header/TopHeader";

const  ConfirmationAccount = () => {
  
  return (
      
    <div>

<div className="initial-Header"><TopHeader /></div>
   
   <div className="header-left">
     <img className = "header-image" src={logo} alt="CSW Logo"/>
   </div>
   <div className="login-page-container">
     <ConfirmationAccountForm />
   </div>

 </div>
   );
 };
  
  export default ConfirmationAccount;