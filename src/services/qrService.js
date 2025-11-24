import api from './api';

export const generateQRCode = async (amount = null) => {
  try {
    const response = await api.post('/qr/generate', { amount });
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    }
    return { 
      success: false, 
      error: response.data.message || 'Failed to generate QR code' 
    };
  } catch (error) {
    console.error('Generate QR error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to generate QR code' 
    };
  }
};

export const validateQRCode = async (qrData, signature) => {
  try {
    const response = await api.post('/qr/validate', { 
      qr_data: qrData, 
      signature 
    });
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    }
    return { 
      success: false, 
      error: response.data.message || 'QR validation failed' 
    };
  } catch (error) {
    console.error('Validate QR error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'QR validation failed' 
    };
  }
};

export const processQRPayment = async (qrData, amount, pin, message = '') => {
  try {
    const response = await api.post('/qr/process-payment', { 
      qr_data: qrData,
      amount,
      pin,
      message
    });
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    }
    return { 
      success: false, 
      error: response.data.message || 'Payment failed' 
    };
  } catch (error) {
    console.error('Process QR payment error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Payment failed' 
    };
  }
};

export const getQRPaymentHistory = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/qr/history?page=${page}&limit=${limit}`);
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    }
    return { 
      success: false, 
      error: response.data.message || 'Failed to load history' 
    };
  } catch (error) {
    console.error('Get QR history error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to load history' 
    };
  }
};