
import React, {useState} from "react"
import { FormattedMessage, useIntl } from "react-intl";
import 'react-toastify/dist/ReactToastify.css';
import {recoveryPassword} from "../../services/users";
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';


function ForgetPassword(){


    // State variables
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const intl = useIntl();
   

    const handleBack = () =>{
        navigate("/login");
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
           

            <h2 className="title-forms">
            <FormattedMessage id="changePassword">
                        {(message) => <span>{message}</span>}
                      </FormattedMessage>
            </h2>
            {/* Login form */}
            <form  onSubmit={handleSubmit}>
                    <br/>
                     <p className="message-user"> <FormattedMessage id="messageRecoveryPassword">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage></p>
                    {/* Email input */}
                    <div className="input-container">
                       
                    <input 
                        type="text"
                        name="email"
                        value={email}  
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder={intl.formatMessage({ id: "email"})}                      
                        
                        required
                    />
                     <label className="label-description" htmlFor="email">
                            <FormattedMessage id="email">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </label>
                  </div>
                  <div className="buttons-forgotPassword">
                    {/* Submit button */}
                    <button type="submit"><FormattedMessage id="recoveryPAssword">
                        {(message) => <span>{message}</span>}
                      </FormattedMessage></button>
                        {/* Back button */}
                    <button onClick={handleBack}><FormattedMessage id="back">
                        {(message) => <span>{message}</span>}
                      </FormattedMessage></button>
                    </div>
            </form>

        </div>
    )
}

export default ForgetPassword;