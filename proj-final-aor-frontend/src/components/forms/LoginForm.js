import React, { useState } from "react";
import { login, getUserInfo } from "../../services/users";
import { toast } from "react-toastify";
import { userStore } from "../../stores/UserStore";
import { IntlProvider, FormattedMessage, useIntl } from "react-intl";
import languages from "../../translations";
import { useNavigate } from "react-router-dom";
import { getUnreadNotifications } from "../../services/notifications";
import { notificationStore } from "../../stores/NotificationStore";

function LoginForm() {
  // State variables
  const [newUser, setNewUser] = useState({});
  const navigate = useNavigate();
  const intl = useIntl();
  const { updateUserId, updateName, updatePhoto } = userStore();
  const { setNotifications } = notificationStore();

  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);

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
          numberOfnotificationUnread(result);
          navigate(`/home/${data.id}`);
        }
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error);
      toast.error("An error occurred while logging in");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const numberOfnotificationUnread = async (token) => {
    const unreadNotifications = await getUnreadNotifications(token);

    // Verifica se unreadNotifications é nulo ou vazio
    if (unreadNotifications === 0) {
      setNotifications(0);
    } else {
      setNotifications(unreadNotifications);
    }
  };

  return (
    <div className="login-container">
      <IntlProvider locale={locale} messages={languages[locale]}>
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
              type="password"
              name="password"
              value={newUser.password || ""}
              onChange={handleChange}
              placeholder={intl.formatMessage({ id: "password" })}
              required
            />

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
        </form>
      </IntlProvider>
    </div>
  );
}

export default LoginForm;
