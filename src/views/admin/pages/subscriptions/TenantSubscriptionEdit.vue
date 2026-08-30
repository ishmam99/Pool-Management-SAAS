<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div class="max-w-4xl mx-auto">
            <!-- Page Header -->
            <div class="mb-8">
                <div class="flex items-center gap-3">
                    <router-link to="/admin/subscription/tenants" 
                                 class="text-gray-500 hover:text-gray-700 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                    </router-link>
                    <div>
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Edit Subscription</h1>
                        <p class="text-sm text-gray-500 mt-1">Update tenant subscription details</p>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading subscription details...</p>
            </div>

            <!-- Form -->
            <div v-else-if="subscription" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form @submit.prevent="updateSubscription" class="space-y-6">
                    <!-- Tenant Info (Read-only) -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Tenant</p>
                                <p class="font-medium text-gray-900">{{ subscription.tenant?.name || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Plan</p>
                                <p class="font-medium text-gray-900">{{ subscription.plan?.name || 'N/A' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Plan Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subscription Plan *</label>
                        <select v-model="form.subscription_plan_id" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option v-for="plan in plans" :key="plan.id" :value="plan.id">
                                {{ plan.name }} - ${{ parseFloat(plan.price).toFixed(2) }}/{{ plan.billing_cycle }}
                            </option>
                        </select>
                    </div>

                    <!-- Status -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select v-model="form.status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="active">Active</option>
                            <option value="trialing">Trialing</option>
                            <option value="grace_period">Grace Period</option>
                            <option value="suspended">Suspended</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    <!-- Period Dates -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Period Start *</label>
                            <input type="datetime-local" v-model="form.current_period_start" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Period End *</label>
                            <input type="datetime-local" v-model="form.current_period_end" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                    </div>

                    <!-- Grace Period -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Grace Period Ends</label>
                        <input type="datetime-local" v-model="form.grace_period_ends_at"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <!-- Stripe IDs -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Stripe Customer ID</label>
                            <input type="text" v-model="form.stripe_customer_id"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Stripe Subscription ID</label>
                            <input type="text" v-model="form.stripe_subscription_id"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                    </div>

                    <!-- Auto Renew -->
                    <div class="flex items-center">
                        <input type="checkbox" v-model="form.auto_renew" 
                               class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                        <label class="ml-2 text-sm text-gray-600">Auto-renew subscription</label>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex gap-3 pt-4 border-t border-gray-200">
                        <router-link to="/admin/subscription/tenants" 
                                     class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition-colors">
                            Cancel
                        </router-link>
                        <button type="submit" :disabled="saving"
                                class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ saving ? 'Updating...' : 'Update Subscription' }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Not Found -->
            <div v-else class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Subscription not found</h3>
                <router-link to="/admin/subscription/tenants" 
                             class="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Back to Subscriptions
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminApi } from '@/api/admin/subscription.js';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const saving = ref(false);
const subscription = ref(null);
const plans = ref([]);

const form = reactive({
    subscription_plan_id: '',
    status: 'active',
    current_period_start: '',
    current_period_end: '',
    grace_period_ends_at: null,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    auto_renew: true
});

const formatDateTimeLocal = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
};

const fetchSubscription = async () => {
    loading.value = true;
    try {
        const response = await adminApi.getTenantSubscription(route.params.id);
        subscription.value = response.data.data;
        
        // Populate form
        form.subscription_plan_id = subscription.value.subscription_plan_id;
        form.status = subscription.value.status;
        form.current_period_start = formatDateTimeLocal(subscription.value.current_period_start);
        form.current_period_end = formatDateTimeLocal(subscription.value.current_period_end);
        form.grace_period_ends_at = subscription.value.grace_period_ends_at ? formatDateTimeLocal(subscription.value.grace_period_ends_at) : null;
        form.stripe_customer_id = subscription.value.stripe_customer_id;
        form.stripe_subscription_id = subscription.value.stripe_subscription_id;
        form.auto_renew = subscription.value.auto_renew;
    } catch (error) {
        console.error('Failed to load subscription:', error);
        Swal.fire('Error', 'Failed to load subscription details', 'error');
    } finally {
        loading.value = false;
    }
};

const fetchPlans = async () => {
    try {
        const response = await adminApi.getPlans({ is_active: true });
        plans.value = response.data.data || [];
    } catch (error) {
        console.error('Failed to load plans:', error);
    }
};

const updateSubscription = async () => {
    saving.value = true;
    try {
        await adminApi.updateTenantSubscription(route.params.id, form);
        Swal.fire('Success', 'Subscription updated successfully', 'success');
        router.push('/admin/subscription/tenants');
    } catch (error) {
        console.error('Failed to update subscription:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to update subscription', 'error');
    } finally {
        saving.value = false;
    }
};

onMounted(() => {
    Promise.all([fetchSubscription(), fetchPlans()]);
});
</script>