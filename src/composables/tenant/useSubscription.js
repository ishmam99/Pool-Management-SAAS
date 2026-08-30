import { ref, computed } from 'vue';
import { subscriptionApi } from '@/api/tenant/subscriptions.js';
import Swal from 'sweetalert2';

export function useSubscription() {
    const loading = ref(false);
    const plans = ref([]);
    const mySubscriptions = ref([]);
    const currentSubscription = ref(null);
    const selectedPlan = ref(null);

    const showToast = (icon, title, text) => {
        Swal.fire({
            icon,
            title,
            text,
            timer: 3000,
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
        });
    };

    const fetchPlans = async (params = {}) => {
        loading.value = true;
        try {
            const response = await subscriptionApi.getAvailablePlans(params);
            plans.value = response.data.data;
            return plans.value;
        } catch (error) {
            showToast('error', 'Error', 'Failed to load subscription plans');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const fetchMySubscriptions = async (params = {}) => {
        loading.value = true;
        try {
            const response = await subscriptionApi.getMySubscriptions(params);
            mySubscriptions.value = response.data.data || [];
            
            const active = mySubscriptions.value.find(
                sub => ['active', 'trialing', 'grace_period'].includes(sub.status)
            );
            currentSubscription.value = active || null;
            
            return mySubscriptions.value;
        } catch (error) {
            showToast('error', 'Error', 'Failed to load subscriptions');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const subscribe = async (planId, subscriptionData = {}) => {
        loading.value = true;
        try {
            const data = {
                subscription_plan_id: planId,
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                ...subscriptionData
            };
            
            const response = await subscriptionApi.subscribe(data);
            showToast('success', 'Success', 'Subscribed successfully');
            await fetchMySubscriptions();
            return response.data.data;
        } catch (error) {
            showToast('error', 'Subscription Failed', error.response?.data?.message || 'Subscription failed');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const cancelSubscription = async (subscriptionId, reason = '') => {
        loading.value = true;
        try {
            const response = await subscriptionApi.cancelSubscription(subscriptionId, reason);
            showToast('success', 'Success', 'Subscription cancelled successfully');
            await fetchMySubscriptions();
            return response.data.data;
        } catch (error) {
            showToast('error', 'Cancellation Failed', error.response?.data?.message || 'Cancellation failed');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const renewSubscription = async (subscriptionId) => {
        loading.value = true;
        try {
            const response = await subscriptionApi.renewSubscription(subscriptionId);
            showToast('success', 'Success', 'Subscription renewed successfully');
            await fetchMySubscriptions();
            return response.data.data;
        } catch (error) {
            showToast('error', 'Renewal Failed', error.response?.data?.message || 'Renewal failed');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const upgradeSubscription = async (subscriptionId, planId) => {
        loading.value = true;
        try {
            const response = await subscriptionApi.upgradeSubscription(subscriptionId, planId);
            showToast('success', 'Success', 'Plan upgraded successfully');
            await fetchMySubscriptions();
            return response.data.data;
        } catch (error) {
            showToast('error', 'Upgrade Failed', error.response?.data?.message || 'Upgrade failed');
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const hasActiveSubscription = computed(() => currentSubscription.value !== null);
    const isSubscribed = computed(() => 
        mySubscriptions.value.some(sub => ['active', 'trialing'].includes(sub.status))
    );
    const canUpgrade = computed(() => {
        if (!currentSubscription.value) return false;
        const currentPlan = plans.value.find(p => p.id === currentSubscription.value.subscription_plan_id);
        return plans.value.some(p => p.price > (currentPlan?.price || 0) && p.is_active);
    });

    return {
        loading,
        plans,
        mySubscriptions,
        currentSubscription,
        selectedPlan,
        hasActiveSubscription,
        isSubscribed,
        canUpgrade,
        fetchPlans,
        fetchMySubscriptions,
        subscribe,
        cancelSubscription,
        renewSubscription,
        upgradeSubscription
    };
}
