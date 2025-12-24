import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

export { AuthContext };
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(err => {
          console.error(err);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await authService.register(name, email, password);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async (name, email, password, adminSecret) => {
    try {
      setLoading(true);
      const response = await authService.registerAdmin(name, email, password, adminSecret);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Admin registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    window.location.href = '/';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    registerAdmin,
    logout,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};