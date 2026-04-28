import axios from "axios";

export const baseUrl = "http://localhost:8000";

export async function Login(email, password) {
    try {
        const response = await axios.post(`${baseUrl}/auth/login/`, {
            email: email,
            password: password,
        },{
            withCredentials:true
        });

        // Success
        console.log(response);
        const token = response.data.token;
        console.log(token);
        return token;

    } catch (error) {
        // Handle bad response
        console.error("Login failed:", error);

        // Return something else if bad
        return null;  // or return { error: 'Invalid credentials' }
    }
}


export async function Register(formData){
    try{
        const response = await axios.post(`${baseUrl}/auth/register/`,formData)
        return [true,response]
    }
    catch(error){
        const response = error.response
        return [false,response]
    }
}


export async function refreshToken(setAuth){
    console.log('in refresh token function')
    try{
        const res = await axios.post(`${baseUrl}/auth/refresh/`,null,{
            withCredentials:true

        })

        if (res.status === 200){
            console.log('refresh token success')
            localStorage.setItem('token',res.data.access_token)
            setAuth(res.data.access_token)
            window.location.href = '/';
        }
    }
    catch(error){
        console.log(error)
    }
}


export async function getConvUser(convId){
    
    const res = await axios.get(`${baseUrl}/api/conv-user/${convId}`,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
    return res.data
   
}