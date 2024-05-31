import React, { useState, useEffect } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import languages from "../../translations";
import { userStore } from "../../stores/UserStore";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../../services/users";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";

function ChangePasswordForm() {
  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);

  // State variables
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassToken, setResetPassToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get the resetPassToken from the URL params
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    const resetPassToken = queryParams.token;
    if (resetPassToken) {
      setResetPassToken(resetPassToken);
    }
  }, [location.search]);

  const handleBack = () => {
    navigate("/home");
  };

  // Validate password
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePassword(password)) {
      toast.error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await resetPassword(
        resetPassToken,
        password,
        confirmPassword
      );
      if (result === 400) {
        toast.error("Invalid password");
      } else {
        toast.success(
          "Your password has been reset successfully. Please login to continue."
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Error occurred while resetting the password:", error);
      toast.error("An error occurred while resetting the password");
    }
  };

  return (
    <div className="register-container">
      <IntlProvider locale={locale} messages={languages[locale]}>
        <h2>
          <FormattedMessage id="changemypassword">
            {(message) => <span>{message}</span>}
          </FormattedMessage>
        </h2>
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <br />
          {/* Password input */}
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          {/* Confirm Password input */}
          <input
            type="text"
            name="newPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
          />
         

          {/* Submit button */}
          <button type="submit">
            <FormattedMessage id="changePassword">
              {(message) => <span>{message}</span>}
            </FormattedMessage>
          </button>
          {/* Back button */}
          <button onClick={handleBack}>
            <FormattedMessage id="back">
              {(message) => <span>{message}</span>}
            </FormattedMessage>
          </button>
        </form>
      </IntlProvider>
    </div>
  );
}

export default ChangePasswordForm;
