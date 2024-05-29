import React, { useState } from "react";
import {login} from "../../services/users";
import { toast } from 'react-toastify';

function LoginForm() {
    
    // State variables
    const [newUser, setNewUser] = useState({});
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await login(newUser);
            if (result === null) {
                toast.error("Invalid username or password");
            } else {
                toast.success("Successfully logged in");
            }
        } catch (error) {
            console.error("Error occurred while logging in:", error);
            toast.error("An error occurred while logging in");
        }
    }
    
    console.log(newUser)
    return (
        <div className="login-container">
            <h2>
                Bem-vindo ao CSW
            </h2>
            {/* Login form */}
            <form  onSubmit={handleSubmit}>
                    <br/>
                    {/* Username input */}
                    <input 
                        type="text"
                        name="username"
                        value={newUser.username || ''}  
                        onChange = {handleChange} 
                        placeholder="Username" 
                        
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
                    <button type="button" onClick={handleSubmit}>Login</button>
                    <span className="click-link" >
                        Forgot password?
                    </span>
            </form>
        </div>
    );
}

export default LoginForm