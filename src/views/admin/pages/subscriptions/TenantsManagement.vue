<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-7xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Tenant Subscriptions</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage tenant subscriptions and billing</p>
                </div>
                <button @click="showCreateModal = true" 
                        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Subscription
                </button>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="max-w-7xl mx-auto mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Total Tenants</p>
                    <p class="text-2xl font-bold text-gray-900">{{ summary.total_tenants || 0 }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Active Subscriptions</p>
                    <p class="text-2xl font-bold text-green-600">{{ summary.active || 0 }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Grace Period</p>
                    <p class="text-2xl font-bold text-amber-600">{{ summary.grace_period || 0 }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Suspended</p>
                    <p class="text-2xl font-bold text-red-600">{{ summary.suspended || 0 }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Cancelled</p>
                    <p class="text-2xl font-bold text-gray-600">{{ summary.cancelled || 0 }}</p>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="max-w-7xl mx-auto mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input type="text" v-model="filters.search" 
                               @input="applyFilters"
                               placeholder="Search tenant or plan..." 
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select v-model="filters.status" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="trialing">Trialing</option>
                            <option value="grace_period">Grace Period</option>
                            <option value="suspended">Suspended</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                        <select v-model="filters.plan_id" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All Plans</option>
                            <option v-for="plan in plans" :key="plan.id" :value="plan.id">
                                {{ plan.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Expiring Soon</label>
                        <select v-model="filters.expiring_soon" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All</option>
                            <option value="1">Next 7 Days</option>
                            <option value="30">Next 30 Days</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select v-model="filters.sort_by" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="created_at">Created Date</option>
                            <option value="current_period_end">Expiry Date</option>
                            <option value="tenant_id">Tenant</option>
                            <option value="status">Status</option>
                        </select>
                    </div>
                </div>
                <div class="mt-4 flex justify-end">
                    <button @click="resetFilters" 
                            class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading subscriptions...</p>
            </div>
        </div>

        <!-- Subscriptions Table -->
        <div v-else class="max-w-7xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto-Renew</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe ID</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="subscription in subscriptions" :key="subscription.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">{{ subscription.tenant?.name || 'N/A' }}</p>
                                        <p class="text-xs text-gray-500">{{ subscription.tenant?.email || 'No email' }}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p class="text-sm font-medium text-gray-900">{{ subscription.plan?.name || 'No Plan' }}</p>
                                    <p class="text-xs text-gray-500">${{ parseFloat(subscription.plan?.price || 0).toFixed(2) }}/{{ subscription.plan?.billing_cycle || 'month' }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="{
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                                        'bg-green-100 text-green-800': subscription.status === 'active',
                                        'bg-blue-100 text-blue-800': subscription.status === 'trialing',
                                        'bg-amber-100 text-amber-800': subscription.status === 'grace_period',
                                        'bg-red-100 text-red-800': subscription.status === 'suspended' || subscription.status === 'failed',
                                        'bg-gray-100 text-gray-800': subscription.status === 'cancelled'
                                    }">
                                        {{ subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm">
                                        <div class="text-gray-600">Start: {{ formatDate(subscription.current_period_start) }}</div>
                                        <div class="text-gray-600">End: {{ formatDate(subscription.current_period_end) }}</div>
                                        <div v-if="subscription.grace_period_ends_at" class="text-amber-600 text-xs">
                                            Grace: {{ formatDate(subscription.grace_period_ends_at) }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="{
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                                        'bg-green-100 text-green-800': subscription.auto_renew,
                                        'bg-red-100 text-red-800': !subscription.auto_renew
                                    }">
                                        {{ subscription.auto_renew ? 'Enabled' : 'Disabled' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-xs text-gray-500">
                                        {{ subscription.stripe_subscription_id || 'N/A' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click="editSubscription(subscription)" 
                                                class="text-indigo-600 hover:text-indigo-900 transition-colors">
                                            Edit
                                        </button>
                                        <button v-if="subscription.status !== 'cancelled'" 
                                                @click="cancelSubscription(subscription)"
                                                class="text-red-600 hover:text-red-900 transition-colors">
                                            Cancel
                                        </button>
                                        <button v-if="subscription.status === 'cancelled'" 
                                                @click="renewSubscription(subscription)"
                                                class="text-green-600 hover:text-green-900 transition-colors">
                                            Renew
                                        </button>
                                        <button @click="viewBillingConfig(subscription.tenant_id)" 
                                                class="text-amber-600 hover:text-amber-900 transition-colors">
                                            Billing
                                        </button>
                                        <button @click="generateInvoice(subscription)" 
                                                class="text-blue-600 hover:text-blue-900 transition-colors">
                                            Invoice
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                        Showing {{ (pagination.currentPage - 1) * pagination.perPage + 1 }} to 
                        {{ Math.min(pagination.currentPage * pagination.perPage, pagination.total) }} of 
                        {{ pagination.total }} subscriptions
                    </div>
                    <div class="flex gap-2">
                        <button @click="prevPage" 
                                :disabled="pagination.currentPage <= 1"
                                class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Previous
                        </button>
                        <span class="px-3 py-1 text-sm text-gray-700">
                            Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
                        </span>
                        <button @click="nextPage" 
                                :disabled="pagination.currentPage >= pagination.lastPage"
                                class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Subscription Modal -->
        <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">
                            {{ showEditModal ? 'Edit Subscription' : 'Create New Subscription' }}
                        </h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="saveSubscription" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tenant *</label>
                            <select v-model="form.tenant_id" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">Select Tenant</option>
                                <option v-for="tenant in allTenants" :key="tenant.id" :value="tenant.id">
                                    {{ tenant.name }} ({{ tenant.email }})
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Plan *</label>
                            <select v-model="form.subscription_plan_id" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">Select Plan</option>
                                <option v-for="plan in activePlans" :key="plan.id" :value="plan.id">
                                    {{ plan.name }} - ${{ parseFloat(plan.price).toFixed(2) }}/{{ plan.billing_cycle }}
                                </option>
                            </select>
                        </div>

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

                        <div class="grid grid-cols-2 gap-4">
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

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Grace Period Ends</label>
                            <input type="datetime-local" v-model="form.grace_period_ends_at"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        </div>

                        <div class="grid grid-cols-2 gap-4">
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

                        <div class="flex items-center">
                            <input type="checkbox" v-model="form.auto_renew" 
                                   class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                            <label class="ml-2 text-sm text-gray-600">Auto-renew</label>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="closeModal"
                                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" :disabled="saving"
                                    class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {{ saving ? 'Saving...' : 'Save Subscription' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted,watch } from 'vue';
import { adminApi } from '@/api/admin/subscription.js';
import Swal from 'sweetalert2';

const loading = ref(false);
const saving = ref(false);
const subscriptions = ref([]);
const plans = ref([]);
const activePlans = ref([]);
const allTenants = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingSubscription = ref(null);

const summary = reactive({
    total_tenants: 0,
    active: 0,
    grace_period: 0,
    suspended: 0,
    cancelled: 0
});

const pagination = reactive({
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1
});

const filters = reactive({
    search: '',
    status: '',
    plan_id: '',
    expiring_soon: '',
    sort_by: 'created_at'
});

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

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatDateTimeLocal = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
};

const fetchSubscriptions = async () => {
    loading.value = true;
    try {
        const response = await adminApi.getTenantSubscriptions({
            page: pagination.currentPage,
            per_page: pagination.perPage,
            ...filters
        });
        console.log('Subscriptions response:', response.data);
        subscriptions.value = response.data.subscriptions.data || response.data.data || [];
        pagination.total = response.data.summary.total || 0;
        pagination.lastPage = response.data.subscriptions.last_page || 1;
        
        // Update summary
        const summaryData = response.data.summary || {};
        summary.total_tenants = summaryData.total || 0;
        summary.active = summaryData.active || 0;
        summary.grace_period = summaryData.grace_period || 0;
        summary.suspended = summaryData.suspended || 0;
        summary.cancelled = summaryData.cancelled || 0;
    } catch (error) {
        console.error('Failed to load subscriptions:', error);
        Swal.fire('Error', 'Failed to load tenant subscriptions', 'error');
    } finally {
        loading.value = false;
    }
};

const fetchPlans = async () => {
    try {
        const response = await adminApi.getPlans({ is_active: true });
        plans.value = response.data.data || [];
        activePlans.value = plans.value.filter(p => p.is_active);
    } catch (error) {
        console.error('Failed to load plans:', error);
    }
};

const fetchTenants = async () => {
    try {
        // You might need to create this API endpoint
        const response = await adminApi.getTenants();
        allTenants.value = response.data.data || [];
    } catch (error) {
        console.error('Failed to load tenants:', error);
        // Fallback: use tenants from subscriptions
        const tenantIds = new Set(subscriptions.value.map(s => s.tenant_id));
        // You would need to fetch tenant details here
    }
};

const applyFilters = () => {
    pagination.currentPage = 1;
    fetchSubscriptions();
};

const resetFilters = () => {
    filters.search = '';
    filters.status = '';
    filters.plan_id = '';
    filters.expiring_soon = '';
    filters.sort_by = 'created_at';
    applyFilters();
};

const nextPage = () => {
    if (pagination.currentPage < pagination.lastPage) {
        pagination.currentPage++;
        fetchSubscriptions();
    }
};

const prevPage = () => {
    if (pagination.currentPage > 1) {
        pagination.currentPage--;
        fetchSubscriptions();
    }
};

const editSubscription = (subscription) => {
    editingSubscription.value = subscription;
    form.tenant_id = subscription.tenant_id;
    form.subscription_plan_id = subscription.subscription_plan_id;
    form.status = subscription.status;
    form.current_period_start = formatDateTimeLocal(subscription.current_period_start);
    form.current_period_end = formatDateTimeLocal(subscription.current_period_end);
    form.grace_period_ends_at = subscription.grace_period_ends_at ? formatDateTimeLocal(subscription.grace_period_ends_at) : null;
    form.stripe_customer_id = subscription.stripe_customer_id;
    form.stripe_subscription_id = subscription.stripe_subscription_id;
    form.auto_renew = subscription.auto_renew;
    showEditModal.value = true;
};

const closeModal = () => {
    showCreateModal.value = false;
    showEditModal.value = false;
    editingSubscription.value = null;
    resetForm();
};

const resetForm = () => {
    form.tenant_id = '';
    form.subscription_plan_id = '';
    form.status = 'active';
    form.current_period_start = '';
    form.current_period_end = '';
    form.grace_period_ends_at = null;
    form.stripe_customer_id = null;
    form.stripe_subscription_id = null;
    form.auto_renew = true;
};

const saveSubscription = async () => {
    saving.value = true;
    try {
        let response;
        if (editingSubscription.value) {
            response = await adminApi.updateTenantSubscription(editingSubscription.value.id, form);
        } else {
            response = await adminApi.createTenantSubscription(form);
        }
        
        Swal.fire('Success', editingSubscription.value ? 'Subscription updated successfully' : 'Subscription created successfully', 'success');
        closeModal();
        fetchSubscriptions();
    } catch (error) {
        console.error('Failed to save subscription:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to save subscription', 'error');
    } finally {
        saving.value = false;
    }
};

const cancelSubscription = async (subscription) => {
    const result = await Swal.fire({
        title: 'Cancel Subscription',
        text: `Cancel subscription for "${subscription.tenant?.name || 'Unknown Tenant'}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!'
    });
    
    if (result.isConfirmed) {
        try {
            await adminApi.cancelTenantSubscription(subscription.id);
            Swal.fire('Success', 'Subscription cancelled successfully', 'success');
            fetchSubscriptions();
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to cancel subscription', 'error');
        }
    }
};

const renewSubscription = async (subscription) => {
    try {
        await adminApi.renewTenantSubscription(subscription.id);
        Swal.fire('Success', 'Subscription renewed successfully', 'success');
        fetchSubscriptions();
    } catch (error) {
        console.error('Failed to renew subscription:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to renew subscription', 'error');
    }
};

const viewBillingConfig = (tenantId) => {
    // Navigate to billing config page with tenant ID
    window.location.href = `/admin/subscription/billing-config?tenant_id=${tenantId}`;
};

const generateInvoice = async (subscription) => {
    try {
        await adminApi.generateInvoice(subscription.tenant_id, {
            period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
        });
        Swal.fire('Success', 'Invoice generated successfully', 'success');
    } catch (error) {
        console.error('Failed to generate invoice:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to generate invoice', 'error');
    }
};

// Watch for filter changes
watch(() => filters, applyFilters, { deep: true });

onMounted(async () => {
    await Promise.all([
        fetchSubscriptions(),
        fetchPlans(),
        fetchTenants()
    ]);
});
</script>