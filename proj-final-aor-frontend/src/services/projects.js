//Define the base URL for the backend API
const url = "http://localhost:8080/project_backend/rest/projects";

export async function getUserProjects(token, userId){
    try{

        const response = await fetch(`${url}/${userId}`,  {
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
            console.error("Failed to retrieve the projects of user:", response.status, errorData);
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}