import React, { useState, useEffect } from "react";
import "./Notifications.css";
import "../services/notifications";
import { getUserNotifications } from "../services/notifications";
import { userStore } from "../stores/UserStore";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const token = userStore((state) => state.token);
  const userId = userStore((state) => state.userId);

  useEffect(() => {

    async function fetchNotifications(){
        const response = await getUserNotifications(token, userId);
        setNotifications(response);
      };


    fetchNotifications();
  }, []);
  

  console.log(notifications);
  return (
    <div>
      <div className="notifications-container">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              {notification.message}
            </div>
          ))
        ) : (
          <div className="no-notifications">Nenhuma notificação disponível</div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
