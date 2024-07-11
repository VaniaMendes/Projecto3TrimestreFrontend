import React, { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import { FiSend } from "react-icons/fi";
import {
  sendMessageToProject,
  getMessagesForProject,
} from "../services/messages";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import moment from "moment";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import logoUser from "./assets/profile_pic_default.png";

function ProjectChat(props) {
  //Destructure the props object
  const { projectId } = props;

  //Get the token and userId from the userStore
  const token = userStore((state) => state.token);
  const userId = userStore((state) => state.userId);

  //State variables
  const [message, setMessage] = useState({});
  const [messagesList, setMessagesList] = useState([]);
  const endOfPageRef = useRef(null);
  const [showMessages, setShowMessages] = useState(false);
  const intl = useIntl();

 

  //Fecth messages to end of page
  const scrollToBottom = () => {
    endOfPageRef.current?.scrollIntoView({ behavior: "auto" });
  };

//Function to show messages in mobile
  const toggleMessages = () => {
    setShowMessages(!showMessages);
    fetchMessages();

  };

  //Fetch messages when component mounts
  const fetchMessages = async () => {
    const result = await getMessagesForProject(token, projectId);
    setMessagesList(result);
    scrollToBottom();
  };

  //Handle change in input fields to send a new message
  const handleInputChange = (e) => {
    setMessage({ ...message, content: e.target.value });
  };


  //Handle sending a new message
  const handleSendMessage = async () => {
    const result = await sendMessageToProject(token, message, projectId);
    if (result === 200) {
    
      // Add the new message to messages list

      setMessage({ ...message, content: "" });
      scrollToBottom(); 
    }
  };


  //UseEffect to control the scroll in the principal page
  useEffect(() => {
    if (showMessages) {
        document.body.classList.add('body-no-scroll');
    } else {
        document.body.classList.remove('body-no-scroll');
    }

    // clean
    return () => {
        document.body.classList.remove('body-no-scroll');
    };
}, [showMessages]);


//UseEffect to send a message or received from the websocket connection
  useEffect(() => {
    const WS_URL = "ws://localhost:8080/project_backend/websocket/message/";
    const websocket = new WebSocket(WS_URL + token);
    websocket.onopen = () => {
      console.log("WebSocket connection for chat project is open");
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const messageProjectId = parseInt(message.projectId, 10);
      const currentProjectId = parseInt(projectId, 10);

      if (messageProjectId === currentProjectId) {
        // Extract the sendTimestamp array
        const [year, month, day, hour, minute, second] = message.sendTimestamp;

        // Create a Date object. Note: month is 0-indexed in JavaScript Date, hence the -1 adjustment.
        const date = new Date(year, month - 1, day, hour, minute, second);

        // Format the date into a readable string. Adjust the format as needed.
        const formattedDate = date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        // Update the message's timestamp with the formatted date
        message.sendTimestamp = formattedDate;

        if (messagesList && messagesList.length > 0) {
          setMessagesList((prevMessages) => [...prevMessages, message]);
          scrollToBottom();
        } else {
          setMessagesList([message]);
        }
      }
    };

    return () => {
      websocket.close();
    };
  }, [token, messagesList, projectId]);



 // Efect to open the component with scroll in bottom
useEffect(() => {
  if (showMessages) {
    scrollToBottom();
    document.body.classList.add('body-no-scroll');
  } else {
    document.body.classList.remove('body-no-scroll');
  }

  // Clean
  return () => {
    document.body.classList.remove('body-no-scroll');
  };
}, [showMessages, messagesList]);
  

//Format time of message
  const formatTimestamp = (timestamp) => {
    const now = moment();
    const messageTime = moment(timestamp);
    const diffInHours = now.diff(messageTime, "hours");
    if (diffInHours < 24) {
      return messageTime.fromNow();
    } else {
      return messageTime.format("DD/MM/YYYY HH:mm");
    }
  };

  //Check if the message is from the current user
  const isSender = (senderId) => {
    if (senderId && senderId === userId) {
      return true;
    }
    return false;
  };

  return (
    <div>
      <div
        className={`modal-backdrop-project ${
          showMessages ? "active" : "inative"
        }`}
      >
        <div
          className={`project-chat-bar ${showMessages ? "expanded" : ""}`}
          onClick={toggleMessages}
        >
          <div className="chat-container">
            <HiOutlineChatBubbleOvalLeftEllipsis className="icon-chat" />
            <span className="project-title">
              {intl.formatMessage({ id: "messages" })}
            </span>
            {showMessages ? (
              <MdOutlineKeyboardArrowDown className="icon-expand" />
            ) : (
              <MdOutlineKeyboardArrowUp className="icon-expand" />
            )}
          </div>
        </div>
        {showMessages && (
          <div className="project-messages">
            <div className="messages-content">
              {messagesList &&
                messagesList.map((msg, index) => (
                  <div
                    key={index}
                    className={`message-project-item ${
                      isSender(msg.sender.id)
                        ? "project-sender"
                        : "project-receiver"
                    }`}
                  >
                    <img
                      src={msg.sender.photo ? msg.sender.photo : logoUser}
                      alt="Sender"
                      className="photo-message"
                    />
                    <div className="message-project-wrapper">
                      <div className="message-project-header">
                        <span className="message-project-sender">
                          {msg.sender.firstName} {msg.sender.lastName}
                        </span>
                        <span className="message-project-time">
                          {formatTimestamp(msg.sendTimestamp)}
                        </span>
                      </div>
                      <span className="message-project-content">
                        {msg.content}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={endOfPageRef} /> {/* This should be the last element inside your messages container */}
            </div>
            <div className="project-input-message">
              <input
                className="send-message-project"
                placeholder={intl.formatMessage({ id: "writeYourMessage" })}
                value={message.content}
                onChange={handleInputChange}
              />
              <span className="send-icon" onClick={handleSendMessage}>
                <FiSend />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectChat;
