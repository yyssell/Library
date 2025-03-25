import axios from "axios";

const BASE_URL = "http://localhost:5000";

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