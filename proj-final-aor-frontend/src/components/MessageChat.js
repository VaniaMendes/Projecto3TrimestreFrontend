import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { userStore } from "../stores/UserStore";
import { useIntl, FormattedMessage  } from "react-intl";
import { sendMessage, getMessages, getPageCountBetweenTwoUsers, markMessageAsRead } from "../services/messages";
import { getUserById } from "../services/users";
import { toast } from "react-toastify";
import moment from "moment";
import './Messages.css'
import userLogo from './assets/profile_pic_default.png';
import { RiCheckDoubleLine } from "react-icons/ri";
import {useNavigate} from 'react-router-dom';
import { notificationStore } from "../stores/NotificationStore";

const MessageChat = (props) => {
  const { receiverId  } = props;
  const { incrementNotification } = notificationStore.getState();


  const intl = useIntl();
  const navigate = useNavigate();
  
  const userId = userStore((state) => state.userId);
  const token = userStore((state) => state.token);
 


const[pages, setPages] = useState(0);
const [currentPage, setCurrentPage] = useState(0);
const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState({
    receiver: { id: receiverId },
    subject: "",
    content: "",
    sender: { id: userId }
  });


  const [showButton, setShowButton] = useState(false);


  useEffect(() => {
    const fetchMessages = async () => {
      try {

        setMessage({
          receiver: { id: receiverId },
          subject: "",
          content: "",
          sender: { id: userId },
        });
        
  
        setCurrentPage(0);
        setPages(0);
        const response = await getMessages(token, receiverId,currentPage);
        setMessages(response);
  
        const userData = await getUserById(token, receiverId);
        setUser(userData);

        const numberOfPages = await getPageCountBetweenTwoUsers(token, receiverId);
        setPages(numberOfPages-1);

        setShowButton(numberOfPages > 1);
      } catch (error) {
   
      }
    };
    fetchMessages();
  }, [token, receiverId, userId]);

  useEffect(() => {
    const WS_URL = "ws://localhost:8080/project_backend/websocket/notifier/";
    const ws = new WebSocket(WS_URL + token);
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
  
      // Verifica o tipo da mensagem recebida
      if (data.type === 'message') {
        // Processa uma nova mensagem
        console.log("Received a new message:", data.message);
        setMessages((prevMessages) => [...prevMessages, data.message]);
      } else if (data.type === 'notification') {
        // Processa uma nova notificação
        console.log("Received a new notification:", data.notification);
        // Aqui você pode atualizar o estado das notificações ou fazer qualquer outra ação necessária
      }
    };
  
    return () => {
      ws.close();
    };
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevMessage) => ({
      ...prevMessage,
      [name]: value,
    }));
  };

  const handleSendMessage = async () => {
    if (!message.content.trim()) {
      const errorMessage = intl.formatMessage({ id: "pleaseEnterConstentforMessage" });
      toast.warning(errorMessage);
      return;
    }
    try {
      const result = await sendMessage(token, message);
      if (result === 200) {
        setMessages((prevMessages) => {
        if (Array.isArray(prevMessages)) {
          return [message, ...prevMessages]; 
        } else {
          return [message]; 
                }
      });
        setMessage({
          receiver: { id: receiverId },
          subject: "",
          content: "",
          sender: { id: userId }
        });
      } else {
        const errorMessage = intl.formatMessage({ id: "messageChat2" });
        toast.error(errorMessage);
     
      }
    } catch (error) {
      
    }
  };


  const loadMessages = async (page) => {
    try {
      const response = await getMessages(token, receiverId, page);
      if (response && typeof response[Symbol.iterator] === 'function') {
        setMessages((prevMessages) => [...prevMessages, ...response]);
        setCurrentPage(page);
      } else {
        setShowButton(false);
      }
    } catch (error) {
      
    }
  };

  const handleShowMore = () => {
    if (currentPage < pages) {
      loadMessages(currentPage + 1);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const result = await markMessageAsRead(token, messageId);
      if (result===200) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, readStatus: true } : msg
          )
        );
      } else {
        
      }
    } catch (error) {
      const message = intl.formatMessage({ id:"messageChat3"})
      toast.error(message);
    }
  };

  const handleSeeProfile = (visibility,userId) =>{
    if(visibility){
    navigate(`/profile/${userId}`);
  }else{
    toast.error(intl.formatMessage({ id:"messageChat4"}));
  }
}

const formatTimestamp = (timestamp) => {
  const now = moment();
  const messageTime = moment(timestamp);
  const diffInHours = now.diff(messageTime, 'hours');
  if (diffInHours < 24) {
    return messageTime.fromNow();
  } else {
    return messageTime.format('DD/MM/YYYY HH:mm');
  }
};



  return (
    <div className="detail-message">
        <div className="input-profile">
                <label className="label-profile-message" htmlFor="messages">
                  {intl.formatMessage({ id: "messages" })}
                </label>
              </div>
<div className="header-messageChat">
              <div className="photo-message"  onClick={() => handleSeeProfile(user.visibilityState, user.id)}> 
              {user && user.photo ? (
                  <img src={user.photo} alt=" Photo" />
                ) : (
                  <img src={userLogo} alt="Logo"  />
                )}
                 </div>
      <h1 className="sender-name">
      {!receiverId ? intl.formatMessage({ id: "chooseUserToSendFirstMessage"}) : `${user?.firstName} ${user?.lastName}`}


      </h1></div>
      <div className="message-body">
      {messages && messages.map((msg, index) => (
          <div
          className={`message ${msg.sender.id === userId ? "sender-message" : "receiver-message"} ${!msg.readStatus ? "unread-message" : "read-message"}`}
            key={index}
            onClick={() => handleMarkAsRead(msg.id)}
          >
        
            <p className="subject">{msg.subject}</p>
            <p>{msg.content}</p>
            <div className="ckeck-message">
            <span className="timestamp">{formatTimestamp(msg.sendTimestamp)}</span>
            {msg.readStatus && <RiCheckDoubleLine />} </div>
       
          </div>
        ))}
</div>
{showButton && currentPage < pages && (
        <span className="show-more-message" onClick={handleShowMore}>
          {intl.formatMessage({ id: "showMore" })}
        </span>
      )}
      <input
        className="subject-input"
        type="text"
        name="subject"
        value={message.subject}
        placeholder={intl.formatMessage({ id: "subject" })}
        onChange={handleChange}
      />
      <div className="message-input-container">
        <textarea
          value={message.content}
          name="content"
          className="message-input"
          placeholder={intl.formatMessage({ id: "writeYourMessage" })}
          onChange={handleChange}
        />
        <span className="send-icon" onClick={handleSendMessage}>
          <FiSend />
        </span>
      </div>
    </div>
  );
}

export default MessageChat;
