import React, {useState} from 'react';
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import { userStore } from '../stores/UserStore';
import { FiSend } from "react-icons/fi";
import { sendMessageToProject, getMessagesForProject } from "../services/messages";
import {toast} from 'react-toastify';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

function ProjectChat(props) {
    const { projectId } = props;


    const token = userStore((state) => state.token);
    const [message, setMessage] = useState({});
    const [messagesList, setMessagesList] = useState([]);

     // Get the locale from the userStore
  const locale = userStore((state) => state.locale);
  const intl = useIntl();

    // Estado para controlar a visibilidade das mensagens
    const [showMessages, setShowMessages] = useState(false);
  
    // Função para alternar a visibilidade
    const toggleMessages = () => {
      setShowMessages(!showMessages);
      fetchMessages();
    };

    const fetchMessages = async () => {
        const result = await getMessagesForProject(token, projectId);
        setMessagesList(result);
    };
  

    const handleInputChange = (e) => {
        setMessage({ ...message, content: e.target.value });
    };


    const handleSendMessage = async() => {
        const result = await sendMessageToProject(token, message, projectId);
        if(result === 200){
            toast.success(intl.formatMessage({ id: "messageSent" }));
            setMessage({content: ""});
           
        }
    };

  

    return (
        <div>
            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className={`project-chat-bar ${showMessages ? 'expanded' : ''}`} onClick={toggleMessages}>
                    <span>Project Chat</span><MdOutlineKeyboardArrowDown className = "icon-expand"/>
                </div>
                {showMessages && (
                    <div className="project-messages">
                        
                        <div className="messages-content">
                        {messagesList && messagesList.map((msg, index) => (
    <div key={index} className="message-item">
       
        <span className="message-sender">
            {msg.sender.firstName} {msg.sender.lastName}
        </span>
        <span className="message-content">{msg.content}</span>
        <img src={msg.sender.photo} alt="Sender" className="photo-message" />
    </div>
))}

                        </div>
                        <input className="send-message-project" placeholder
                         value={message.content} // Valor do input vinculado ao estado message.content
                         onChange={handleInputChange}
                         /><span className="send-icon" onClick={handleSendMessage}>
          <FiSend />
        </span>
                    </div>
                )}
            </IntlProvider>
        </div>
    );
}

export default ProjectChat;