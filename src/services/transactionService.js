import api from './api';

export const getTransactions = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: 'Failed to load transactions' };
  } catch (error) {
    console.error('Get transactions error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || 'Failed to load transactions' };
  }
};

export const getTransactionStats = async () => {
  try {
    const response = await api.get('/transactions/stats');
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: 'Failed to load statistics' };
  } catch (error) {
    console.error('Get stats error:', error.response?.data || error.message);
    return { success: false, error: 'Failed to load statistics' };
  }
};
