import api from '@/services/api.js';
import { useAuthStore } from '../../store/AuthStore';
const authStore = useAuthStore();
export const billingApi = {
    // Get my billing information
    getMyBilling: () => {
        let params = {};
        if (authStore.authType === 'admin') {
            params.tenant_id = authStore.tenantId;
        }
        return api().get('/tenant/my-billing', { params });
        //
        // return api().get('/tenant/my-billing',{params: {authStore.authType == 'admin' ? `tenant_id=${authStore.tenantId}` : '' }});
    },

    // Get my invoices with filters
    getMyInvoices: (params = {}) => {
         if (authStore.authType === 'admin') {
            params.tenant_id = authStore.tenantId;
        }
        return api().get('/tenant/my-invoices', { params });
    },

    // Get single invoice details
    getInvoiceDetail: (invoiceId) => {
           let params = {};
        if (authStore.authType === 'admin') {
            params.tenant_id = authStore.tenantId;
        }
        return api().get(`/tenant/my-invoices/${invoiceId}`, { params });
    },

    // Pay an invoice
    payInvoice: (invoiceId, paymentData) => {
           let params = {};
        if (authStore.authType === 'admin') {
            params.tenant_id = authStore.tenantId;
        }
        return api().post(`/tenant/my-invoices/${invoiceId}/pay`, paymentData, { params });
    },

    // Download invoice PDF
    downloadInvoice: (invoiceId) => {
        return api().get(`/tenant/my-invoices/${invoiceId}/download`, {
            responseType: 'blob'
        });
    }
};