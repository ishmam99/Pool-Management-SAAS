<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-7xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Billing Dashboard</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage your subscription and billing information</p>
                </div>
                <button 
                    @click="refreshData" 
                    :disabled="loading"
                    class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg class="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading your billing information...</p>
            </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="max-w-7xl mx-auto space-y-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <!-- Card 1: Current Plan -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4 flex-1">
                            <p class="text-sm font-medium text-gray-500">Current Plan</p>
                            <p class="text-lg font-semibold text-gray-900">{{ currentPlan?.name || 'No Active Plan' }}</p>
                            <p class="text-xs text-gray-400 mt-1" v-if="currentPlan">
                                {{ currentPlan.billing_cycle === 'yearly' ? 'Annual' : 'Monthly' }} Billing
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Next Billing -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4 flex-1">
                            <p class="text-sm font-medium text-gray-500">Next Billing Date</p>
                            <p class="text-lg font-semibold text-gray-900">{{ nextBillingDate || 'N/A' }}</p>
                            <p class="text-xs text-gray-400 mt-1" v-if="daysUntilBilling !== null">
                                {{ daysUntilBilling > 0 ? `In ${daysUntilBilling} days` : 'Due today' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Card 3: Pending Amount -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="12" y1="18" x2="12" y2="12"/>
                                    <line x1="9" y1="15" x2="15" y2="15"/>
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4 flex-1">
                            <p class="text-sm font-medium text-gray-500">Pending Amount</p>
                            <p class="text-lg font-semibold text-gray-900">${{ pendingAmount.toFixed(2) }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ pendingInvoices.length }} invoice(s) pending</p>
                        </div>
                    </div>
                </div>

                <!-- Card 4: Total Invoices -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4 flex-1">
                            <p class="text-sm font-medium text-gray-500">Total Invoices</p>
                            <p class="text-lg font-semibold text-gray-900">{{ totalInvoices }}</p>
                            <p class="text-xs text-gray-400 mt-1">Lifetime total</p>
                        </div>
                    </div>
                </div>
            </div>

          <!-- Quick Actions -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
    <router-link to="/provider/billing/subscription/plans" 
                 class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
        <svg class="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">View Plans</span>
    </router-link>
    
    <router-link to="/provider/billing/subscription/my-subscriptions" 
                 class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
        <svg class="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
        <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">My Subscriptions</span>
    </router-link>
    
    <router-link to="/provider/billing/subscription/invoices" 
                 class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
        <svg class="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">View Invoices</span>
    </router-link>
    
    <router-link to="/provider/billing/subscription/payment-methods" 
                 class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
        <svg class="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
        <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Payment Methods</span>
    </router-link>
</div>

<!-- Recent Invoices -->
<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        <router-link to="/provider/billing/subscription/invoices" 
                     class="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View All →
        </router-link>
    </div>

    <div v-if="recentInvoices.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 mx-auto text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        <p class="mt-3 text-sm text-gray-500">No invoices yet</p>
    </div>

    <div v-else class="space-y-3">
        <div v-for="invoice in recentInvoices" :key="invoice.id" 
             @click="viewInvoice(invoice)"
             class="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-gray-50 cursor-pointer transition-all">
            <div class="flex items-center gap-4">
                <div class="flex-shrink-0">
                    <div :class="{
                        'w-10 h-10 rounded-lg flex items-center justify-center': true,
                        'bg-green-100': invoice.status === 'paid',
                        'bg-amber-100': invoice.status === 'pending',
                        'bg-red-100': invoice.status === 'overdue',
                        'bg-gray-100': invoice.status === 'cancelled'
                    }">
                        <svg class="w-5 h-5" :class="{
                            'text-green-600': invoice.status === 'paid',
                            'text-amber-600': invoice.status === 'pending',
                            'text-red-600': invoice.status === 'overdue',
                            'text-gray-600': invoice.status === 'cancelled'
                        }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                    </div>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</p>
                    <p class="text-xs text-gray-500">{{ invoice.billing_period }}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">${{ parseFloat(invoice.total).toFixed(2) }}</p>
                <span :class="{
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium': true,
                    'bg-green-100 text-green-800': invoice.status === 'paid',
                    'bg-amber-100 text-amber-800': invoice.status === 'pending',
                    'bg-red-100 text-red-800': invoice.status === 'overdue',
                    'bg-gray-100 text-gray-800': invoice.status === 'cancelled'
                }">
                    {{ invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }}
                </span>
            </div>
        </div>
    </div>
