import React, {useEffect, useState} from "react";
import "./Messages.css";
import { useIntl } from "react-intl";
import MessageChat from "./MessageChat";
import {getUsersWithMessage} from "../services/messages";
import { userStore } from "../stores/UserStore";
import userLogo from './assets/profile_pic_default.png';
import {getFilterUsers} from "../services/users";



function Messages() {
  const intl = useIntl();
  const userId = userStore((state) => state.userId);
   const token = userStore((state) => state.token);

  const [receiverId, setReceiverId] = useState(null);
  const [users, setUsers] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [showChat, setShowChat] = useState(false);
  const[showUsers, setShowUsers] = useState(true);

  useEffect(() => {
    
    fecthUsers();
    }, []);

    const fecthUsers = async () => {
      const response = await getUsersWithMessage(token);
      setUsers(response);
      if (response && response.length > 0) {
        setReceiverId(response[0].id);
      }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    const handleFilterUser = async (e) => {
      setPrefix(e.target.value);
      if(e.target.value !== ""){
        const filteredUsers = await getFilterUsers(token, e.target.value);
        setUsers(filteredUsers); 
      
    }else{
      fecthUsers();
    }
  }

  const handleSaveReceiver = (id) => {
    setReceiverId(id);
    if (isMobile) {
      setShowChat(true);
      setShowUsers(false);

    }

  };

  const handleBackToUsers = () => {
    setShowChat(false);
    setShowUsers(true);
  };


  return (
    <div>
      
      <div className="message-external-container">
        <div className="message-container">
        {showUsers &&  (
          <div className="message-internal-container">
            
        
            <div className="bottom-menu-message">
              <input
                className="search-bar-message"
                type="search"
                value={prefix}
                placeholder="Search user..."
                onChange={handleFilterUser}
              />
             
              
            </div>
            <div className="print-messages">

            {users && users.map((user, index) => (
                <div className = "info-user-message-external" key={index} onClick={() => handleSaveReceiver(user.id)}>
                  <div className="info-user-message">
                 <div className="photo-message">
                  <img src={user.photo} alt="user-photo" />
                 </div>
                  <p className="user-firstName">{user.firstName} {user.lastName}</p>
                
                  </div>
                </div >
              ))}

            </div>
          </div>
             ) }  
          {(!isMobile || showChat) && <MessageChat receiverId={receiverId} handleBackToUsers={handleBackToUsers}/>}
       
        </div>
      </div>
     
    </div>
  );
}

export default Messages;
