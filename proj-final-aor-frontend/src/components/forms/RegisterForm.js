
import React, {useState} from "react"
import { IntlProvider, FormattedMessage, useIntl } from "react-intl";
import languages from "../../translations";
import {userStore} from "../../stores/UserStore";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {register} from "../../services/users";
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'


function RegisterForm(){

     // Get the locale from the userStore
   const locale = userStore((state) => state.locale);

    // State variables
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const intl = useIntl();
   
    // Handle change in input fields
    // Update the state variable with the new value
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // Validate password
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    //Validate email
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return emailRegex.test(email);
    }



    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!validateEmail(user.email)) {
            toast.warning("Invalid email.");
            return;
        }

        if (!validatePassword(user.password)) {
           toast.warning("Invalid password");
            return;
        }


        if (user.password !== user.confirmPassword) {
            toast.warning( "Passwords do not match.");
            return;
        }


        try {
            const result = await register(user);
            if (result === 400) {
                toast.error("Invalid email or password");
            } else {
                toast.success("Successfully registered. Please verify your email account.");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error occurred while registering:", error);
            toast.error("An error occurred while registering");
        }
    }

    return(
        <div className="register-container">
           <IntlProvider locale={locale} messages={languages[locale]}> 

            <ToastContainer />
            <h2 className="title-forms">
            <FormattedMessage id="createAccount">
                        {(message) => <span>{message}</span>}
                      </FormattedMessage>
            </h2>
            {/* Login form */}
            <form  onSubmit={handleSubmit}>
                    <br/>
                    {/* Email input */}
                    <div className = "input-container">
                    <input 
                        type="text"
                        name="email"
                        value={user.email || ''}  
                        onChange = {handleChange} 
                        placeholder={intl.formatMessage({ id: "email"})} 
                        
                        required
                    />

<label  className="label-description" htmlFor="email">
                            <FormattedMessage id="email">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </label>
                    </div> 
                    <div className = "input-container">
                    {/* Password input */}
                    <input 
                        type="password" 
                        name="password"
                        value={user.password || ''} 
                        onChange = {handleChange}
                        onFocus={() => setShowPasswordRequirements(true)}
                        onBlur={() => setShowPasswordRequirements(false)}
                        placeholder={intl.formatMessage({ id: "password"})}
                        
                        required
                    />
                    
                    
                    <label className="label-description" htmlFor="password">
                    {intl.formatMessage({ id: "password"})}
                        </label>
                    </div>
                    {showPasswordRequirements && (
            <p className="message-user-password">
                <FormattedMessage id="messageAboutPassword">
              {(message) => <span>{message}</span>}
            </FormattedMessage>
           </p>
          )}
                    <div className = "input-container">
                    {/* Password input */}
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={user.confirmPassword || ''} 
                        onChange = {handleChange}
                      
                        placeholder={intl.formatMessage({ id: "confirmPassword"})}
                        
                        required
                    />
                    
                    <label className="label-description" htmlFor="confirmPassword">
                            <FormattedMessage id="confirmPassword">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </label>
                    </div>
                    {/* Submit button */}
                    <button type="submit"><FormattedMessage id="register">
                        {(message) => <span>{message}</span>}
                      </FormattedMessage></button>

                   <div className="navigate">  
                      <p >{intl.formatMessage({ id: "allreadyhaveanaccount"})}</p><a className="link-login" href="/login">{intl.formatMessage({ id: "login"})}</a>
                    </div>
            </form>
            </IntlProvider>

        </div>
    )
}

export default RegisterForm;