import React, { useState, useEffect } from "react";
import "./Notifications.css";
import "../services/notifications";
import { getUserNotifications, markeAsRead, totalPagesNotifications } from "../services/notifications";
import { userStore } from "../stores/UserStore";
import NotificationItem from "./NotificationItem";
import { useIntl } from "react-intl";
import { toast } from 'react-toastify';
import Pagination from './Pagination';
import { notificationStore } from "../stores/NotificationStore";
import {useNavigate} from 'react-router-dom';

function Notifications() {

  const intl = useIntl();

  const [notifications, setNotifications] = useState([]);
  const { incrementNotification } = notificationStore.getState();

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const token = userStore((state) => state.token);
  const userId = userStore((state) => state.userId);

  async function fetchNotifications() {
    try {
      const response = await getUserNotifications(token, userId, currentPage);
      setNotifications(response);
      const notificationPage = await totalPagesNotifications(token, userId);
      setTotalPages(notificationPage);

    } catch (error) {
    }
  }

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, token, userId]);
  
  useEffect(() => {
    const WS_URL = "ws://localhost:8080/project_backend/websocket/notifier/";
    const ws = new WebSocket(WS_URL + token);

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      newNotification.sendTimestamp = formatDateFromArray(newNotification.sendTimestamp);
      
       if(newNotification.type === "MESSAGE_RECEIVED"){
         setNotifications(prevList => {
          const filteredList = prevList.filter(notification => notification.sender.id !== newNotification.sender.id);
          return[newNotification, ...filteredList];
         });
       }else{
        setNotifications(prevList => [newNotification, ...prevList]);

       }
       
    };

   
  }, [token]);

  
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




  const markAsRead = async (notificationId) => {
    const result = await markeAsRead(token, notificationId);
    if(result === 200) {
      fetchNotifications();
      toast.success("Notificação marcada como lida com sucesso");

      
    }else{
      toast.warning("Falha ao marcar como lida");
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === "MESSAGE_RECEIVED") {
      navigate(`/messages/${userId}`);
    }
    if(notification.type === "MESSAGE_PROJECT || NEW_PROJECT"){
      navigate(`/project/${notification.relatedIDEntity}`);
    }
    markAsRead(notification.id);
  };
  
  return (
    <div >
        
         <div className="notification-container">
         <div className="notification-external-container">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
           
            <NotificationItem key={notification.id} notification={notification}
            onClick={() => {
              handleNotificationClick(notification);
           
            }}
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
