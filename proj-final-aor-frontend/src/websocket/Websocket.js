import { useEffect, useState } from "react";
import { userStore } from "../stores/UserStore";
import { notificationStore } from "../stores/NotificationStore";

function WebSocketClient() {
  const { incrementNotification } = notificationStore.getState();
  const token = userStore.getState().token;
  const [websocket, setWebsocket] = useState(null);

  useEffect(() => {
    const WS_URL = "ws://localhost:8080/project_backend/websocket/notifier/";
    const ws = new WebSocket(WS_URL + token);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
           incrementNotification();

    
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
  }, [incrementNotification, token]);

  return websocket;
}

export default WebSocketClient;
