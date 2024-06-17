import React from "react";
import Messages from "../components/Messages";
import {userStore} from "../stores/UserStore";
import { IntlProvider } from "react-intl";
import languages from "../translations";
import Header from "../components/header/Header";

const MessagesPage = () => {

  // Get the locale from the userStore
   
    const locale = userStore((state) => state.locale);
    return(
        
        <div>
            <IntlProvider locale={locale} messages={languages[locale]}> 
            <Header/>
            <Messages/>
            </IntlProvider>
        </div>
 
   )
}

export default MessagesPage;