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

    getProjectsByKeyword: async (keyword, order) => {
        try {
            const response = await fetch(`${API_BASE_URL}/keyword/${keyword}?order=${order}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            });

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

    getKeywords: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/keywords`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            });

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

    countByKeyword: async (keyword) => {

        try {
            const response = await fetch(`${API_BASE_URL}/count?keyword=${keyword}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            });

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

    getProjectInfo: async (projectId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${projectId}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            });

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

    register: async (token, project) => {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
                },
                body: JSON.stringify(project)
            });

            if (response.ok) {
                return response;
            } else {
                const errorText = await response.text(); 
                console.error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`);
                return null; 
            }
        } catch (error) {
            console.error(error);
        }
    },

    getUserProjects: async(token, userId) => {
        try{
    
            const response = await fetch(`${API_BASE_URL}/user/${userId}`,  {
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

    getUserProjectsFullInfo: async(token, userId, order, vacancies, state) => {
        try{
    
            const response = await fetch(`${API_BASE_URL}/${userId}/info/full?order=${order}&vacancies=${vacancies}&state=${state}`,  {
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