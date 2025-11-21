import api from './api';

export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data.user };
    }
    return { success: false, error: 'Failed to load profile' };
  } catch (error) {
    console.error('Get profile error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || 'Failed to load profile' };
  }
};

export const updateProfile = async (name, email, phone) => {
  try {
    const response = await api.put('/users/profile', { name, email, phone });
    if (response.data.status === 'success') {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedUser = { ...userData, name, email, phone };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      return { success: true, data: response.data.data.user };
    }
    return { success: false, error: 'Failed to update profile' };
  } catch (error) {
    console.error('Update profile error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
  }
};

export const changePin = async (currentPin, newPin) => {
  try {
    const response = await api.put('/users/change-pin', { currentPin, newPin });
    if (response.data.status === 'success') {
      return { success: true, message: response.data.message };
    }
    return { success: false, error: 'Failed to change PIN' };
  } catch (error) {
    console.error('Change PIN error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || 'Failed to change PIN' };
  }
};

export const updateSettings = async (settings) => {
  try {
    const response = await api.put('/users/settings', settings);
    if (response.data.status === 'success') {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedUser = { ...userData, ...settings };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      return { success: true, data: response.data.data.user };
    }
    return { success: false, error: 'Failed to update settings' };
  } catch (error) {
    console.error('Update settings error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || 'Failed to update settings' };
  }
};
