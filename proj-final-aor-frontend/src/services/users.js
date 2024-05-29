//Define the base URL for the backend API
const url = "http://localhost:8080/project_backend/rest/users";

// Export an asynchronous function named 'login' that receives a 'newUser' object as a parameter
export async function login(newUser){
    try{
        // Make a POST request to the 'login' endpoint of the backend API
        const response = await fetch(url + "/login",

        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser),
        }
        );
        // If the response is OK, return the response text
        if(response.ok) {
            const data = await response.text();
            console.log(data);
            return data;
            // Otherwise, return null
        } else {
            const errorData = await response.text();
            console.error("Login failed:", response.status, errorData);
            return null;
        }
        // If an error occurs, throw the error
        }catch(error){
            throw error;
    }
}

  