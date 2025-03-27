import axios from "axios";

const server_ip = `http://5.181.187.191`; //process.env.SERVER_IP ||
const port = 8888; //process.env.SERVER_PORT ||

const BASE_URL = `${server_ip}:${port}`;

export const getProducts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/products`);
        return response;
    }
    catch (error) {
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/products/${id}`);
        return response;
    }
    catch (error) {
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/categories`);
        return response;
    }
    catch (error) {
        throw error;
    }
};



export const AuthLogin = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/authorization/login`, {email, password});
        return response;
    }
    catch (error) {
        throw error;
    }
};

export const AuthRegister = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/authorization/register`, formData);
        return response;
    }
    catch (error) {
        throw error;
    }
};

export const Profile = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/authorization/profile`, {
  headers: { Authorization: `Bearer ${token}` }
});

        return response;
    }
    catch (error) {
        throw error;
    }
};
