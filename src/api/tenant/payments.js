// import api from '@/api.js';

export const paymentApi = {
    // Get payment methods
    getPaymentMethods: () => {
        return api().get('/tenant/payment-methods');
    },

    // Add payment method
    addPaymentMethod: (data) => {
        return api().post('/tenant/payment-methods', data);
    },

    // Remove payment method
    removePaymentMethod: (paymentMethodId) => {
        return api().delete(`/tenant/payment-methods/${paymentMethodId}`);
    },

    // Set default payment method
    setDefaultPaymentMethod: (paymentMethodId) => {
        return api().post(`/tenant/payment-methods/${paymentMethodId}/default`);
    }
};