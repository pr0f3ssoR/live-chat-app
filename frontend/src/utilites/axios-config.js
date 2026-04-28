import axios from 'axios';
import { refreshToken } from './apicalls';


console.log('🔧 Creating axios instance with interceptors');

let globalSetAuth = null; // Store your setAuth function

// Export function to set the setAuth from App.jsx
export const injectSetAuth = (setAuthFn) => {
  globalSetAuth = setAuthFn;
};


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000'
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Interceptor: Success response', response.status);
    return response
  }, // Pass through successful responses
  async (error) => {
    console.log(error)
    // Check for 400 with invalid token message
    if (error.response?.status === 400 && 
        error.response?.data?.detail?.toLowerCase().includes('invalid access token')) {

        console.log('🚨 Interceptor: Invalid token detected! Redirecting...');
    
      // Clear stored auth data
      localStorage.removeItem('token');

      if (globalSetAuth){
        globalSetAuth(null)
      }
      
      await refreshToken(globalSetAuth)

    }

    if (error.response?.status === 403){
      console.log('user not verified intercepter triggered')
      if (window.location.pathname !== '/otp') window.location.href = '/otp'
      
    }
    
  }
);

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;