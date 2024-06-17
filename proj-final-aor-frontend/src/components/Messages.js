import React from 'react';
import './Messages.css'
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import { toast } from 'react-toastify';
import { GoFilter } from "react-icons/go";
import { GoPlusCircle } from "react-icons/go";
import { FiSend } from "react-icons/fi";

function Messages (){

    const intl = useIntl();


    return (
        <div>
            <div className = "message-external-container">
                <div className= "message-container">
                <div className="message-internal-container">
                <div className="input-profile">
                <label className="label-profile" htmlFor="biography">
                  {intl.formatMessage({ id: "messages" })}
                </label>


              </div>
              
              <div className="bottom-menu-message">
              <input
                className= "search-bar-message"
                type="search"
                placeholder="Search user..."
              />
              <div className="filter-icon-message"><GoFilter/></div>
              <div className="plus-icon-message"><GoPlusCircle/></div>

              </div>
<div className = "print-messages">


    
              </div>



             

              </div>
              {/* Container das mensagens indivisuais*/}

<div className="detail-message">




<h1 className="sender-name">Nome do Remetente</h1>
  <div className="message-body"></div>
  <input className="subject-input" type="text" placeholder="Assunto" />
  <div className="message-input-container">
              <textarea className="message-input" placeholder="Escreva a mensagem aqui"></textarea>
              <span className="send-icon"><FiSend /></span>
            </div>
    
</div>
                </div>
            </div>
          
        </div>
    )
}

export default Messages;