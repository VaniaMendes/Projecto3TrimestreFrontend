

import React from "react";
import ForgetPasswordForm from "../components/forms/ForgotPasswordForm.js";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import {userStore} from "../stores/UserStore";
import { IntlProvider } from "react-intl";
import languages from "../translations";
import TopHeader from "../components/header/TopHeader";

const ForgetPassword = () => {
   
      
   // Get the locale from the userStore
   const locale = userStore((state) => state.locale);
   return (
       
     <div>
     <IntlProvider locale={locale} messages={languages[locale]}> 
 <div className="initial-Header"><TopHeader /></div>
    
    <div className="header-left">
      <img className = "header-image" src={logo} alt="CSW Logo"/>
    </div>
    <div className="login-page-container">
      <ForgetPasswordForm />
    </div>
    </IntlProvider>
  </div>
    );
  };
  
  export default ForgetPassword;
