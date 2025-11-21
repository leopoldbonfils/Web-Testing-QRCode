import api from './api';

export const getBalance = async () => {
  try {
    const response = await api.get('/users/balance');
    if (response.data.status === 'success') {
      return { success: true, balance: response.data.data.balance };
    }
    return { success: false, error: 'Failed to get balance' };
  } catch (error) {
    console.error('Get balance error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || 'Failed to get balance' };
  }
};

export const sendBluePay = async (phone, amount, pin, message = '') => {
  try {
    const response = await api.post('/payments/bluepay', { phone, amount, pin, message });
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: 'Payment failed' };
  } catch (error) {
    console.error('Payment error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || 'Payment failed' };
  }
};

export const sendMobileMoney = async (phone, amount, pin, message = '') => {
  try {
    const response = await api.post('/payments/mobile-money', { phone, amount, pin, message });
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: 'Payment failed' };
  } catch (error) {
    console.error('Mobile money error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || 'Payment failed' };
  }
};

export const sendBankTransfer = async (bankName, accountNumber, amount, pin, message = '') => {
  try {
    const response = await api.post('/payments/bank-transfer', {
      bank_name: bankName,
      account_number: accountNumber,
      amount,
      pin,
      message
    });
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: 'Transfer failed' };
  } catch (error) {
    console.error('Bank transfer error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || 'Transfer failed' };
  }
};
