import axios from "axios";

const server_ip = `http://5.181.187.191`; //process.env.SERVER_IP ||
//const server_ip = `http://localhost`;
const port = 8888; //process.env.SERVER_PORT ||

const BASE_URL = `${server_ip}:${port}`;

export const getBooks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        return response;
    }
    catch (error) {
        throw error;
    }
};

export const getBooksById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/books/${id}`);
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
// Создание книги
export const createBook = async (bookData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/books`, bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' // Явно указываем тип данных
      }
    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка создания книги' };
  }
};

// Обновление книги
export const updateBook = async (id, bookData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/books/${id}`, bookData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка обновления книги' };
  }
};

// Удаление книги
export const deleteBook = async (id, token) => {
  try {
    await axios.delete(`${BASE_URL}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка удаления книги' };
  }
};
