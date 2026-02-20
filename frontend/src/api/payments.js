import apiClient from './client';

export const paymentsAPI = {
  createPaymentIntent: async (paymentData) => {
    const response = await apiClient.post('/payments/', paymentData);
    return response.data;
  },

  confirmPayment: async (paymentId, confirmData) => {
    const response = await apiClient.post(`/payments/${paymentId}/confirm/`, confirmData);
    return response.data;
  },

  getStatus: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}/`);
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await apiClient.get('/payments/methods/');
    return response.data;
  },
};

export default paymentsAPI;