import React from "react";
import Header from "../components/header/Header";
import Notifications from "../components/Notifications";
import {userStore} from "../stores/UserStore";


const NotificationsPage = () =>{
    
   return( 
       <div>
           <Header/>
           <Notifications/>
       </div>
   )
}

export default NotificationsPage;