// /context/AuthContext.js

import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signup = async (username, email, password, phoneNumber, address) => {
    try {
      const response = await axios.post(
        "https://mma301.onrender.com/users/signup",
        { username, email, password, phoneNumber, address }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const verifyCode = async (email, code) => {
    try {
      const response = await axios.post(
        "https://mma301.onrender.com/users/verify",
        { email, code }
      );
      return { success: response.data };
    } catch (error) {
      throw error.response.data;
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      const response = await axios.post(
        "https://mma301.onrender.com/users/reset-password",
        { email, newPassword }
      );
      return { success: response.data };
    } catch (error) {
      throw error.response.data;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://mma301.onrender.com/users/login",
        { email, password }
      );
      // Lưu trữ tên người dùng
      setUser({
        username: response.data.username,
        id: response.data.userId,
        token: response.data.token,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, verifyCode, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
