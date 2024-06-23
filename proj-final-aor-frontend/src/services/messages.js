//Define the base URL for the backend API
const url = "http://localhost:8080/project_backend/rest/messages";


export async function sendMessage(token, message){
    try{

        const response = await fetch(url + "/send",  {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            },

            body: JSON.stringify(message)
        })

        if(response.ok){
            return 200;
        }
        else{
            return 400;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

export async function getMessages(token, userId, page){
    try{

        // Create a URL object
        let urlObj = new URL(`${url}/${userId}`);

        // Create a URLSearchParams object
        let params = new URLSearchParams();
        params.append('page', page);

        // Append the parameters to the URL
        urlObj.search = params;
        const response = await fetch(urlObj,  {
            
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            },

        })

        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            const errorData = await response.text();
            console.error("Failed to retrieve the messages for user:", response.status, errorData);
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

export async function getUsersWithMessage(token){
    try{

        const response = await fetch(url + "/messagedUsers",  {
            
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            },

        })

        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            const errorData = await response.text();
            console.error("Failed to retrieve the users wtih messages:", response.status, errorData);
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

export async function getPageCountBetweenTwoUsers(token, userId) {
    try {
        const response = await fetch(`${url}/${userId}/pageCount`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            },
        });

        if (response.ok) {
            const pageCount = await response.json();
            return pageCount;
        } else {
            const errorData = await response.text();
            console.error("Failed to retrieve the page count between two users:", response.status, errorData);
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function markMessageAsRead(token, messageId) {
    try {
        const response = await fetch(`${url}/${messageId}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            },
        });

        if (response.ok) {
           
            return 200;
        } else {
           return 400;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}