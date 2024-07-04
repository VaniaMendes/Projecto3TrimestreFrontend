import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getTimeoutValue } from "../services/AppSettings";
import { logoutUser } from "../services/users";
import { userStore } from "../stores/UserStore";

const SessionTimeoutHandler = () => {
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const navigate = useNavigate();
  const { token } = userStore();

  useEffect(() => {
    const fetchSettings = async () => {
      const value = await getTimeoutValue(token);
      console.log("Session timeout value is", value);

      if (token) {
        if (value) {
          const timeoutInMilliseconds = value * 60 * 1000; // Convert minutes to milliseconds
          setSessionTimeout(timeoutInMilliseconds);
          
        } else {
          
        }
      }
    };
    fetchSettings();
  }, [token]);

  useEffect(() => {
    if (sessionTimeout === null) return; // Wait until sessionTimeout is set

    let timeoutId;

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, sessionTimeout);
    };

    const handleLogout = async () => {
      // Clear session storage or any other storage used
      sessionStorage.clear();

      // Log the user out (assuming logoutUser is an async function)
      await logoutUser(token);
      // Show a message
      toast.info("Your session has expired due to inactivity.");
      // Redirect to login page or a session expired page
      navigate("/login");
    };

    const eventHandler = () => {
      resetTimeout();
    };
    const handleBeforeUnload = (event) => {
        // Clear session storage
        sessionStorage.clear();
        // Log the user out (assuming logoutUser is an async function)
        logoutUser(token);
        // Show a message
        toast.info("Your session has expired due to inactivity.");
      };

    // Add event listeners for user activity
    window.addEventListener("mousemove", eventHandler);
    window.addEventListener("keydown", eventHandler);
    window.addEventListener("click", eventHandler);
    window.addEventListener("beforeunload", handleBeforeUnload);


    // Set initial timeout
    resetTimeout();

    // Cleanup event listeners and timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", eventHandler);
      window.removeEventListener("keydown", eventHandler);
      window.removeEventListener("click", eventHandler);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionTimeout, token, navigate]);

  return null; // This component does not render anything
};

export default SessionTimeoutHandler;
