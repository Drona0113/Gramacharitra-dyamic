import api from './api';

export const register = (name, email, password) => {
  return api.post('/auth/register', { name, email, password });
};

export const registerAdmin = (name, email, password, adminSecret) => {
  return api.post('/auth/register-admin', { name, email, password, adminSecret });
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const getCurrentUser = () => {
  return api.get('/auth/current');
};

// Default export for backward compatibility
const authService = {
  register,
  registerAdmin,
  login,
  getCurrentUser
};

export default authService;