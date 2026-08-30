<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-7xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Billing Configuration</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage tenant billing settings and configurations</p>
                </div>
                <div class="mt-4 sm:mt-0 flex gap-3">
                    <button @click="refreshData" 
                            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <svg class="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Tenant Selector -->
        <div class="max-w-7xl mx-auto mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
                        <select v-model="selectedTenantId" 
                                @change="loadTenantConfig"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">Select a tenant...</option>
                            <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                                {{ tenant.name }} ({{ tenant.email }})
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tenant Status</label>
                        <div class="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                            <span v-if="selectedTenant">
                                {{ selectedTenant.status || 'Active' }}
                            </span>
                            <span v-else class="text-gray-400">No tenant selected</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Active Pools</label>
                        <div class="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                            <span v-if="tenantStats">
                                {{ tenantStats.active_pools_count || 0 }} pools
                            </span>
                            <span v-else class="text-gray-400">Select tenant to view</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading billing configuration...</p>
            </div>
        </div>

        <!-- Billing Config Form -->
        <div v-else-if="selectedTenantId" class="max-w-7xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <form @submit.prevent="saveConfig" class="p-6 space-y-6">
                    <!-- Tenant Info -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-blue-800">Configuring billing for:</p>
                                <p class="text-sm text-blue-600">{{ selectedTenant?.name }} ({{ selectedTenant?.email }})</p>
                            </div>
                        </div>
                    </div>

                    <!-- Billing Model -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Billing Model *</label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div @click="form.billing_model = 'subscription'"
                                 :class="[
                                     'border-2 rounded-lg p-4 cursor-pointer transition-all',
                                     form.billing_model === 'subscription' 
                                         ? 'border-indigo-500 bg-indigo-50' 
                                         : 'border-gray-200 hover:border-gray-300'
                                 ]">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v4m0 4v4m-6-2h12"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">Subscription</p>
                                        <p class="text-xs text-gray-500">Fixed monthly/yearly fee</p>
                                    </div>
                                </div>
                            </div>

                            <div @click="form.billing_model = 'per_pool'"
                                 :class="[
                                     'border-2 rounded-lg p-4 cursor-pointer transition-all',
                                     form.billing_model === 'per_pool' 
                                         ? 'border-indigo-500 bg-indigo-50' 
                                         : 'border-gray-200 hover:border-gray-300'
                                 ]">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">Per Pool</p>
                                        <p class="text-xs text-gray-500">Pay per active pool</p>
                                    </div>
                                </div>
                            </div>

                            <div @click="form.billing_model = 'hybrid'"
                                 :class="[
                                     'border-2 rounded-lg p-4 cursor-pointer transition-all',
                                     form.billing_model === 'hybrid' 
                                         ? 'border-indigo-500 bg-indigo-50' 
                                         : 'border-gray-200 hover:border-gray-300'
                                 ]">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0h4"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">Hybrid</p>
                                        <p class="text-xs text-gray-500">Subscription + Per pool</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Per Pool Price -->
                    <div v-if="form.billing_model === 'per_pool' || form.billing_model === 'hybrid'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Per Pool Price ($) *</label>
                        <div class="relative">
                            <span class="absolute left-3 top-2 text-gray-500">$</span>
                            <input type="number" v-model="form.per_pool_price" step="0.01" min="0"
                                   required
                                   class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Price per active pool per month</p>
                    </div>

                    <!-- Billing Cycle -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Billing Cycle *</label>
                        <div class="grid grid-cols-2 gap-3">
                            <div @click="form.billing_cycle = 'monthly'"
                                 :class="[
                                     'border-2 rounded-lg p-3 cursor-pointer text-center transition-all',
                                     form.billing_cycle === 'monthly' 
                                         ? 'border-indigo-500 bg-indigo-50' 
                                         : 'border-gray-200 hover:border-gray-300'
                                 ]">
                                <span class="font-medium text-gray-900">Monthly</span>
                            </div>
                            <div @click="form.billing_cycle = 'yearly'"
                                 :class="[
                                     'border-2 rounded-lg p-3 cursor-pointer text-center transition-all',
                                     form.billing_cycle === 'yearly' 
                                         ? 'border-indigo-500 bg-indigo-50' 
                                         : 'border-gray-200 hover:border-gray-300'
                                 ]">
                                <span class="font-medium text-gray-900">Yearly</span>
                                <span class="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Save 20%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Free Pools -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Free Pools Count</label>
                        <input type="number" v-model="form.free_pools_count" min="0"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Number of pools that are free before billing starts</p>
                    </div>

                    <!-- Trial Days -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Trial Days</label>
                        <input type="number" v-model="form.trial_days" min="0" max="365"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Days of free trial for new subscriptions</p>
                    </div>

                    <!-- Payment Terms -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Payment Terms (Days)</label>
                        <input type="number" v-model="form.payment_terms_days" min="1" max="90"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Net terms for invoice payment (e.g., Net 30)</p>
                    </div>

                    <!-- Invoice Delivery -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Delivery</label>
                        <select v-model="form.invoice_delivery"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="email">Email</option>
                            <option value="portal">Portal Only</option>
                            <option value="both">Both Email & Portal</option>
                        </select>
                    </div>

                    <!-- Auto Invoice -->
                    <div class="flex items-center">
                        <input type="checkbox" v-model="form.auto_invoice" 
                               class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                        <label class="ml-2 text-sm text-gray-600">Auto-generate invoices</label>
                    </div>

                    <!-- Effective From -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Effective From</label>
                        <input type="date" v-model="form.effective_from"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Date when this configuration becomes active</p>
                    </div>

                    <!-- Status -->
                    <div class="flex items-center">
                        <input type="checkbox" v-model="form.is_active" 
                               class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                        <label class="ml-2 text-sm text-gray-600">Active</label>
                    </div>

                    <!-- Estimated Monthly Bill -->
                    <div v-if="tenantStats" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 class="text-sm font-medium text-gray-700 mb-2">Estimated Monthly Bill</h4>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p class="text-xs text-gray-500">Active Pools</p>
                                <p class="text-lg font-semibold text-gray-900">{{ tenantStats.active_pools_count || 0 }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500">Free Pools</p>
                                <p class="text-lg font-semibold text-gray-900">{{ form.free_pools_count || 0 }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500">Billable Pools</p>
                                <p class="text-lg font-semibold text-gray-900">{{ billablePools }}</p>
                            </div>
                            <div class="col-span-2 md:col-span-3">
                                <p class="text-xs text-gray-500">Estimated Monthly Total</p>
                                <p class="text-2xl font-bold text-indigo-600">${{ estimatedMonthlyBill.toFixed(2) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex gap-3 pt-4 border-t border-gray-200">
                        <button type="button" @click="resetForm"
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Reset
                        </button>
                        <button type="submit" :disabled="saving"
                                class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ saving ? 'Saving...' : 'Save Configuration' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- No Tenant Selected -->
        <div v-else-if="!selectedTenantId" class="max-w-7xl mx-auto">
            <div class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">No Tenant Selected</h3>
                <p class="mt-2 text-sm text-gray-500">Please select a tenant from the dropdown above to configure billing.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { adminApi } from '@/api/admin/subscription.js';
import Swal from 'sweetalert2';

const loading = ref(false);
const saving = ref(false);
const tenants = ref([]);
const selectedTenantId = ref('');
const selectedTenant = ref(null);
const tenantStats = ref(null);
const config = ref(null);

const form = reactive({
    billing_model: 'subscription',
    per_pool_price: null,
    billing_cycle: 'monthly',
    free_pools_count: 0,
    trial_days: 0,
    invoice_delivery: 'email',
    payment_terms_days: 30,
    auto_invoice: true,
    effective_from: '',
    is_active: true
});

const billablePools = computed(() => {
    const total = tenantStats.value?.active_pools_count || 0;
    const free = parseInt(form.free_pools_count) || 0;
    return Math.max(0, total - free);
});

const estimatedMonthlyBill = computed(() => {
    const billable = billablePools.value;
    let total = 0;
    
    if (form.billing_model === 'subscription') {
        // You would need to get the subscription price here
        total = 0; // Placeholder
    } else if (form.billing_model === 'per_pool') {
        total = billable * (parseFloat(form.per_pool_price) || 0);
    } else if (form.billing_model === 'hybrid') {
        // Hybrid: subscription + per pool
        const subscriptionPrice = 0; // Placeholder - would need to get from tenant's subscription
        total = subscriptionPrice + (billable * (parseFloat(form.per_pool_price) || 0));
    }
    
    return total;
});

const fetchTenants = async () => {
    try {
        const response = await adminApi.getTenants();
        tenants.value = response.data.data || [];
    } catch (error) {
        console.error('Failed to load tenants:', error);
        Swal.fire('Error', 'Failed to load tenants', 'error');
    }
};

const loadTenantConfig = async () => {
    if (!selectedTenantId.value) {
        selectedTenant.value = null;
        tenantStats.value = null;
        config.value = null;
        return;
    }

    loading.value = true;
    try {
        // Get tenant details
        const tenantResponse = await adminApi.getTenant(selectedTenantId.value);
        selectedTenant.value = tenantResponse.data.data;

        // Get billing config
        const configResponse = await adminApi.getBillingConfig(selectedTenantId.value);
        config.value = configResponse.data.data;
        
        // Get tenant stats
        tenantStats.value = configResponse.data.data;
        
        // Populate form with existing config
        if (config.value) {
            form.billing_model = config.value.billing_model || 'subscription';
            form.per_pool_price = config.value.per_pool_price || null;
            form.billing_cycle = config.value.billing_cycle || 'monthly';
            form.free_pools_count = config.value.free_pools_count || 0;
            form.trial_days = config.value.trial_days || 0;
            form.invoice_delivery = config.value.invoice_delivery || 'email';
            form.payment_terms_days = config.value.payment_terms_days || 30;
            form.auto_invoice = config.value.auto_invoice !== undefined ? config.value.auto_invoice : true;
            form.effective_from = config.value.effective_from || new Date().toISOString().split('T')[0];
            form.is_active = config.value.is_active !== undefined ? config.value.is_active : true;
        } else {
            // Set default effective from date
            form.effective_from = new Date().toISOString().split('T')[0];
        }
    } catch (error) {
        console.error('Failed to load tenant config:', error);
        if (error.response?.status === 404) {
            // No config found, set defaults
            form.effective_from = new Date().toISOString().split('T')[0];
        } else {
            Swal.fire('Error', 'Failed to load billing configuration', 'error');
        }
    } finally {
        loading.value = false;
    }
};

const saveConfig = async () => {
    if (!selectedTenantId.value) {
        Swal.fire('Error', 'Please select a tenant first', 'error');
        return;
    }

    saving.value = true;
    try {
        await adminApi.updateBillingConfig(selectedTenantId.value, {
            billing_model: form.billing_model,
            per_pool_price: form.per_pool_price,
            billing_cycle: form.billing_cycle,
            free_pools_count: form.free_pools_count,
            trial_days: form.trial_days,
            invoice_delivery: form.invoice_delivery,
            payment_terms_days: form.payment_terms_days,
            auto_invoice: form.auto_invoice,
            effective_from: form.effective_from,
            is_active: form.is_active
        });
        
        Swal.fire('Success', 'Billing configuration saved successfully', 'success');
        await loadTenantConfig(); // Reload to get updated config
    } catch (error) {
        console.error('Failed to save config:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to save billing configuration', 'error');
    } finally {
        saving.value = false;
    }
};

const resetForm = () => {
    if (config.value) {
        form.billing_model = config.value.billing_model || 'subscription';
        form.per_pool_price = config.value.per_pool_price || null;
        form.billing_cycle = config.value.billing_cycle || 'monthly';
        form.free_pools_count = config.value.free_pools_count || 0;
        form.trial_days = config.value.trial_days || 0;
        form.invoice_delivery = config.value.invoice_delivery || 'email';
        form.payment_terms_days = config.value.payment_terms_days || 30;
        form.auto_invoice = config.value.auto_invoice !== undefined ? config.value.auto_invoice : true;
        form.effective_from = config.value.effective_from || new Date().toISOString().split('T')[0];
        form.is_active = config.value.is_active !== undefined ? config.value.is_active : true;
    } else {
        form.billing_model = 'subscription';
        form.per_pool_price = null;
        form.billing_cycle = 'monthly';
        form.free_pools_count = 0;
        form.trial_days = 0;
        form.invoice_delivery = 'email';
        form.payment_terms_days = 30;
        form.auto_invoice = true;
        form.effective_from = new Date().toISOString().split('T')[0];
        form.is_active = true;
    }
    Swal.fire('Info', 'Form has been reset', 'info');
};

const refreshData = () => {
    if (selectedTenantId.value) {
        loadTenantConfig();
    }
    fetchTenants();
};

// Watch for tenant selection changes
watch(selectedTenantId, (newVal) => {
    if (newVal) {
        loadTenantConfig();
    }
});

onMounted(() => {
    fetchTenants();
    
    // Check if tenant_id is passed as query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tenantId = urlParams.get('tenant_id');
    if (tenantId) {
        selectedTenantId.value = tenantId;
    }
});
</script>