const API_BASE_URL = "http://localhost:8080/project_backend/rest";

const SkillInterestService = {

    getAllSkills: async () => {

        try {
            const response = await fetch(`${API_BASE_URL}/skills/`, {
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

    getAllSkillsWithProjects: async () => {

        try {
            const response = await fetch(`${API_BASE_URL}/skills/with-projects`, {
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

    searchSkillsWithProjects: async (searchInput) => {
            
        try {
            const response = await fetch(`${API_BASE_URL}/skills/with-projects/search?name=${searchInput}`, {
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

    getProjectsWithSkill: async (skillId, order, state) => {
            
        try {
            const response = await fetch(`${API_BASE_URL}/skills/${skillId}/projects?order=${order}&state=${state}`, {
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

    countProjectsWithSkill: async (skillId, state) => {

        try {
            const response = await fetch(`${API_BASE_URL}/skills/${skillId}/projects/count?state=${state}`, {
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

    getAllInterests: async () => {

        try {
            const response = await fetch(`${API_BASE_URL}/interests/`, {
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

    getSkillsNotInProject: async (token, projectId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/skills/project/${projectId}/not-associated`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
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
};

export default SkillInterestService;