const API_BASE_URL = "http://localhost:8080/project_backend/rest/resources";

const ResourceService = {

    getAllResources: async (sort, name, projects) => {
            
        const queryParams = new URLSearchParams({
            ...(sort ? { sort } : {}),
            ...(name ? { name } : {}),
            ...(projects ? { projects } : {}),
        }).toString();

        console.log(`${API_BASE_URL}/?${queryParams}`);

        try {
            const response = await fetch(`${API_BASE_URL}/?${queryParams}`, {
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

    getResourcesFiltered: async (type, brand, supplier, sort, name, projects) => {
        const queryParams = new URLSearchParams({
            ...(type ? { type } : {}),
            ...(brand ? { brand } : {}),
            ...(supplier ? { supplier } : {}),
            ...(sort ? { sort } : {}),
            ...(name ? { name } : {}),
            ...(projects ? { projects } : {}),
        }).toString();

        
          
        try {
            const response = await fetch(`${API_BASE_URL}/filter?${queryParams}`, {
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

    getAllBrands: async () => {
            
            try {
                const response = await fetch(`${API_BASE_URL}/brands`, {
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
};

export default ResourceService;