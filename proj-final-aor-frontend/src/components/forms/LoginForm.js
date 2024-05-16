import React, { useState } from "react"

function LoginForm() {
    
    // State variables
    const [inputs, setInputs] = useState({});
    /*// Accessing store methods
    const updateToken = userStore((state) => state.updateToken);
    const updateUserData = userStore((state) => state.updateUserData);
    const {updateNotifications} = useNotificationStore();
    // Hook for navigation
    const navigate = useNavigate();
    
    // Function to handle changes in input fields
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setInputs(values => ({ ...values, [name]: value}))
    }

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            // Attempting login
            const { response, status } = await AuthService.login(inputs);
            if (response && status) { // Check if response and status exist
                if (status === 200) {
                    const data = await response.data;
                    updateToken(data);
                    fetchUserData(data);
                    fetchNotifications(data);
                    navigate('/home', { replace: true });
                } else if (status === 404) {
                    navigate('/pending')
                } else {
                    throw new Error("Something went wrong");
                }
            } else {
                throw new Error("No response received from the server");
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert("An error occurred, please try again later.");
        };
    }
    

    // Function to fetch user data after successful login
    const fetchUserData = async (token) => {
        try {
            const username = await AuthService.getUsername(token);
            const userData = await AuthService.getUserData(token, username);
            await updateUserData(userData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchNotifications = async (token) => {
        try {
            const notifications = await NotificationService.getLatestNotifications(token, inputs.username);
            await updateNotifications(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }*/
    
    
    return (
        <div className="login-container">
            <h2>
                Bem-vindo ao CSW
            </h2>
            {/* Login form */}
            <form  action="#">
                    <br/>
                    {/* Username input */}
                    <input 
                        type="text"
                        name="username"
                        value={inputs.username || ''}   
                        placeholder="Username" 
                        
                        required
                    />
                    {/* Password input */}
                    <input 
                        type="password" 
                        name="password"
                        value={inputs.password || ''} 
                        placeholder="Password" 
                        
                        required
                    />
                    {/* Submit button */}
                    <button type="submit">Login</button>
                    <span className="click-link" >
                        Forgot password?
                    </span>
            </form>
        </div>
    );
}

export default LoginForm