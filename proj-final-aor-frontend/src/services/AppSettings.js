const url = "http://localhost:8080/project_backend/rest/settings";

export async function updateSettingsSystem(token, settings){
    try{

        const response = await fetch(url + "/",  {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify(settings)
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


export async function getSettingsInfo(token){
    try{

        const response = await fetch(url + "/",  {
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
            console.error("Failed to retrieve the settings:", response.status, errorData);
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

export async function getTimeoutValue(token){
    try{

        const response = await fetch(url + "/session-timeout",  {
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
            const errorData = await response.text();
            console.error("Failed to retrieve the settings:", response.status, errorData);
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

export async function getMaxMembers(token){
    try{

        const response = await fetch(url + "/max-members",  {
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
            const errorData = await response.text();
            console.error("Failed to retrieve the settings:", response.status, errorData);
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

