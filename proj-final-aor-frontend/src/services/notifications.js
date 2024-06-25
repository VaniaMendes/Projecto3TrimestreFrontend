//Define the base URL for the backend API
const url = "http://localhost:8080/project_backend/rest/notifications";

export async function getUserNotifications(token, userId, page){
    try{

        const queryParams = new URLSearchParams({ page: page });
        const response = await fetch(`${url}/${userId}?${queryParams}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            }
        })


        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

export async function markeAsRead(token, notificationId){
    try{

        const response = await fetch(`${url}/${notificationId}`,  {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            }
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

export async function getUnreadNotifications(token){
    try{

        const response = await fetch( url + "/unread",  {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            }
        })


        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

export async function totalPagesNotifications(token){
    try{

        const response = await fetch( url + "/pageCount",  {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            }
        })


        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
           
            
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}