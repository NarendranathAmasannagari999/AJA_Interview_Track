// src/services/authService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const registerUser = async (userData) => {
  try {
    const params = new URLSearchParams();
    params.append('name', userData.name);
    params.append('email', userData.email);
    params.append('password', userData.password);
    params.append('role', userData.role);
    if (userData.role !== 'employee') {
      params.append('phone', userData.phone);
    }

    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, null, {
      params: params
    });

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      throw error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
      throw new Error("Error setting up the request");
    }
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, null, {
      params: credentials
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data || error.message;
  }
};