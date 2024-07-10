import React, { useEffect, useState } from "react";
import "./Messages.css";
import { useIntl } from "react-intl";
import MessageChat from "./MessageChat";
import { getUsersWithMessage } from "../services/messages";
import { userStore } from "../stores/UserStore";
import { getFilterUsers } from "../services/users";

function Messages() {
  const intl = useIntl();
  //Ge the userId and token from the userStore
  const userId = userStore((state) => state.userId);
  const token = userStore((state) => state.token);

  //State variables
  const [receiverId, setReceiverId] = useState(null);
  const [users, setUsers] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [showChat, setShowChat] = useState(false);
  const [showUsers, setShowUsers] = useState(true);

  //Fetch users with messages when the component mounts or when the prefix changes
  useEffect(() => {
    fecthUsers();
  }, [token]);

  //Fetch users with messages when the component mounts
  const fecthUsers = async () => {
    const response = await getUsersWithMessage(token);
    setUsers(response);
    if (response && response.length > 0) {
      setReceiverId(response[0].id);
    }
  };

  //useEffect to handle with the mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Function to filter users based on the prefix
  const handleFilterUser = async (e) => {
    setPrefix(e.target.value);
    if (e.target.value !== "") {
      const filteredUsers = await getFilterUsers(token, e.target.value);
      setUsers(filteredUsers);
    } else {
      fecthUsers();
    }
  };

  //Function to handle click on a user to open the chat in mobile device
  const handleSaveReceiver = (id) => {
    setReceiverId(id);
    if (isMobile) {
      setShowChat(true);
      setShowUsers(false);
    }
  };

  //Function to handle click on the back button to go back to the users list im mobile device
  const handleBackToUsers = () => {
    setShowChat(false);
    setShowUsers(true);
  };

  return (
    <div>
      <div className="message-external-container">
        <div className="message-container">
          {showUsers && (
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
                {users &&
                  users.map((user, index) => (
                    <div
                      className="info-user-message-external"
                      key={index}
                      onClick={() => handleSaveReceiver(user.id)}
                    >
                      <div className="info-user-message">
                        <div className="photo-message">
                          <img src={user.photo} alt="user-photo" />
                        </div>
                        <p className="user-firstName">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {(!isMobile || showChat) && (
            <MessageChat
              receiverId={receiverId}
              handleBackToUsers={handleBackToUsers}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
