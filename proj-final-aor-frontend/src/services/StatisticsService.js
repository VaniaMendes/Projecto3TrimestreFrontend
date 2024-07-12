const API_BASE_URL = "https://localhost:8443/project_backend/rest/statistics";

const StatisticsService = {

    getStatisticsPDF: async (token) => {
        return fetch(`${API_BASE_URL}/generate-pdf`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
                token: token
            }
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'statistics.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error generating PDF:', error));
    },

    getStatisticsDTO: async () => {
        try{
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            console.log('Statistics:', data);
            return data;
        } catch(error){
            console.error('Error getting statistics:', error);
        }
    },
    
};

export default StatisticsService;