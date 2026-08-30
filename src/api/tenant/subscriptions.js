import api from '@/services/api.js';

export const subscriptionApi = {
    // Get available subscription plans
    getAvailablePlans: (params = {}) => {
        return api().get('/admin/subscription-plans', {
            params: {  ...params }
        });
    },

    // Get my current subscriptions
    getMySubscriptions: (params = {}) => {
        return api().get('/admin/tenant-subscriptions', {
            params: { ...params }
        });
    },

    // Subscribe to a plan
    subscribe: (data) => {
        return api().post('/admin/tenant-subscriptions', data);
    },

    // Cancel subscription
    cancelSubscription: (subscriptionId, reason = '') => {
        return api().delete(`/admin/tenant-subscriptions/${subscriptionId}/cancel`, {
            data: { cancellation_reason: reason }
        });
    },

    // Renew subscription
    renewSubscription: (subscriptionId) => {
        return api().post(`/admin/tenant-subscriptions/${subscriptionId}/renew`);
    },

    // Upgrade subscription
    upgradeSubscription: (subscriptionId, planId) => {
        return api().post(`/admin/tenant-subscriptions/${subscriptionId}/upgrade`, {
            subscription_plan_id: planId
        });
    }
};