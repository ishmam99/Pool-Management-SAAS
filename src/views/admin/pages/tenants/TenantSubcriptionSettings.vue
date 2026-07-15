<template>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-semibold text-slate-800">Subscription Settings</h1>
            <p class="mt-1 text-sm text-slate-500">
                Configure the monthly subscription plan for your tenants.
            </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-6">
            <!-- Tenant Selector Skeleton -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div class="space-y-2">
                    <div class="h-4 w-24 bg-slate-200 rounded"></div>
                    <div class="h-10 w-full bg-slate-200 rounded"></div>
                </div>
            </div>

            <!-- Tenant Info Card Skeleton -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div class="space-y-3">
                    <div class="h-5 w-32 bg-slate-200 rounded"></div>
                    <div class="h-4 w-48 bg-slate-200 rounded"></div>
                    <div class="h-4 w-40 bg-slate-200 rounded"></div>
                    <div class="h-4 w-44 bg-slate-200 rounded"></div>
                    <div class="h-4 w-36 bg-slate-200 rounded"></div>
                    <div class="h-8 w-24 bg-slate-200 rounded-full"></div>
                </div>
            </div>

            <!-- Form Card Skeleton -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div class="space-y-6">
                    <div>
                        <div class="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                        <div class="h-10 w-full bg-slate-200 rounded"></div>
                    </div>
                    <div>
                        <div class="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                        <div class="h-10 w-full bg-slate-200 rounded"></div>
                    </div>
                    <div class="h-12 w-48 bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div v-else>
            <!-- Tenant Selector -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 transition-all">
                <label class="block text-sm font-medium text-slate-700 mb-1.5">
                    Select Tenant
                </label>
                <select v-model="selectedTenantId" @change="onTenantSelected"
                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors">
                    <option value="">Choose a tenant to configure subscription settings</option>
                    <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                        {{ tenant.company_name }}
                    </option>
                </select>
            </div>

            <!-- No Tenant Selected -->
            <div v-if="!selectedTenantId"
                class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-slate-800">Choose a tenant</h3>
                <p class="mt-2 text-sm text-slate-500">
                    Select a tenant above to configure subscription settings.
                </p>
            </div>

            <!-- Tenant Information & Configuration -->
            <div v-else>
                <!-- Loading Configuration -->
                <div v-if="loadingConfig" class="space-y-6">
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <div class="h-4 w-32 bg-slate-200 rounded"></div>
                                <div class="h-6 w-48 bg-slate-200 rounded"></div>
                            </div>
                            <div class="space-y-2">
                                <div class="h-4 w-32 bg-slate-200 rounded"></div>
                                <div class="h-6 w-48 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
                        <div class="space-y-3">
                            <div class="h-5 w-32 bg-slate-200 rounded"></div>
                            <div class="h-4 w-48 bg-slate-200 rounded"></div>
                            <div class="h-4 w-40 bg-slate-200 rounded"></div>
                            <div class="h-4 w-44 bg-slate-200 rounded"></div>
                            <div class="h-4 w-36 bg-slate-200 rounded"></div>
                            <div class="h-8 w-24 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
                        <div class="space-y-6">
                            <div>
                                <div class="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                                <div class="h-10 w-full bg-slate-200 rounded"></div>
                            </div>
                            <div class="h-12 w-48 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>

                <!-- Content when config is loaded -->
                <div v-else>
                    <!-- Tenant Information Card -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 transition-all">
                        <h2 class="text-sm font-medium text-slate-500 mb-4">Tenant Information</h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm font-medium text-slate-500">Company Name</p>
                                <p class="text-base font-semibold text-slate-800">
                                    {{ selectedTenant?.company_name || 'N/A' }}
                                </p>
                            </div>

                            <div>
                                <p class="text-sm font-medium text-slate-500">Email</p>
                                <p class="text-base text-slate-800">
                                    {{ selectedTenant?.email || 'N/A' }}
                                </p>
                            </div>

                            <div>
                                <p class="text-sm font-medium text-slate-500">Phone</p>
                                <p class="text-base text-slate-800">
                                    {{ selectedTenant?.phone || 'N/A' }}
                                </p>
                            </div>

                            <div>
                                <p class="text-sm font-medium text-slate-500">Website</p>
                                <p class="text-base text-slate-800">
                                    {{ selectedTenant?.website || 'N/A' }}
                                </p>
                            </div>

                            <div>
                                <p class="text-sm font-medium text-slate-500">Status</p>
                                <span :class="[
                                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                                    selectedTenant?.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                ]">
                                    {{ selectedTenant?.status ? 'Active' : 'Inactive' }}
                                </span>
                            </div>

                            <div>
                                <p class="text-sm font-medium text-slate-500">Billing Model</p>
                                <span
                                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    {{ billingData?.billing_config?.billing_model.toUpperCase() || 'N/A' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Billing Summary Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Active Pools Card -->
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all">
                            <p class="text-sm font-medium text-slate-500">Active Pools</p>
                            <p class="text-2xl font-bold text-slate-800 mt-1">
                                {{ billingData?.active_pools_count ?? 0 }}
                            </p>
                        </div>

                        <!-- Estimated Monthly Bill Card -->
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all">
                            <p class="text-sm font-medium text-slate-500">Estimated Monthly Bill</p>
                            <p class="text-2xl font-bold text-slate-800 mt-1">
                                ${{ billingData?.estimated_monthly_bill ?? '0.00' }}
                            </p>
                        </div>
                    </div>

                    <!-- Subscription Configuration Card -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all">
                        <h2 class="text-lg font-semibold text-slate-800 mb-6">Subscription Configuration</h2>

                        <!-- Empty State -->
                        <div v-if="!billingConfig" class="mb-6">
                            <div class="rounded-xl bg-blue-50 border border-blue-200 p-4">
                                <div class="flex items-start gap-3">
                                    <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p class="text-sm text-blue-700">
                                            No billing configuration has been created for this tenant yet.
                                        </p>
                                        <p class="text-sm text-blue-600 mt-0.5">
                                            Configure the subscription settings below and save to create one.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Form -->
                        <form @submit.prevent="handleSave" class="space-y-6">
                            <!-- Billing Model -->
                            <div>
                                <label for="billing_model" class="block text-sm font-medium text-slate-700 mb-1.5">
                                    Billing Model
                                </label>
                                <select id="billing_model" v-model="form.billing_model" :disabled="!selectedTenantId"
                                    :class="[
                                        'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
                                        !selectedTenantId && 'opacity-60 cursor-not-allowed'
                                    ]">
                                    <option value="subscription">Subscription</option>
                                    <option value="per_pool">Per Pool</option>
                                </select>
                            </div>

                            <!-- Monthly Subscription Fee -->
                            <div>
                                <label for="subscription_price" class="block text-sm font-medium text-slate-700 mb-1.5">
                                    Monthly Subscription Fee
                                </label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">$</span>
                                    <input id="subscription_price" v-model="form.subscription_price" type="number"
                                        step="0.01" min="0.01" placeholder="0.00" :disabled="!selectedTenantId" :class="[
                                            'w-full rounded-xl border px-4 py-2.5 pl-8 text-sm transition-colors',
                                            errors.subscription_price
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500',
                                            'bg-white text-slate-800',
                                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                                            !selectedTenantId && 'opacity-60 cursor-not-allowed'
                                        ]" required />
                                </div>
                                <p class="mt-1.5 text-sm text-slate-500">Monthly fee charged to this tenant.</p>
                                <p v-if="errors.subscription_price" class="mt-1 text-sm text-red-600">
                                    {{ errors.subscription_price }}
                                </p>
                            </div>

                            <!-- Save Button -->
                            <div class="pt-2">
                                <button type="submit" :disabled="saving || !selectedTenantId"
                                    class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                                    <svg v-if="saving" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    {{ saving ? 'Saving...' : 'Create / Update Subscription Settings' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../../../services/api.js'

// State
const loading = ref(true)
const loadingConfig = ref(false)
const saving = ref(false)
const tenants = ref([])
const selectedTenantId = ref('')
const selectedTenant = ref(null)
const billingData = ref(null)
const billingConfig = ref(null)

// Form
const form = reactive({
    subscription_price: '',
    billing_model: 'subscription',
})
// Errors
const errors = reactive({
    subscription_price: '',
})

// Methods
const loadTenants = async () => {
    loading.value = true
    try {
        const response = await api().get('/tenant/tenants?status=active')
        tenants.value = response.data.data || []
    } catch (error) {
        console.error('Failed to load tenants:', error)
    } finally {
        loading.value = false
    }
}

const loadBillingConfig = async (tenantId) => {
    if (!tenantId) return

    loadingConfig.value = true
    try {
        const response = await api().get(`/admin/tenants/${tenantId}/billing-config`)

        // Store the full response data
        billingData.value = response.data.data || response.data

        // Check if billing_config exists and has data
        const configData = response.data.data?.billing_config

        if (configData && typeof configData === 'object' && Object.keys(configData).length > 0) {
            // Billing config exists
            billingConfig.value = configData
            form.subscription_price = configData.subscription_price || ''
            form.billing_model = configData.billing_model || 'subscription' // Add this
        } else {
            // No billing config exists
            billingConfig.value = null
            form.subscription_price = ''
            form.billing_model = 'subscription' // Add this
        }
    } catch (error) {
        billingData.value = null
        billingConfig.value = null
        // Reset form to defaults
        form.subscription_price = ''
        form.billing_model = 'subscription' // Add this

        // If 404, it's fine - no config exists yet
        if (error.response?.status !== 404) {
            console.error('Failed to load billing configuration:', error)
        }
    } finally {
        loadingConfig.value = false
    }
}

const onTenantSelected = async () => {
    // Find selected tenant
    selectedTenant.value = tenants.value.find(t => t.id === selectedTenantId.value)

    // Reset billing data and config
    billingData.value = null
    billingConfig.value = null
    form.subscription_price = ''
    form.billing_model = 'subscription' // Add this

    // Load billing config for selected tenant (API call)
    if (selectedTenantId.value) {
        await loadBillingConfig(selectedTenantId.value)
    }
}

const validateForm = () => {
    let isValid = true
    errors.subscription_price = ''

    if (!form.subscription_price || Number(form.subscription_price) <= 0) {
        errors.subscription_price = 'Subscription fee is required and must be greater than zero.'
        isValid = false
    } else if (isNaN(Number(form.subscription_price))) {
        errors.subscription_price = 'Please enter a valid number.'
        isValid = false
    }

    return isValid
}
const handleSave = async () => {
    if (!selectedTenantId.value) return
    if (!validateForm()) return
    if (saving.value) return

    saving.value = true
    try {
        const payload = {
            _method: 'PUT',
            billing_cycle: 'monthly',
            billing_model: form.billing_model,
            ...(form.billing_model === 'subscription'
                ? { subscription_price: Number(form.subscription_price) }
                : { per_pool_price: Number(form.subscription_price) }),
        }

        await api().post(`/admin/tenants/${selectedTenantId.value}/billing-config`, payload)

        // Reload billing configuration
        await loadBillingConfig(selectedTenantId.value)

        // Show success toast
        console.log('Subscription settings saved successfully')
    } catch (error) {
        console.error('Failed to save subscription settings:', error)
    } finally {
        saving.value = false
    }
}


// Lifecycle
onMounted(() => {
    loadTenants()
})
</script>

<style scoped>
/* Smooth transitions for toggle */
button[role="switch"] {
    transition: background-color 0.2s ease-in-out;
}

button[role="switch"] span {
    transition: transform 0.2s ease-in-out;
}
</style>