
import React, {useEffect} from 'react';
import Header from "../components/header/Header";
import Profile from "../components/profile/Profile";
import {userStore} from "../stores/UserStore";

import {useNavigate} from "react-router-dom";


const UserProfile = () =>{
     
   const{token} = userStore();
   const navigate = useNavigate();

   useEffect(() => {
    if (!token) {
        navigate("/");
    }
}, [token, navigate]);

    return(
        
        <div>
            <Header/>
            <Profile/>
        </div>
    )
}

export default UserProfile;