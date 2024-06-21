import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { userStore } from "../stores/UserStore";
import { useIntl } from "react-intl";
import { sendMessage, getMessages, getPageCountBetweenTwoUsers } from "../services/messages";
import { getUserById } from "../services/users";
import { toast } from "react-toastify";
import moment from "moment";
import './Messages.css'

const MessageChat = (props) => {
  const { receiverId  } = props;


  const intl = useIntl();
  
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
  console.log("receiver" + receiverId);

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
        setPages(numberOfPages);

        setShowButton(numberOfPages > 1);
      } catch (error) {
        toast.error("Failed to fetch messages or user details");
      }
    };
    fetchMessages();
  }, [token, receiverId, userId]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevMessage) => ({
      ...prevMessage,
      [name]: value,
    }));
  };

  const handleSendMessage = async () => {
    if (!message.content.trim()) {
      toast.error("Please enter content for the message");
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
        toast.error("Something went wrong. Please try again");
      }
    } catch (error) {
      toast.error("Failed to send message");
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
      toast.error("Failed to fetch messages");
    }
  };

  const handleShowMore = () => {
    if (currentPage < pages) {
      loadMessages(currentPage + 1);
    }
  };



  return (
    <div className="detail-message">
        <div className="input-profile">
                <label className="label-profile-message" htmlFor="messages">
                  {intl.formatMessage({ id: "messages" })}
                </label>
              </div>

              
      <h1 className="sender-name">
      {!receiverId ? intl.formatMessage({ id: "chooseUserToSendFirstMessage"}) : `${user?.firstName} ${user?.lastName}`}

      </h1>
      <div className="message-body">
      {messages && messages.map((msg, index) => (
          <div
            className={`message ${msg.sender.id === userId ? "sender-message" : "receiver-message"}`}
            key={index}
          >
        
            <p className="subject">{msg.subject}</p>
            <p>{msg.content}</p>
            <span className="timestamp"> {moment(msg.sendTimestamp).fromNow()}</span>
       
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
