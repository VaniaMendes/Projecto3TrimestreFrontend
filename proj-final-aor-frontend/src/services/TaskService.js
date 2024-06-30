const url = "http://localhost:8080/project_backend/rest/project";

export async function createTask(token, projectId, task) {
    try {
        const response = await fetch(`${url}/${projectId}/add-task`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'token': token
            },
            body: JSON.stringify(task),
        });

        if (response.ok) {
            // A resposta do servidor foi bem-sucedida (status 2xx)
            return 200;
        } else {
            // Caso contrário, tratamos como erro de requisição
            const errorText = await response.text();
            console.error('Server error:', response.status, errorText);
            return 400;
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation: ', error);
        return 500; // Retornar um código de erro genérico
    }
}

export async function getProjectTasks(token, projectId){
    try{

        const response = await fetch(`${url}/${projectId}/tasks`,  {
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
            console.error("Get tasks info failed:", response.status, errorData);
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}
}