</div>
        </div>

        <!-- Invoice Detail Modal -->
        <div v-if="selectedInvoice" class="fixed inset-0 z-50 overflow-y-auto" @click.self="selectedInvoice = null">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Invoice Details</h3>
                        <button @click="selectedInvoice = null" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div class="flex justify-between items-start border-b border-gray-200 pb-4">
                            <div>
                                <p class="text-sm text-gray-500">Invoice Number</p>
                                <p class="font-medium">{{ selectedInvoice.invoice_number }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-500">Status</p>
                                <span :class="{
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                                    'bg-green-100 text-green-800': selectedInvoice.status === 'paid',
                                    'bg-amber-100 text-amber-800': selectedInvoice.status === 'pending',
                                    'bg-red-100 text-red-800': selectedInvoice.status === 'overdue',
                                    'bg-gray-100 text-gray-800': selectedInvoice.status === 'cancelled'
                                }">
                                    {{ selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1) }}
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Billing Period</p>
                                <p class="font-medium">{{ selectedInvoice.billing_period }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Due Date</p>
                                <p class="font-medium">{{ formatDate(selectedInvoice.due_date) }}</p>
                            </div>
                        </div>

                        <div class="border-t border-gray-200 pt-4">
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Subtotal</span>
                                    <span class="font-medium">${{ parseFloat(selectedInvoice.subtotal).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Tax</span>
                                    <span class="font-medium">${{ parseFloat(selectedInvoice.tax).toFixed(2) }}</span>
                                </div>
                                <div v-if="parseFloat(selectedInvoice.discount) > 0" class="flex justify-between">
                                    <span class="text-gray-600">Discount</span>
                                    <span class="font-medium text-green-600">-${{ parseFloat(selectedInvoice.discount).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between border-t border-gray-200 pt-2">
                                    <span class="text-base font-semibold text-gray-900">Total</span>
                                    <span class="text-base font-bold text-gray-900">${{ parseFloat(selectedInvoice.total).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-3 pt-4 border-t border-gray-200">
                            <button @click="downloadInvoice(selectedInvoice.id)" 
                                    class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                Download PDF
                            </button>
                            <button v-if="selectedInvoice.status === 'pending' || selectedInvoice.status === 'overdue'"
                                    @click="handlePayInvoice(selectedInvoice)"
                                    class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Modal -->
        <div v-if="showPaymentModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showPaymentModal = false">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Make Payment</h3>
                        <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-sm text-gray-600">Amount Due</p>
                            <p class="text-2xl font-bold text-gray-900">${{ parseFloat(paymentInvoice?.total || 0).toFixed(2) }}</p>
                            <p class="text-xs text-gray-500">Invoice: {{ paymentInvoice?.invoice_number }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                            <select v-model="paymentMethod" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="stripe">Credit Card (Stripe)</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <div v-if="paymentMethod === 'stripe'" class="border border-gray-200 rounded-lg p-4">
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Card Number</label>
                                    <input type="text" placeholder="4242 4242 4242 4242" 
                                           class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Expiry</label>
                                        <input type="text" placeholder="MM/YY" 
                                               class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">CVC</label>
                                        <input type="text" placeholder="123" 
                                               class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button @click="confirmPayment" :disabled="processingPayment"
                                class="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <svg v-if="processingPayment" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ processingPayment ? 'Processing...' : 'Pay Now' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBilling } from '@/composables/tenant/useBilling.js';
import { useSubscription } from '@/composables/tenant/useSubscription';

const { 
    loading, 
    invoices, 
    pendingInvoices,
    totalInvoices,
    totalPendingAmount,
    fetchBillingInfo, 
    fetchInvoices, 
    payInvoice,
    downloadInvoice
} = useBilling();

const { currentSubscription, fetchMySubscriptions } = useSubscription();

const selectedInvoice = ref(null);
const showPaymentModal = ref(false);
const paymentInvoice = ref(null);
const paymentMethod = ref('stripe');
const processingPayment = ref(false);

// Computed properties
const currentPlan = computed(() => {
    if (!currentSubscription.value) return null;
    return currentSubscription.value.plan;
});

const nextBillingDate = computed(() => {
    if (!currentSubscription.value?.current_period_end) return null;
    return formatDate(currentSubscription.value.current_period_end);
});

const daysUntilBilling = computed(() => {
    if (!currentSubscription.value?.current_period_end) return null;
    const diff = new Date(currentSubscription.value.current_period_end) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

const pendingAmount = computed(() => totalPendingAmount.value);

const recentInvoices = computed(() => {
    return invoices.value?.slice(0, 5) || [];
});

// Helper functions
const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Methods
const refreshData = async () => {
    await Promise.all([
        fetchBillingInfo(),
        fetchMySubscriptions(),
        fetchInvoices({ per_page: 20 })
    ]);
};

const viewInvoice = (invoice) => {
    selectedInvoice.value = invoice;
};

const handlePayInvoice = (invoice) => {
    showPaymentModal.value = true;
    paymentInvoice.value = invoice;
};

const confirmPayment = async () => {
    if (!paymentInvoice.value) return;
    
    processingPayment.value = true;
    try {
        await payInvoice(paymentInvoice.value.id, {
            payment_method: paymentMethod.value
        });
        showPaymentModal.value = false;
        await refreshData();
    } catch (error) {
        console.error('Payment failed:', error);
    } finally {
        processingPayment.value = false;
    }
};

// Lifecycle
onMounted(async () => {
    await refreshData();
});
</script>