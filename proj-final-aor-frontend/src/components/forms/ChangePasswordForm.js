import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../../services/users";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";

function ChangePasswordForm() {

  // State variables
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassToken, setResetPassToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const intl = useIntl();

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

  // submit the new password
  const handleSubmit = async (event) => {
    event.preventDefault();

    //Validate password requirements
    if (!validatePassword(password)) {
      toast.error(
        intl.formatMessage({ id: 'invalidPassword' })
      );
      return;
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      toast.error( intl.formatMessage({ id: 'passwordDonotMatch' }));
      return;
    }

    try {
      const result = await resetPassword(
        resetPassToken,
        password,
        confirmPassword
      );
      if (result === 400) {
        toast.error(intl.formatMessage({ id: 'invalidPassword'}));
      } else {
        toast.success(
          intl.formatMessage({ id: 'passwordResetSuccess'})
          
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Error occurred while resetting the password:", error);
   
    }
  };

  return (
    <div className="register-container">
      
        <h2 className="title-forms">
          <FormattedMessage id="changemypassword">
            {(message) => <span>{message}</span>}
          </FormattedMessage>
        </h2>
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <br />
          {/* Password input */}
          <div className="input-container">
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => setShowPasswordRequirements(false)}
            placeholder={intl.formatMessage({ id: "password"})}
            required
          />
           <label className="label-description" htmlFor="password">
                            <FormattedMessage id="password">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </label>
          </div>
          {showPasswordRequirements && (
            <p className="message-user-password">
                <FormattedMessage id="messageAboutPassword">
              {(message) => <span>{message}</span>}
            </FormattedMessage>
           </p>
          )}
          {/* Confirm Password input */}
         <div className="input-container">
          <input
            type="text"
            name="newPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={intl.formatMessage({ id: "newPassword"})}
            required
          />
           <label className="label-description" htmlFor="password">
                            <FormattedMessage id="newPassword">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </label>
         
         </div>

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
      
    </div>
  );
}

export default ChangePasswordForm;
