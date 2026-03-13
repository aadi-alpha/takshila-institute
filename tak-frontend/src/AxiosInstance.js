import axios from 'axios';
// http://localhost:8000/api/web
// https://takshila-registration-backend.onrender.com
// https://takshila-registration-backend-production.up.railway.app/api/web
const axiosInstance = axios.create({
    baseURL: ' https://takshila-registration-backend.onrender.com/api/web', // your base URL
   
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const LoggedInUserTakshila = JSON.parse(localStorage.getItem("LoggedInUserTakshila"));
        if (LoggedInUserTakshila && LoggedInUserTakshila.token) {
            config.headers.Authorization = `Bearer ${LoggedInUserTakshila.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
