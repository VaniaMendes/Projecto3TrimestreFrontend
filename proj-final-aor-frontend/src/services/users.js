
const url = "http://localhost:8080/project_backend/rest/users";

export async function login(newUser){
    try{
        const response = await fetch(url + "/login",

        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        }
        );
        if(response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        } else {
            return null;
        }
        }catch(error){
            return error;
    }
}

  