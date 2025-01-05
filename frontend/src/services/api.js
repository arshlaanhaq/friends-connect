import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:5000/api", 
});

const token = localStorage.getItem("token");
if (token) {
    API.defaults.headers["Authorization"] = `Bearer ${token}`;
}

export default API;
