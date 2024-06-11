import React from "react";
import Header from "../components/header/Header";
import Notifications from "../components/Notifications";
import { IntlProvider } from "react-intl";
import languages from "../translations";
import {userStore} from "../stores/UserStore";


const NotificationsPage = () =>{
    // Get the locale from the userStore
  const locale = userStore((state) => state.locale);
   return(
       
       <div>
           <IntlProvider locale={locale} messages={languages[locale]}> 
           <Header/>
           <Notifications/>
           </IntlProvider>
       </div>
   )
}

export default NotificationsPage;