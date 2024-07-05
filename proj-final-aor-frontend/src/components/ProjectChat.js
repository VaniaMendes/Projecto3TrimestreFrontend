import React, { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import { FiSend } from "react-icons/fi";
import {
  sendMessageToProject,
  getMessagesForProject,
} from "../services/messages";
import { toast } from "react-toastify";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import moment from "moment";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";

function ProjectChat(props) {
  const { projectId } = props;

  const token = userStore((state) => state.token);
  const userId = userStore((state) => state.userId);
  const [message, setMessage] = useState({});
  const [messagesList, setMessagesList] = useState([]);
  const endOfPageRef = useRef(null);

  const intl = useIntl();

  // Estado para controlar a visibilidade das mensagens
  const [showMessages, setShowMessages] = useState(false);

  const scrollToBottom = () => {
    endOfPageRef.current?.scrollIntoView({ behavior: "auto" });
  };

  // Função para alternar a visibilidade
  const toggleMessages = () => {
    setShowMessages(!showMessages);
    fetchMessages();

  };

  const fetchMessages = async () => {
    const result = await getMessagesForProject(token, projectId);
    setMessagesList(result);
    scrollToBottom();
  };

  const handleInputChange = (e) => {
    setMessage({ ...message, content: e.target.value });
  };

  const handleSendMessage = async () => {
    const result = await sendMessageToProject(token, message, projectId);
    if (result === 200) {
      toast.success(intl.formatMessage({ id: "messageSent" }));
      // Adicionar a nova mensagem à lista de mensagens

      setMessage({ ...message, content: "" });
      scrollToBottom(); 
    }
  };

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

 // Efeito para rolar para o final quando showMessages muda
 useEffect(() => {
  if (showMessages) {
    scrollToBottom();
  }
}, [showMessages, messagesList]);
  
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
                      src={msg.sender.photo}
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
