const API_BASE_URL = "http://localhost:8080/project_backend/rest/resources";

const ResourceService = {

    register: async (token, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                return response.ok;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    },

    getResourceById: async (id, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
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


    getAllResources: async (sort, name, projects) => {
            
        const queryParams = new URLSearchParams({
            ...(sort ? { sort } : {}),
            ...(name ? { name } : {}),
            ...(projects ? { projects } : {}),
        }).toString();

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

    searchResources: async (search) => {
        try {
            const response = await fetch(`${API_BASE_URL}/search?search=${search}`, {
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

    updateResource: async (token, id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                return response.ok;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    },

    addSupplier: async (token, id, supplier) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/supplier`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "token": token
                },
                body: JSON.stringify(supplier)
            });

            if (response.ok) {
                return response.ok;
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