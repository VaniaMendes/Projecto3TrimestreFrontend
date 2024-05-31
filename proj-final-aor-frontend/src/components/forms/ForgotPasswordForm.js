
import React, {useState} from "react"
import { IntlProvider, FormattedMessage } from "react-intl";
import languages from "../../translations";
import {userStore} from "../../stores/UserStore";
import 'react-toastify/dist/ReactToastify.css';
import {recoveryPassword} from "../../services/users";
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';


function ForgetPassword(){

     // Get the locale from the userStore
   const locale = userStore((state) => state.locale);

    // State variables
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
   

    const handleBack = () =>{
        navigate("/home");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const result = await recoveryPassword(email);
            if (result === 400) {
                toast.error("Invalid email ");
            } else {
                toast.success("Please verify your email to reset your password");
            }
        } catch (error) {
            console.error("Error occurred while registering:", error);
            toast.error("An error occurred while registering");
        }
    }

    return(
        <div className="register-container">
           <IntlProvider locale={locale} messages={languages[locale]}> 

            <h2>
            <FormattedMessage id="changePassword">
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
                        value={email}  
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email"                       
                        
                        required
                    />
                  
                    {/* Submit button */}
                    <button type="submit"><FormattedMessage id="recoveryPAssword">
                        {(message) => <span>{message}</span>}
                      </FormattedMessage></button>
                        {/* Back button */}
                    <button onClick={handleBack}><FormattedMessage id="back">
                        {(message) => <span>{message}</span>}
                      </FormattedMessage></button>
                    
            </form>
            </IntlProvider>

        </div>
    )
}

export default ForgetPassword;