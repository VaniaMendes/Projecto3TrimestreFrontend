import React, { useState, useEffect } from "react";
import "./Notifications.css";
import "../services/notifications";
import { getUserNotifications, markeAsRead, totalPagesNotifications } from "../services/notifications";
import { userStore } from "../stores/UserStore";
import NotificationItem from "./NotificationItem";
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import { toast } from 'react-toastify';
import Pagination from './Pagination';

function Notifications() {

        // Get the locale from the userStore
        const locale = userStore((state) => state.locale);
        const intl = useIntl();

  const [notifications, setNotifications] = useState([]);

 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const token = userStore((state) => state.token);
  const userId = userStore((state) => state.userId);

  async function fetchNotifications(page) {
    try {
      const response = await getUserNotifications(token, userId, currentPage);
      setNotifications(response);
      const notificationPage = await totalPagesNotifications(token, userId);
      setTotalPages(notificationPage);

      console.log(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    }
  }

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);
  
  console.log(totalPages);
  console.log(currentPage);

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
      <div className="pagination">
        
      <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
      </div>
      </div>
      </IntlProvider>
    </div>
  );
}

export default Notifications;
