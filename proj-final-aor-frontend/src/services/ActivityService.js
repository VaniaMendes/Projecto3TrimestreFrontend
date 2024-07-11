const API_BASE_URL = "http://localhost:8080/project_backend/rest/activities";

const ActivityService = {

    addMemberComment: async (projectId, token, input) => {
        try {
            const response = await fetch(`${API_BASE_URL}/project/${projectId}/member-comment`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
                },
                body: JSON.stringify(input)
            });

            if (response.ok) {
                return response.ok;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    }
};

export default ActivityService;