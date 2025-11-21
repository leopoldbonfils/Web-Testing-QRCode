import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.status === 'success') {
      const { accessToken, refreshToken, user } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userData', JSON.stringify(user));
      
      return { success: true, data: response.data.data };
    }
    return { success: false, error: 'Registration failed' };
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Registration failed' 
    };
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.status === 'success') {
      const { accessToken, refreshToken, user } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userData', JSON.stringify(user));
      
      return { success: true, data: response.data.data };
    }
    return { success: false, error: 'Login failed' };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userProfileImage');
  }
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};
