import React, {useState} from "react";
import "./Messages.css";
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import { toast } from "react-toastify";
import { GoFilter } from "react-icons/go";
import { GoPlusCircle } from "react-icons/go";
import MessageChat from "./MessageChat";


function Messages() {
  const intl = useIntl();

  const [receiverId, setReceiverId] = useState(null);

  return (
    <div>
      <div className="message-external-container">
        <div className="message-container">
          <div className="message-internal-container">
            <div className="input-profile">
              <label className="label-profile" htmlFor="biography">
                {intl.formatMessage({ id: "messages" })}
              </label>
            </div>

            <div className="bottom-menu-message">
              <input
                className="search-bar-message"
                type="search"
                placeholder="Search user..."
              />
              <div className="filter-icon-message">
                <GoFilter />
              </div>
              <div className="plus-icon-message">
                <GoPlusCircle />
              </div>
            </div>
            <div className="print-messages"></div>
          </div>
          {/* Container das mensagens indivisuais*/}
<MessageChat receiverId={receiverId}/>
         
        </div>
      </div>
    </div>
  );
}

export default Messages;
