//Define the base URL for the backend API
const url = "https://localhost:8443/project_backend/rest/interests";

export async function getUserInterests(token, userId){
    try{

        const response = await fetch(`${url}/${userId}`,  {
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
            console.error("Failed to retrieve the insterests:", response.status, errorData);
            return null;
        }

    }catch(error){
        console.error(error);
        return null;
}

}

export async function getAllInterests(){
    try{
        const response = await fetch (url,{
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });
        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            const errorData = await response.text();
            console.error("Failed to retrieve the skills:", response.status, errorData);
            return null;
        }
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function createNewInterest(token, interest){
    try{
        const response = await fetch(url+"/new", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify(interest)
        });
        if(response.ok){
            return 200;
        }
        else{
            const errorData = await response.text();
            console.error("Failed to create the skill:", response.status, errorData);
            return 400;
        }
    }catch(error){
        console.error(error);
        return null;
    }

}

export async function associateInterestToUser(token, userId, interestId) {
    
    const queryParams = new URLSearchParams({
        userId: userId,
        interestId: interestId
      });
    
      const urlWithParams = `${url}/associate-user?${queryParams}`;
   
    try {
      const response = await fetch(urlWithParams, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
  
      if (response.ok) {
   
    return 200;
      } else {
        console.error('Failed to associate interest:');
        return 400;
      }
    } catch (error) {
      console.error('An error occurred while associating interest:', error);
      return null;
    }
  }
  
  export async function softDeleteInterestUser(token, userId, interestId) {
    const urlWithParams = `${url}/${interestId}/users/${userId}/soft-delete`;
   
    try {
      const response = await fetch(urlWithParams, {
        method: 'PUT',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          'token': token
        }
      });

  
      if (response.ok) {

    return 200;
      } else {
        console.error('Failed to delete interest:');
        return 400;
      }
    } catch (error) {
      console.error('An error occurred while deleting interest:', error);
      return null;
    }
  }
  