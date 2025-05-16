// src/services/authService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8081";

// Register a new user (employee)
export const registerEmployee = async (userData) => {
  return await axios.post(`${API_BASE_URL}/user/create-user`, userData);
};

// Register a new ALTUser (delivery/sales team)
export const registerALTUser = async (userData) => {
  return await axios.post(`${API_BASE_URL}/altUser/create-altUser`, {
    ...userData,
    phone: "default-phone" // You should add phone field to your form
  });
};

// Unified registration function
export const registerUser = async (userData) => {
  if (userData.role === "employee") {
    return registerEmployee(userData);
  } else {
    return registerALTUser(userData);
  }
};