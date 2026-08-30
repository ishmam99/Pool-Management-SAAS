import api from '@/services/api.js';

const ADMIN_BASE = '/admin';

export const adminApi = {
    // ========== Dashboard ==========
    getStats: () => {
        return api().get(`${ADMIN_BASE}/billing/stats`);
    },

    // ========== Plans ==========
    getPlans: (params = {}) => {
        return api().get(`${ADMIN_BASE}/subscription-plans`, { params });
    },

    createPlan: (data) => {
        return api().post(`${ADMIN_BASE}/subscription-plans`, data);
    },

    updatePlan: (planId, data) => {
        return api().put(`${ADMIN_BASE}/subscription-plans/${planId}`, data);
    },

    deletePlan: (planId) => {
        return api().delete(`${ADMIN_BASE}/subscription-plans/${planId}`);
    },

    togglePlanStatus: (planId) => {
        return api().post(`${ADMIN_BASE}/subscription-plans/${planId}/toggle-active`);
    },

    // ========== Tenant Subscriptions ==========
    getTenantSubscriptions: (params = {}) => {
        return api().get(`${ADMIN_BASE}/tenant-subscriptions`, { params });
    },

    getTenantSubscription: (subscriptionId) => {
        return api().get(`${ADMIN_BASE}/tenant-subscriptions/${subscriptionId}`);
    },

    createTenantSubscription: (data) => {
        return api().post(`${ADMIN_BASE}/tenant-subscriptions`, data);
    },

    updateTenantSubscription: (subscriptionId, data) => {
        return api().put(`${ADMIN_BASE}/tenant-subscriptions/${subscriptionId}`, data);
    },

    cancelTenantSubscription: (subscriptionId) => {
        return api().delete(`${ADMIN_BASE}/tenant-subscriptions/${subscriptionId}/cancel`);
    },

    renewTenantSubscription: (subscriptionId) => {
        return api().post(`${ADMIN_BASE}/tenant-subscriptions/${subscriptionId}/renew`);
    },

    // ========== Billing Config ==========
    getBillingConfig: (tenantId) => {
        return api().get(`${ADMIN_BASE}/tenants/${tenantId}/billing/config`);
    },

    updateBillingConfig: (tenantId, data) => {
        return api().put(`${ADMIN_BASE}/tenants/${tenantId}/billing/config`, data);
    },

    generateInvoice: (tenantId, data = {}) => {
        return api().post(`${ADMIN_BASE}/tenants/${tenantId}/generate-invoice`, data);
    },

    // ========== Invoices ==========
    getInvoices: (params = {}) => {
        return api().get(`${ADMIN_BASE}/billing/invoices`, { params });
    },

    getInvoice: (invoiceId) => {
        return api().get(`${ADMIN_BASE}/billing/invoices/${invoiceId}`);
    },

    updateInvoice: (invoiceId, data) => {
        return api().put(`${ADMIN_BASE}/billing/invoices/${invoiceId}`, data);
    },

    deleteInvoice: (invoiceId) => {
        return api().delete(`${ADMIN_BASE}/billing/invoices/${invoiceId}`);
    },

    markInvoicePaid: (invoiceId, data) => {
        return api().post(`${ADMIN_BASE}/billing/invoices/${invoiceId}/mark-paid`, data);
    },

    voidInvoice: (invoiceId) => {
        return api().post(`${ADMIN_BASE}/billing/invoices/${invoiceId}/void`);
    },

    sendInvoiceReminder: (invoiceId) => {
        return api().post(`${ADMIN_BASE}/billing/invoices/${invoiceId}/send-reminder`);
    },

    downloadInvoice: (invoiceId) => {
        return api().get(`${ADMIN_BASE}/billing/invoices/${invoiceId}/download`, {
            responseType: 'blob'
        });
    },

    bulkUpdateInvoiceStatus: (data) => {
        return api().post(`${ADMIN_BASE}/billing/invoices/bulk/status-update`, data);
    },

    getInvoiceAnalytics: (params = {}) => {
        return api().get(`${ADMIN_BASE}/billing/invoices/analytics`, { params });
    },
    // ========== Tenants ==========
getTenants: (params = {}) => {
    return api().get('/tenant/tenants', { params });
},

getTenant: (tenantId) => {
    return api().get(`/tenant/tenants/${tenantId}`);
},

createTenant: (data) => {
    return api().post('/tenant/tenants', data);
},

updateTenant: (tenantId, data) => {
    return api().put(`/tenant/tenants/${tenantId}`, data);
},

deleteTenant: (tenantId) => {
    return api().delete(`/tenant/tenants/${tenantId}`);
},
// ========== Plans ==========
getPlan: (planId) => {
    return api().get(`${ADMIN_BASE}/subscription-plans/${planId}`);
},

// ========== Tenant Subscriptions ==========
getTenantSubscription: (subscriptionId) => {
    return api().get(`${ADMIN_BASE}/tenant-subscriptions/${subscriptionId}`);
},
};