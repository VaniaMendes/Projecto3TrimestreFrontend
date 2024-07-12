import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getTimeoutValue } from "../services/AppSettings";
import { logoutUser } from "../services/users";
import { userStore } from "../stores/UserStore";

const SessionTimeoutHandler = () => {
  const navigate = useNavigate();
  const { token, timeout, updateTimeout, resetUserStore } = userStore();
  
  useEffect(() => {
    const fetchSettings = async () => {
      if (token) {
        const value = await getTimeoutValue(token);

        if (value) {
          const timeoutInMilliseconds = value * 60 * 1000; // Convert minutes to milliseconds
          updateTimeout(timeoutInMilliseconds);
        }
      }
    };
    fetchSettings();
  }, [token, updateTimeout]);

  useEffect(() => {
    if (timeout === null || !token) return; // Wait until sessionTimeout is set

    let timeoutId;

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, timeout);
    };

    const handleLogout = async () => {
      // Clear session storage 
      sessionStorage.clear();
      // Log the user out 
      await logoutUser(token);
      resetUserStore();
      // Show a message
      toast.info("Your session has expired due to inactivity.");
      // Redirect to login page or a session expired page
      navigate("/login");
    };

    const eventHandler = () => {
      resetTimeout();
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", eventHandler);
    window.addEventListener("keydown", eventHandler);
    window.addEventListener("click", eventHandler);


    // Set initial timeout
    resetTimeout();

    // Cleanup event listeners and timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", eventHandler);
      window.removeEventListener("keydown", eventHandler);
      window.removeEventListener("click", eventHandler);
    };
  }, [timeout, token, navigate, resetUserStore]);

  return null; // This component does not render anything
};

export default SessionTimeoutHandler;
