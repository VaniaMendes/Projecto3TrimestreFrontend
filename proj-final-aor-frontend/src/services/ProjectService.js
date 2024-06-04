const API_BASE_URL = "https://localhost:8443/project_backend/rest/projects";

const ProjectService = {

    getAll: async () => {

        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            });

            console.log(response);

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return data;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error(error);
        }

    },
};

export default ProjectService;