import api from '@/services/api.js';

export const billingApi = {
    // Get my billing information
    getMyBilling: () => {
        return api().get('/tenant/my-billing');
    },

    // Get my invoices with filters
    getMyInvoices: (params = {}) => {
        return api().get('/tenant/my-invoices', { params });
    },

    // Get single invoice details
    getInvoiceDetail: (invoiceId) => {
        return api().get(`/tenant/my-invoices/${invoiceId}`);
    },

    // Pay an invoice
    payInvoice: (invoiceId, paymentData) => {
        return api().post(`/tenant/my-invoices/${invoiceId}/pay`, paymentData);
    },

    // Download invoice PDF
    downloadInvoice: (invoiceId) => {
        return api().get(`/tenant/my-invoices/${invoiceId}/download`, {
            responseType: 'blob'
        });
    }
};