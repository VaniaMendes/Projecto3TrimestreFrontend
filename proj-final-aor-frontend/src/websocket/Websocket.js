import { useEffect, useState } from "react";
import { userStore } from "../stores/UserStore";
import { notificationStore } from "../stores/NotificationStore";

import { getUnreadNotifications, getNotificationsList, getNumberOfUnOPenNotification } from "../services/notifications";

function WebSocketClient() {
  const { setNotifications, updateNotifications } = notificationStore.getState();
  const token = userStore.getState().token;
  const userId = userStore.getState().userId;

  const [websocket, setWebsocket] = useState(null);
  const [notificationsList, setNotificationsList] = useState([]);

  const fetchUnreadNotifications = async () => {
    try {
      const unreadNotifications = await getUnreadNotifications(token);
      setNotifications(unreadNotifications || 0);
      
      const result = await getNotificationsList(token, userId);
      setNotificationsList(result);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      setNotifications(0);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();

    const WS_URL = "ws://localhost:8080/project_backend/websocket/notifier/";
    const ws = new WebSocket(WS_URL + token);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = async (event) => {
      try {
        const unreadNotifications = await getNumberOfUnOPenNotification(token);
        updateNotifications(unreadNotifications || 0);
      } catch (error) {
        console.error("Error updating notifications:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWebsocket(ws);

    return () => {
      if (ws) {
        ws.close();
        console.log("WebSocket connection closed");
      }
    };
  }, [token, userId]);

  return websocket;
}

export default WebSocketClient;
