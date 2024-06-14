import { useEffect, useState } from "react";
import { userStore } from "../stores/UserStore";
import {notificationStore} from '../stores/NotificationStore';
function WebSocketClient() {
  const { addNotification } = notificationStore.getState();

  //Obtem o token da store
  const token = userStore.getState().token;
  const [websocket, setWebsocket] = useState(null);


  useEffect(() => {
    const WS_URL = "ws://localhost:8080/project_backend/websocket/notifier/";
    const websocket = new WebSocket(WS_URL + token);
    websocket.onopen = () => {
      console.log("The websocket connection is open");
    };

    websocket.onmessage = (event) => {
      const notification = event.data;
      console.log("a new notification is received!");
      addNotification(notification);
      
    };
    setWebsocket(websocket); 

    
    return () => {
      websocket.close();
    };
  }, [addNotification, token]);

  return websocket;
}
export default WebSocketClient;
