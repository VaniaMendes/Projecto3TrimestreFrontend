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

    searchProjectsByName: async (name, state = null, orderByVacancies = null, order) => {
        try {
            let queryParams = new URLSearchParams({name});
            if (state !== null) queryParams.append("state", state);
            if (orderByVacancies !== null) queryParams.append("orderByVacancies", orderByVacancies);
            if (order !== null) queryParams.append("order", order);

            console.log(`${API_BASE_URL}/search?${queryParams}`);
    
            const response = await fetch(`${API_BASE_URL}/search?${queryParams}`, {
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

    searchKeywords: async (keyword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/keywords/search?keyword=${keyword}`, {
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

    countBySearch: async (searchInput) => {
        try {
            const response = await fetch(`${API_BASE_URL}/count?search=${searchInput}`, {
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
    
            const response = await fetch(`${API_BASE_URL}/user/${userId}/info/full?order=${order}&vacancies=${vacancies}&state=${state}`,  {
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

    getProjectResources: async(token, projectId) => {
        try{
    
            const response = await fetch(`${API_BASE_URL}/${projectId}/resources`,  {
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

    getProjectActivity: async(token, projectId) => {
        try{
    
            const response = await fetch(`${API_BASE_URL}/${projectId}/activity/all`,  {
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


    updateDescription: async(token, projectId, description) => {
        try{
    
            const response = await fetch(`${API_BASE_URL}/${projectId}/description`,  {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token,
                    "description": description
                },
            })
    
            if(response.ok){
                return response;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to update the description of the project:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    updateState: async(token, projectId, stateId) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/state`,  {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token,
                    "stateId": stateId
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to update the state of the project:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    joinSkill: async(token, projectId, skillId) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/skill`,  {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token,
                    "skillId": skillId
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to join skill to project:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    addSkill: async(token, projectId, skillId) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/skill/add`,  {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token,
                    "skillId": skillId
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to add skill to the project:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    removeSkill: async(token, projectId, skillId) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/skill/remove`,  {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token,
                    "skillId": skillId
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to remove skill of project:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    addKeyword: async(token, projectId, keyword) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/keyword/add`,  {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token,
                    "keyword": keyword
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to add keyword to project:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    removeKeyword: async(token, projectId, keyword) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/keyword/remove`,  {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token,
                    "keyword": keyword
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to remove keyword of the project:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    addResource: async(token, projectId, resourceId, quantity) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/resource`,  {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token,
                    "quantity": quantity,
                    "resourceId": resourceId
                },
            })

            console.log("addResource", response);
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to add resource to the project:", response.status, errorData);
                return null;
            }

        }catch(error){
            console.error(error);
            return null;
        }
    },

    getUsersAvailable: async(token, projectId) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/users/available`,  {
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
                console.error("Failed to get users available:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    getCandidates: async(token, projectId) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/candidates`,  {
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
                console.error("Failed to get the candidates:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    approveCandidate: async(token, projectId, userId, userType) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/user/${userId}/approve/${userType}`,  {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to approve the candidate:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    addMember: async(token, projectId, userId, userType) => {
        console.log("addMember", token, projectId, userId, userType);
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/user/${userId}/add/${userType}`,  {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to add member to the project:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    updateMemberRole: async(token, projectId, userId, userType) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/user/${userId}/update/${userType}`,  {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to update the role of the member:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

    removeMember: async(token, projectId, userId) => {
        try{
            const response = await fetch(`${API_BASE_URL}/${projectId}/user/${userId}/remove`,  {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
                },
            })
    
            if(response.ok){
                return response.ok;
            }
            else{
                const errorData = await response.text();
                console.error("Failed to remove user of the project:", response.status, errorData);
                return null;
            }
    
        }catch(error){
            console.error(error);
            return null;
        }
    },

};

export default ProjectService;