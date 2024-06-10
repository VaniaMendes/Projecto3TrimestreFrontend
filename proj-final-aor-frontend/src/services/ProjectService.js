const API_BASE_URL = "http://localhost:8080/project_backend/rest/projects";

const ProjectService = {

    getProjects: async (order, vacancies, state) => {

        try {
            const response = await fetch(`${API_BASE_URL}/?order=${order}&vacancies=${vacancies}&state=${state}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            });

            console.log(response);

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error(error);
        }

    },

    count: async (state) => {

        try {
            const response = await fetch(`${API_BASE_URL}/count?state=${state}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            });

            console.log(response);

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error(error);
        }

    },

    getUserProjects: async(token, userId) => {
        try{
    
            const response = await fetch(`${API_BASE_URL}/${userId}`,  {
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
    },

    getUserProjectsFullInfo: async(token, userId) => {
        try{
    
            const response = await fetch(`${API_BASE_URL}/${userId}/info/full`,  {
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
    },

};

export default ProjectService;