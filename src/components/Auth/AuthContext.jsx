// src/components/Auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'http://localhost:8080/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log("calling login function from ui");

      const response = await fetch(
        `${BASE_URL}/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const token = await response.text();
      const decodedUser = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decodedUser));

      setIsAuthenticated(true);
      setUser(decodedUser);

      return token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn("⚠️ useAuth called outside of AuthProvider!");
  }
  return context;
};