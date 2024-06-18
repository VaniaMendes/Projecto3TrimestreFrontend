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