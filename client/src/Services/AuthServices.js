import axios from "axios";

const API_BASE_URL = "https://eco-eye.onrender.com"; 

const registerUser = (data) => {
  return axios.post(`${API_BASE_URL}/user/register`, data);
};

const loginUSer = (data) => {
  return axios.post(`${API_BASE_URL}/user/login`, data);
};

const AuthServices = { registerUser, loginUSer };

export default AuthServices;
