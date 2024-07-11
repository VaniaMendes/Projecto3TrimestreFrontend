import React, { useState, useEffect } from "react";
import "./Notifications.css";
import "../services/notifications";
import { getUserNotifications, markeAsRead, totalPagesNotifications, markAsOpen } from "../services/notifications";
import { userStore } from "../stores/UserStore";
import NotificationItem from "./NotificationItem";
import { useIntl } from "react-intl";
import { toast } from 'react-toastify';
import Pagination from './Pagination';
import { notificationStore } from "../stores/NotificationStore";
import {useNavigate} from 'react-router-dom';


/**
 * Renders a component that displays notifications and handles user interactions.
 
 */
function Notifications() {

  const intl = useIntl();

  //State variables
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  //Get the notifications from the notification store
  const { clearNotifications } = notificationStore();

  const navigate = useNavigate();


  //Get token e userId from the userStore
  const token = userStore((state) => state.token);
  const userId = userStore((state) => state.userId);


  //Fetch the notifications from the backende
  async function fetchNotifications() {
    try {
      const response = await getUserNotifications(token, userId, currentPage);
      setNotifications(response);
      //Fetch the total number of pages
      const notificationPage = await totalPagesNotifications(token, userId);
      setTotalPages(notificationPage);
      clearNotifications();
      //Mark the notification as open
      await markAsOpen(token);
     
    } catch (error) {
    }
  }

    useEffect(() => {
    fetchNotifications(currentPage);
    
  }, [currentPage, token, userId]);
  

  //Receveid the notification from the websocket
  useEffect(() => {
    const WS_URL = "ws://localhost:8080/project_backend/websocket/notifier/";
    const ws = new WebSocket(WS_URL + token);

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      newNotification.sendTimestamp = formatDateFromArray(newNotification.sendTimestamp);
      //If the notification is already in the list, remove it and add it again to begin the notifications
       if(newNotification.type === "MESSAGE_RECEIVED" || newNotification.type === "MESSAGE_PROJECT"){
         setNotifications(prevList => {
          const filteredList = prevList.filter(notification => notification.sender.id !== newNotification.sender.id);
          return[newNotification, ...filteredList];
         });
       }else{
        setNotifications(prevList => [newNotification, ...prevList]);

       }
       
    };

   
  }, [token]);

  

  //Format the date and time
  function formatDateFromArray(dateArray) {
    // Cria um objeto Date usando os valores do array
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);

    // Formata a data e hora
    const year = date.getFullYear().toString().slice(-2); // Pega os dois últimos dígitos do ano
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda se necessário
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');

    // Retorna a data formatada
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }


  //Mark the notification as read
  const markAsRead = async (notificationId) => {
    const result = await markeAsRead(token, notificationId);
    if(result === 200) {
      fetchNotifications();
      toast.success("Notificação marcada como lida com sucesso");

      
    }else{
      toast.warning("Falha ao marcar como lida");
    }
  };


  //Function do handle wtih a click in the notification
  const handleNotificationClick = (notification) => {
    if(!notification.readStatus){
    markAsRead(notification.id);
    if (notification.type === "MESSAGE_RECEIVED") {
      clearNotifications();
      navigate(`/messages/${notification.sender.id}`);
    } else {
      navigate(`/project/${notification.relatedIDEntity}`);
    }
    }else{
    if (notification.type === "MESSAGE_RECEIVED") {
      clearNotifications();
      navigate(`/messages/${notification.sender.id}`);
    } else {
      navigate(`/project/${notification.relatedIDEntity}`);
    }
  }
  };

  
  return (
    <div >
        
         <div className="notification-container">
         <div className="notification-external-container">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
           
            <NotificationItem key={notification.id} notification={notification}
            onClick={() => handleNotificationClick(notification)}
/>
                    
          ))
        ) : (
          <div className="no-notifications"> {intl.formatMessage({ id: "noNBotificationsAvailable" })}</div>
        )}
      </div>
      <div className="pagination">
        {totalPages > 1 && (
        
      <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(currentPage) => setCurrentPage(currentPage)}
            />)}
      </div>
      </div>
     
    </div>
  );
}

export default Notifications;
