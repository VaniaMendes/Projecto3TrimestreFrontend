
import React from 'react';
import Header from "../components/header/Header";
import Profile from "../components/Profile";
import { IntlProvider } from "react-intl";
import languages from "../translations";
import {userStore} from "../stores/UserStore";


const UserProfile = () =>{
     // Get the locale from the userStore
   const locale = userStore((state) => state.locale);
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