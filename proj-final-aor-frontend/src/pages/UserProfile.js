
import React, {useEffect} from 'react';
import Header from "../components/header/Header";
import Profile from "../components/profile/Profile";
import { IntlProvider } from "react-intl";
import languages from "../translations";
import {userStore} from "../stores/UserStore";

import {useNavigate} from "react-router-dom";


const UserProfile = () =>{
     // Get the locale from the userStore
   const{ locale, token} = userStore();
   const navigate = useNavigate();

   useEffect(() => {
    if (!token) {
        navigate("/");
    }
}, [token, navigate]);

    return(
        
        <div>
            <IntlProvider locale={locale} messages={languages[locale]}> 
            <Header/>
            <Profile/>
            </IntlProvider>
        </div>
    )
}

export default UserProfile;