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


export async function register(user){
    try{
        // Make a POST request to the'register' endpoint of the backend API
        const response = await fetch(url + "/register",{
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
        }
    );
    // If the response is OK, return 200
    if(response.ok) {
        return 200;
        // Otherwise, return 400
    } else {
        return 400;
    }
    // If an error occurs, throw the error
    }catch(error){
        throw error;
}
}

export async function recoveryPassword(email){
    try{
        // Make a POST request to the'recoveryPassword' endpoint of the backend API
        const response = await fetch(url + "/recovery-password",{
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "email": email
            }
            
        }
    );
    // If the response is OK, return 200
    if(response.ok) {
        return 200;
        // Otherwise, return 400
    } else {
        return 400;
    }
    // If an error occurs, throw the error
    }catch(error){
        throw error;
}
}


export async function resetPassword(resetPassToken, password, confirmPassword){
 
    try{
       // Construct the URL with query parameters
       const urlWithParams = new URL(`${url}/change-password`);
       urlWithParams.searchParams.append("password", password);
       urlWithParams.searchParams.append("confirmPassword", confirmPassword);


       // Make a PUT request to the 'reset-password' endpoint of the backend API
       const response = await fetch(urlWithParams, {
           method: "PUT",
           headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               "resetPassToken": resetPassToken
           }
       });

       console.log(response.status);

    // If the response is OK, return 200
    if (response.ok) {
        console.log("User changed password");
        return 200;
        // Otherwise, return 400
    } else {
        console.log("Failed to change password");
        return 400;
    }
    // If an error occurs, throw the error
} catch (error) {
    console.error("Failed to change password", error);
    throw error;
}
}

export async function confirmAccount(tokenConfirmation, user, lab){
    try {

         // Construct the URL with query parameters
       const urlWithParams = new URL(`${url}/confirm`);
       urlWithParams.searchParams.append("lab", lab);


        const response = await fetch(urlWithParams, {
          method: 'PUT',
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'tokenConfirmation': tokenConfirmation
          },
          body: JSON.stringify(user)
        });
        console.log(response.status);
    
        if (response.ok) {
          return 200;
          
          
        } else {
          return 400;
        }
      } catch (error) {
        console.error('Erro ao confirmar usuário:', error);
     
      }
    

}


export async function getUserInfo(token){
    try{

        const response = await fetch(url + "/profile", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            }
        })


        if(response.ok){
            const data = await response.json();
            console.log(data);
            return data;
        }
        else{
            const errorData = await response.text();
            console.error("Login failed:", response.status, errorData);
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

