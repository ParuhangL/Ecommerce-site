import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/admin/";

export const getAdminDashboard = async(token) =>{
    return axios.get(`${API_URL}dashboard/`,{
        headers: {Authorization: `Bearer ${token}`},
    });
};