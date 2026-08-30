<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-7xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Invoices</h1>
                    <p class="text-sm text-gray-500 mt-1">View and manage your billing history</p>
                </div>
                <div class="mt-4 sm:mt-0 flex gap-3">
                    <button @click="downloadAllInvoices" 
                            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Download All
                    </button>
                    <button @click="refreshData" 
                            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        <svg class="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="max-w-7xl mx-auto mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select v-model="filters.status" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Billing Model</label>
                        <select v-model="filters.billing_model" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All Models</option>
                            <option value="subscription">Subscription</option>
                            <option value="per_pool">Per Pool</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                        <input type="date" v-model="filters.date_from" 
                               @change="applyFilters"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                        <input type="date" v-model="filters.date_to" 
                               @change="applyFilters"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    </div>
                </div>
                <div class="mt-4 flex justify-end">
                    <button @click="resetFilters" 
                            class="text-sm text-gray-500 hover:text-gray-700">
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="max-w-7xl mx-auto mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Total Invoices</p>
                    <p class="text-2xl font-bold text-gray-900">{{ summary.total_invoices || 0 }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Total Amount</p>
                    <p class="text-2xl font-bold text-gray-900">${{ (summary.total_amount || 0).toFixed(2) }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Paid</p>
                    <p class="text-2xl font-bold text-green-600">${{ (summary.paid_amount || 0).toFixed(2) }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p class="text-sm text-gray-500">Pending</p>
                    <p class="text-2xl font-bold text-amber-600">${{ (summary.pending_amount || 0).toFixed(2) }}</p>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading invoices...</p>
            </div>
        </div>

        <!-- Invoices Table -->
        <div v-else class="max-w-7xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</p>
                                        <p class="text-xs text-gray-500">#{{ invoice.id }}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p class="text-sm text-gray-600">{{ invoice.billing_period }}</p>
                                    <p class="text-xs text-gray-400">{{ formatDate(invoice.period_start) }} - {{ formatDate(invoice.period_end) }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                        {{ invoice.billing_model.replace('_', ' ') }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p class="text-sm font-semibold text-gray-900">${{ parseFloat(invoice.total).toFixed(2) }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="{
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                                        'bg-green-100 text-green-800': invoice.status === 'paid',
                                        'bg-amber-100 text-amber-800': invoice.status === 'pending',
                                        'bg-red-100 text-red-800': invoice.status === 'overdue',
                                        'bg-gray-100 text-gray-800': invoice.status === 'cancelled',
                                        'bg-purple-100 text-purple-800': invoice.status === 'failed'
                                    }">
                                        {{ invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(invoice.created_at) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <router-link :to="`/tenant/invoices/${invoice.id}`" 
                                                     class="text-indigo-600 hover:text-indigo-900 transition-colors">
                                            View
                                        </router-link>
                                        <button @click="downloadInvoice(invoice.id)" 
                                                class="text-gray-600 hover:text-gray-900 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                            </svg>
                                        </button>
                                        <button v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
                                                @click="handlePayInvoice(invoice)"
                                                class="text-green-600 hover:text-green-900 transition-colors">
                                            Pay
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
                        {{ pagination.total }} results
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useBilling } from '@/composables/tenant/useBilling';

const { 
    loading, 
    invoices,
    summary,
    pagination,
    fetchInvoices, 
    payInvoice,
    downloadInvoice,
    downloadAllInvoices
} = useBilling();

const filters = reactive({
    status: '',
    billing_model: '',
    date_from: '',
    date_to: ''
});

const showPaymentModal = ref(false);
const paymentInvoice = ref(null);
const paymentMethod = ref('stripe');
const processingPayment = ref(false);

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const applyFilters = () => {
    fetchInvoices(filters);
};

const resetFilters = () => {
    filters.status = '';
    filters.billing_model = '';
    filters.date_from = '';
    filters.date_to = '';
    applyFilters();
};

const nextPage = () => {
    if (pagination.currentPage < pagination.lastPage) {
        pagination.currentPage++;
        applyFilters();
    }
};

const prevPage = () => {
    if (pagination.currentPage > 1) {
        pagination.currentPage--;
        applyFilters();
    }
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
        await fetchInvoices(filters);
    } catch (error) {
        console.error('Payment failed:', error);
    } finally {
        processingPayment.value = false;
    }
};

const refreshData = () => {
    fetchInvoices(filters);
};

onMounted(async () => {
    await fetchInvoices();
});

// Watch for filter changes
watch(() => filters, applyFilters, { deep: true });
</script>