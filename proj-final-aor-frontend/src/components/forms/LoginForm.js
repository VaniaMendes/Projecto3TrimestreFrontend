import React, { useState } from "react";
import {login} from "../../services/users";
import { toast } from 'react-toastify';
import {userStore} from "../../stores/UserStore";
import { IntlProvider, FormattedMessage } from "react-intl";
import languages from "../../translations";
import { useNavigate  } from 'react-router-dom';



function LoginForm() {
    
    // State variables
    const [newUser, setNewUser] = useState({});

    // Get the locale from the userStore
   const locale = userStore((state) => state.locale);

   //
   const navigate = useNavigate();


    // Get the updateToken function from the userStore
    const updateToken = userStore((state) => state.updateToken); 
    
    // Handle change in input fields
    // Update the state variable with the new value
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // Handle submit of the form
    // Call the login function with the newUser state variable
    // If the result is null, show an error message
    // If the result is not null, show a success message
    // If an error occurs, show an error message
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await login(newUser);
            if (result === null) {
                toast.error("Invalid email or password");
            } else {
                updateToken(result);
                toast.success("Successfully logged in");
            }
        } catch (error) {
            console.error("Error occurred while logging in:", error);
            toast.error("An error occurred while logging in");
        }
    }

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    }
    
    return (
        <div className="login-container">
           <IntlProvider locale={locale} messages={languages[locale]}> 
            <h2>
            <FormattedMessage id="welcome">
                        {(message) => <span>{message}</span>}
                      </FormattedMessage>
            </h2>
            {/* Login form */}
            <form  onSubmit={handleSubmit}>
                    <br/>
                    {/* Email input */}
                    <input 
                        type="text"
                        name="email"
                        value={newUser.email || ''}  
                        onChange = {handleChange} 
                        placeholder="Email" 
                        
                        required
                    />
                    {/* Password input */}
                    <input 
                        type="password" 
                        name="password"
                        value={newUser.password || ''} 
                        onChange = {handleChange}
                        placeholder="Password" 
                        
                        required
                    />
                    {/* Submit button */}
                    <button type="submit"><FormattedMessage id="login">
                        {(message) => <span>{message}</span>}
                      </FormattedMessage></button>
                    <span className="click-link" onClick={handleForgotPassword}>
                        Forgot password?
                    </span>
            </form>
            </IntlProvider>

        </div>
    );
}

export default LoginForm