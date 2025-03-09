import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/auth/";

export const registerUser = async (username, email, password) => {
    return axios.post(`${API_URL}register/`, {username, email, password});
};

export const loginUser = async (username, password) => {
    const response = await axios.post(`${API_URL}login/`, {username, password});
    localStorage.setItem("token", response.data.token);
    return response.data;
};

export const logoutUser = () =>{
    localStorage.removeItem("token");
};