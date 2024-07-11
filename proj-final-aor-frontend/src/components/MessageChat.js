import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { userStore } from "../stores/UserStore";
import { useIntl } from "react-intl";
import {
  sendMessage,
  getMessages,
  getPageCountBetweenTwoUsers,
  markMessageAsRead,
} from "../services/messages";
import { getUserById } from "../services/users";
import { toast } from "react-toastify";
import moment from "moment";
import "./Messages.css";
import userLogo from "./assets/profile_pic_default.png";
import { RiCheckDoubleLine } from "react-icons/ri";
import { RiCheckLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoChevronBackCircleSharp } from "react-icons/io5";

const MessageChat = (props) => {
  //Destructure props to extract specific values
  const { receiverId, handleBackToUsers } = props;

  const intl = useIntl();
  const navigate = useNavigate();

  //State variables
  const userId = userStore((state) => state.userId);
  const token = userStore((state) => state.token);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState({
    receiver: { id: receiverId },
    subject: "",
    content: "",
    sender: { id: userId },
  });

  const [showButton, setShowButton] = useState(false);


  //UseEffect to get the information nedded into the chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setMessage({
          receiver: { id: receiverId },
          subject: "",
          content: "",
          sender: { id: userId },
        });

        //When the component is mounted, we set the current page to 0 and the number of pages to 0
        setCurrentPage(0);
        setPages(0);

        //Fetch the messages from the backend for the current page and receiver id
        const response = await getMessages(token, receiverId, currentPage);
        setMessages(response);

        //Fetch the user information from the backend for the receiver id
        const userData = await getUserById(token, receiverId);
        setUser(userData);

        //Fetch the number of pages between the current user and the receiver user
        const numberOfPages = await getPageCountBetweenTwoUsers(
          token,
          receiverId
        );
        
        setPages(numberOfPages - 1);
        setShowButton(numberOfPages > 1);

        //Adjust for mobile
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      } catch (error) {}
    };
    fetchMessages();
  }, [token, receiverId, userId, currentPage]);


  //UseEffect to get the connection with the websocket
  useEffect(() => {
    const WS_URL = "ws://localhost:8080/project_backend/websocket/message/";
    const websocket = new WebSocket(WS_URL + token);
    websocket.onopen = () => {
      console.log("WebSocket connection for chat messages is open");
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);

      if (
        message.receiver &&
        message.receiver.id !== null &&
        message.sender.id === receiverId
      ) {
        if (message.readStatus === true) {
          // Replace the message in the list
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === message.id ? { ...msg, ...message } : msg
            )
          );
        } else {
          // Extract the sendTimestamp array
          const [year, month, day, hour, minute, second] =
            message.sendTimestamp;

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

          // Add the new message to the list
          setMessages((prevMessages) => [message, ...prevMessages]);
        }
      }
    };

    return () => {
      websocket.close();
    };
  }, [token, messages, receiverId]);


  //Handle events to save the information about the new message
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevMessage) => ({
      ...prevMessage,
      [name]: value,
    }));
  };

  //Handle events to send a new message
  const handleSendMessage = async () => {
    //Check if the message content is not empty before sending it
    if (!message.content.trim()) {
      const errorMessage = intl.formatMessage({
        id: "pleaseEnterConstentforMessage",
      });
      toast.warning(errorMessage);
      return;
    }
    try {
      //Send the message to the backend
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
          sender: { id: userId },
        });
      } else {
        const errorMessage = intl.formatMessage({ id: "messageChat2" });
        toast.error(errorMessage);
      }
    } catch (error) {}
  };

  //Handle events to load more messages
  const loadMessages = async (page) => {
    try {
      const response = await getMessages(token, receiverId, page);
      if (response && typeof response[Symbol.iterator] === "function") {
        setMessages((prevMessages) => [...prevMessages, ...response]);
        setCurrentPage(page);
      } else {
        setShowButton(false);
      }
    } catch (error) {}
  };

  //Handle to change the next page of messages
  const handleShowMore = () => {
    if (currentPage < pages) {
      loadMessages(currentPage + 1);
    }
  };


  //Mark message as read
  const handleMarkAsRead = async (messageId) => {
    try {
      const result = await markMessageAsRead(token, messageId);
      if (result === 200) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, readStatus: true } : msg
          )
        );
      } else {
      }
    } catch (error) {
      const message = intl.formatMessage({ id: "messageChat3" });
      toast.error(message);
    }
  };

  //Function to click in user photo e navigate to the user profile
  const handleSeeProfile = (visibility, userId) => {
    if (visibility) {
      navigate(`/profile/${userId}`);
    } else {
      toast.error(intl.formatMessage({ id: "messageChat4" }));
    }
  };


  //Format time of message received
  const formatTimestamp = (timestamp) => {
    const now = moment();
    const messageTime = moment(timestamp);
    const diffInHours = now.diff(messageTime, "hours");
    //If the message time is less than 24 hours, we show the time from now
    if (diffInHours < 24) {
      return messageTime.fromNow();
      //If the message time is more than 24 hours, we show the date and time
    } else {
      return messageTime.format("DD/MM/YYYY HH:mm");
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
        <div
          className="photo-message"
          onClick={() => handleSeeProfile(user.visibilityState, user.id)}
        >
          {user && user.photo ? (
            <img src={user.photo} alt=" Photo" />
          ) : (
            <img src={userLogo} alt="Logo" />
          )}
        </div>
        <div
          className="sender-name-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 className="sender-name">
            {!receiverId
              ? intl.formatMessage({ id: "chooseUserToSendFirstMessage" })
              : `${user?.firstName} ${user?.lastName}`}
          </h1>
          {isMobile && (
            <IoChevronBackCircleSharp
              className="icon-back"
              onClick={handleBackToUsers}
            />
          )}
        </div>
      </div>
      <div className="message-body">
        {messages &&
          messages.map((msg, index) => (
            <div
              className={`message ${
                msg.sender.id === userId ? "sender-message" : "receiver-message"
              } ${!msg.readStatus ? "" : "read-message"}`}
              key={index}
              onClick={() => handleMarkAsRead(msg.id)}
            >
              <p className="subject">{msg.subject}</p>
              <p>{msg.content}</p>
              <div className="ckeck-message">
                <span className="timestamp">
                  {formatTimestamp(msg.sendTimestamp)}
                </span>
                {msg.readStatus && (
                  <RiCheckDoubleLine
                    title={intl.formatMessage({ id: "read" })}
                  />
                )}
                {!msg.readStatus && (
                  <RiCheckLine title={intl.formatMessage({ id: "unread" })} />
                )}
              </div>
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
};

export default MessageChat;
