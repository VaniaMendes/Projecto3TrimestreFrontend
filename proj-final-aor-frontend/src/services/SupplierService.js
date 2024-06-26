const API_BASE_URL = "http://localhost:8080/project_backend/rest/suppliers";

const SupplierService = {

    getAllSuppliers: async () => {

        try {
            const response = await fetch(`${API_BASE_URL}/`, {
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

export default SupplierService;