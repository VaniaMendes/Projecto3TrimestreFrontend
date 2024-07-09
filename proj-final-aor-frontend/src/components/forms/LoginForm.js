import React, { useState } from "react";
import { login, getUserInfo } from "../../services/users";
import { toast } from "react-toastify";
import { userStore } from "../../stores/UserStore";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { getUnreadNotifications } from "../../services/notifications";
import { notificationStore } from "../../stores/NotificationStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function LoginForm() {
  // State variables
  const [newUser, setNewUser] = useState({});
  const { updateUserId, updateName, updatePhoto, updateTypeUser } = userStore();
  const { setNotifications } = notificationStore();
  const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const intl = useIntl();

  // Get the updateToken function from the userStore
  const updateToken = userStore((state) => state.updateToken);

  // Handle change in input fields
  // Update the state variable with the new value
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "password" && !isPasswordInputFocused) {
      setIsPasswordInputFocused(true);
    }
  };

  // Handle submit of the form
  // Call the login function with the newUser state variable
  // If the result is null, show an error message
  // If the result is not null, show a success message
  // If an error occurs, show an error message
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await login(newUser);
      console.log(result);
      if (result === null) {
        toast.error("Invalid email or password");
      } else {
        updateToken(result);
        const data = await getUserInfo(result);
        console.log(data);
        if (data === null) {
          toast.error("An error occurred while logging in");
        } else {
          updateUserId(data.id);
          updateName(data.firstName + " " + data.lastName);
          updatePhoto(data.photo);
          updateTypeUser(data.userType);
          numberOfnotificationUnread(result);//Get the number of notifications
          navigate(`/home/${data.id}`);
        }
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error);
      toast.error("An error occurred while logging in");
    }
  };

  // Toggle the visibility of the password input field
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  //Get the number of notifications unread
  const numberOfnotificationUnread = async (token) => {
    const unreadNotifications = await getUnreadNotifications(token);

    // Verify if the number of notifications is 0
    if (unreadNotifications === 0) {
      setNotifications(0);
    } else {
      setNotifications(unreadNotifications);
    }
  };

  return (
    <div className="login-container">
        <h2 className="title-forms">
          <FormattedMessage id="welcome">
            {(message) => <span>{message}</span>}
          </FormattedMessage>
        </h2>
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <br />

          <div className="input-container">
            {/* Email input */}

            <input
              type="text"
              name="email"
              value={newUser.email || ""}
              onChange={handleChange}
              placeholder={intl.formatMessage({ id: "email" })}
              required
            />
            <label className="label-description" htmlFor="email">
              <FormattedMessage id="email">
                {(message) => <span>{message}</span>}
              </FormattedMessage>
            </label>
          </div>
          <div className="input-container">
            {/* Password input */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={newUser.password || ""}
              onChange={handleChange}
              
              placeholder={intl.formatMessage({ id: "password" })}
              required
            />
             {isPasswordInputFocused && (
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}

            <label className="label-description" htmlFor="password">
              <FormattedMessage id="password">
                {(message) => <span>{message}</span>}
              </FormattedMessage>
            </label>
          </div>
          {/* Submit button */}
          <button type="submit">
            <FormattedMessage id="login">
              {(message) => <span>{message}</span>}
            </FormattedMessage>
          </button>
          <span className="click-link" onClick={handleForgotPassword}>
            <FormattedMessage id="forgotyourPassword">
              {(message) => <span>{message}</span>}
            </FormattedMessage>
          </span>
          <div className="navigate">
          <p >{intl.formatMessage({ id: "notallreadyhaveanaccount"})}</p><a className = "link-login" href="/register">{intl.formatMessage({ id: "register"})}</a>
          </div>
        </form>
    </div>
  );
}

export default LoginForm;
