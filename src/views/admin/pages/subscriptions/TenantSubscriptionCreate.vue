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
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Create Tenant Subscription</h1>
                        <p class="text-sm text-gray-500 mt-1">Assign a subscription plan to a tenant</p>
                    </div>
                </div>
            </div>

            <!-- Form -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form @submit.prevent="saveSubscription" class="space-y-6">
                    <!-- Tenant Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tenant *</label>
                        <select v-model="form.tenant_id" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Select a tenant...</option>
                            <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                                {{ tenant.name }} ({{ tenant.email }})
                            </option>
                        </select>
                    </div>

                    <!-- Plan Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subscription Plan *</label>
                        <select v-model="form.subscription_plan_id" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Select a plan...</option>
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
                        <p class="text-xs text-gray-400 mt-1">When the grace period ends (if applicable)</p>
                    </div>

                    <!-- Stripe IDs -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Stripe Customer ID</label>
                            <input type="text" v-model="form.stripe_customer_id"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                   placeholder="cus_xxxxxxxxxx">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Stripe Subscription ID</label>
                            <input type="text" v-model="form.stripe_subscription_id"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                   placeholder="sub_xxxxxxxxxx">
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
                            {{ saving ? 'Creating...' : 'Create Subscription' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { adminApi } from '@/api/admin/subscription.js';
import Swal from 'sweetalert2';

const router = useRouter();
const saving = ref(false);
const tenants = ref([]);
const plans = ref([]);

const form = reactive({
    tenant_id: '',
    subscription_plan_id: '',
    status: 'active',
    current_period_start: '',
    current_period_end: '',
    grace_period_ends_at: null,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    auto_renew: true
});

const fetchData = async () => {
    try {
        const [tenantsRes, plansRes] = await Promise.all([
            adminApi.getTenants(),
            adminApi.getPlans({ is_active: true })
        ]);
        tenants.value = tenantsRes.data.data || [];
        plans.value = plansRes.data.data || [];
    } catch (error) {
        console.error('Failed to load data:', error);
        Swal.fire('Error', 'Failed to load tenants or plans', 'error');
    }
};

const saveSubscription = async () => {
    saving.value = true;
    try {
        await adminApi.createTenantSubscription(form);
        Swal.fire('Success', 'Subscription created successfully', 'success');
        router.push('/admin/subscription/tenants');
    } catch (error) {
        console.error('Failed to create subscription:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to create subscription', 'error');
    } finally {
        saving.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>