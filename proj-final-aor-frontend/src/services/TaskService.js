const url = "http://localhost:8080/project_backend/rest/project";

export async function createTask(token, projectId, task, tasksIdList) {
    try {

        const requestBody = {
            task: task,
            tasksIdList: tasksIdList
        };
        const response = await fetch(`${url}/${projectId}/add-task`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'token': token
            },
            body: JSON.stringify(requestBody),
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

export async function updateTask(token, projectId,taskId, task, tasksIdList) {
    try {

        const requestBody = {
            task: task,
            tasksIdList: tasksIdList
        };
        const response = await fetch(`${url}/${projectId}/${taskId}/`, {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'token': token
            },
            body: JSON.stringify(requestBody),
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
            console.log(data);

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

export async function getListTasks(token, projectId){
    try{

        const response = await fetch(`${url}/${projectId}/tasks-info`,  {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            }
        })


        if(response.ok){
            const data = await response.json();
            console.log(data);

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

export async function updateTaskStatus(token, projectId, taskId, status){
    try{

        const response = await fetch(`${url}/${projectId}/${taskId}/update-status?status=${status}`,  {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            }
        })


        if(response.ok){
           
            return 200;
        }
        else{
            const errorData = await response.text();
            console.error("failed to update task status:", response.status, errorData);
            return 400;
        }

    }catch(error){
        console.error(error);
        return null;
}
}


export async function softDeleteTask(token, projectId, taskId){
    try{

        const response = await fetch(`${url}/${projectId}/${taskId}/soft-delete`,  {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            }
        })


        if(response.ok){
           
            return 200;
        }
        else{
            const errorData = await response.text();
            console.error("failed to soft delete task:", response.status, errorData);
            return 400;
        }

    }catch(error){
        console.error(error);
        return null;
}
}

export async function getTaskInfo(token, projectId, taskId) {
    try {
      const response = await fetch(`${url}/${projectId}/tasks/${taskId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "token": token,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        const errorData = await response.text();
        console.error("Get info task failed:", response.status, errorData);
        return null;
      }
    } catch (error) {
      console.error("An error occurred while fetching the task info:", error);
      return null;
    }
  }
  