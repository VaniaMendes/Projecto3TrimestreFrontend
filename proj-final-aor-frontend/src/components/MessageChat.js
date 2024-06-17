import React, {useEffect, useState} from 'react';
import { FiSend } from "react-icons/fi";
import { userStore } from '../stores/UserStore';
import { useIntl } from "react-intl";
import {sendMessage, getMessages} from "../services/messages";
import {getUserById} from "../services/users";
import { toast } from 'react-toastify';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {

  MessageList,
  Message,
} from "@chatscope/chat-ui-kit-react";


function MessageChat ({receiverId}){

   // Get the locale from the userStore
   const intl = useIntl();
   const userId = userStore((state) => state.userId);
   const token = userStore((state) => state.token);

   const [messages, setMessages] = useState([]);
   const [user, setUser] = useState({});


   const [message, setMessage] = useState({
    receiver: {
      id: 2
    },
    subject: '',
    content: '',
    sender: {
        id: userId
      },
  });

 

  useEffect(() => {

    const fetchMessages = async () => {
        const response = await getMessages(token, 2);
        setMessages(response);
        

        //const user = await getUserById(token, receiverId);
        setUser(user);
    };
    fetchMessages();
    }, []);
    
    console.log(user)

    const handleChange = (e) => {
        setMessage({ ...message, [e.target.name]: e.target.value });
      };

      const handleSendMessage = async () => {


         // Check if the fields are empty
  if (!message.content.trim() || !message.subject.trim()) {
    toast.error("Please enter a subject or a content");
    return;
  }
        const result = await sendMessage(token, message)
        if(result === 200 ){
            toast.success("Message sent successfully")
          setMessage(message);
        }else{
            toast.error("Something went wrong. Please try again")
        }

      };

    return (
      
             <div className="detail-message">
            <h1 className="sender-name">Nome do destinatário</h1>
            <MessageList>
  {messages && messages.map((msg, index) => (
    <Message className = "format-message"
      key={index}
      model={{
        message: msg.content,
        
      }}
    />
  ))}
</MessageList>
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
              name = "content"
              type="text"
                className="message-input"
                placeholder={intl.formatMessage({ id: "writeYourMessage" })}
                onChange={handleChange}
              ></textarea>
              <span className="send-icon" onClick={handleSendMessage}>
                <FiSend />
              </span>
            </div>
          </div>

    )
}

export default MessageChat;