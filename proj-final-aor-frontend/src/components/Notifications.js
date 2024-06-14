import React, { useState, useEffect } from "react";
import "./Notifications.css";
import "../services/notifications";
import { getUserNotifications, markeAsRead } from "../services/notifications";
import { userStore } from "../stores/UserStore";
import NotificationItem from "./NotificationItem";
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import { toast } from 'react-toastify';

function Notifications() {

        // Get the locale from the userStore
        const locale = userStore((state) => state.locale);
        const intl = useIntl();

  const [notifications, setNotifications] = useState([]);

  const token = userStore((state) => state.token);
  const userId = userStore((state) => state.userId);

  async function fetchNotifications(){
    const response = await getUserNotifications(token, userId);
    setNotifications(response);
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  

  const markAsRead = async (notificationId) => {
    const result = await markeAsRead(token, notificationId);
    if(result === 200) {
      fetchNotifications();
      toast.success("Notificação marcada como lida com sucesso");
    }else{
      toast.warning("Falha ao marcar como lida");
    }
  };

  
  return (
    <div >
         <IntlProvider locale={locale} messages={languages[locale]}>
         <div className="notification-container">
         <div className="notification-external-container">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
           
            <NotificationItem key={notification.id} notification={notification}
            onClick={() => markAsRead(notification.id)}
            />
            
          
          ))
        ) : (
          <div className="no-notifications"> {intl.formatMessage({ id: "noNBotificationsAvailable" })}</div>
        )}
      </div>
      </div>
      </IntlProvider>
    </div>
  );
}

export default Notifications;
