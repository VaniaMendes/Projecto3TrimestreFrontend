import React from "react";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import LoginForm from "../components/forms/LoginForm";
import {userStore} from "../stores/UserStore";
import { IntlProvider } from "react-intl";
import languages from "../translations";
import TopHeader from "../components/header/TopHeader";

const Login = () => {

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
        <LoginForm />
      </div>
      </IntlProvider>
    </div>
  );
};

export default Login;