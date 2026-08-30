<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div class="max-w-4xl mx-auto">
            <!-- Loading State -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading invoice...</p>
            </div>

            <!-- Invoice Content -->
            <div v-else-if="invoice" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <!-- Invoice Header -->
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h1 class="text-xl font-bold text-gray-900">Invoice</h1>
                        <p class="text-sm text-gray-500">#{{ invoice.invoice_number }}</p>
                    </div>
                    <div class="text-right">
                        <span :class="{
                            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium': true,
                            'bg-green-100 text-green-800': invoice.status === 'paid',
                            'bg-amber-100 text-amber-800': invoice.status === 'pending',
                            'bg-red-100 text-red-800': invoice.status === 'overdue',
                            'bg-gray-100 text-gray-800': invoice.status === 'cancelled'
                        }">
                            {{ invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }}
                        </span>
                    </div>
                </div>

                <!-- Invoice Body -->
                <div class="p-6 space-y-6">
                    <!-- Company & Bill To -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-sm text-gray-500">From</p>
                            <p class="font-semibold text-gray-900">{{ companyName }}</p>
                            <p class="text-sm text-gray-600">{{ companyAddress }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Bill To</p>
                            <p class="font-semibold text-gray-900">{{ invoice.tenant?.name || 'N/A' }}</p>
                            <p class="text-sm text-gray-600">{{ invoice.tenant?.email || 'N/A' }}</p>
                        </div>
                    </div>

                    <!-- Invoice Details -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p class="text-sm text-gray-500">Invoice Date</p>
                            <p class="font-medium text-gray-900">{{ formatDate(invoice.created_at) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Due Date</p>
                            <p class="font-medium text-gray-900">{{ formatDate(invoice.due_date) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Billing Period</p>
                            <p class="font-medium text-gray-900">{{ invoice.billing_period }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Billing Model</p>
                            <p class="font-medium text-gray-900 capitalize">{{ invoice.billing_model?.replace('_', ' ') }}</p>
                        </div>
                    </div>

                    <!-- Invoice Items -->
                    <div class="border-t border-gray-200 pt-4">
                        <h3 class="text-sm font-semibold text-gray-900 mb-3">Invoice Items</h3>
                        <div class="space-y-2">
                            <div v-if="invoice.billing_model === 'subscription'">
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <div>
                                        <p class="font-medium text-gray-900">{{ invoice.plan_name }}</p>
                                        <p class="text-sm text-gray-500">Subscription</p>
                                    </div>
                                    <p class="font-medium text-gray-900">${{ parseFloat(invoice.subtotal).toFixed(2) }}</p>
                                </div>
                            </div>
                            <div v-if="invoice.billing_model === 'per_pool' && invoice.pools_snapshot">
                                <div v-for="(pool, index) in invoice.pools_snapshot" :key="index"
                                     class="flex justify-between py-2 border-b border-gray-100">
                                    <div>
                                        <p class="font-medium text-gray-900">{{ pool.pool_name }}</p>
                                        <p class="text-sm text-gray-500">{{ pool.customer_name }}</p>
                                    </div>
                                    <p class="font-medium text-gray-900">
                                        {{ pool.is_free ? 'Free' : '$' + pool.price.toFixed(2) }}
                                    </p>
                                </div>
                            </div>
                            <div v-if="invoice.billing_model === 'hybrid'">
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <div>
                                        <p class="font-medium text-gray-900">{{ invoice.plan_name }}</p>
                                        <p class="text-sm text-gray-500">Subscription</p>
                                    </div>
                                    <p class="font-medium text-gray-900">${{ parseFloat(invoice.subtotal).toFixed(2) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Totals -->
                    <div class="border-t border-gray-200 pt-4">
                        <div class="flex justify-end">
                            <div class="w-full md:w-64 space-y-2">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">Subtotal</span>
                                    <span class="font-medium">${{ parseFloat(invoice.subtotal).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">Tax</span>
                                    <span class="font-medium">${{ parseFloat(invoice.tax).toFixed(2) }}</span>
                                </div>
                                <div v-if="parseFloat(invoice.discount) > 0" class="flex justify-between text-sm">
                                    <span class="text-gray-600">Discount</span>
                                    <span class="font-medium text-green-600">-${{ parseFloat(invoice.discount).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span class="text-indigo-600">${{ parseFloat(invoice.total).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Info -->
                    <div v-if="invoice.status === 'paid'" class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-green-800">Paid on {{ formatDate(invoice.paid_at) }}</p>
                                <p class="text-xs text-green-600">Payment method: {{ invoice.payment_method }}</p>
                                <p v-if="invoice.transaction_id" class="text-xs text-green-600">Transaction: {{ invoice.transaction_id }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                        <button @click="downloadInvoice(invoice.id)" 
                                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            Download PDF
                        </button>
                        <button v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
                                @click="handlePayInvoice"
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                            Pay Now
                        </button>
                        <router-link to="/tenant/invoices" 
                                     class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                            Back to Invoices
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- Not Found -->
            <div v-else class="text-center py-16">
                <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Invoice not found</h3>
                <p class="mt-2 text-sm text-gray-500">The invoice you're looking for doesn't exist.</p>
                <router-link to="/tenant/invoices" 
                             class="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Back to Invoices
                </router-link>
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
                            <p class="text-2xl font-bold text-gray-900">${{ parseFloat(invoice?.total || 0).toFixed(2) }}</p>
                            <p class="text-xs text-gray-500">Invoice: {{ invoice?.invoice_number }}</p>
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBilling } from '@/composables/tenant/useBilling';

const route = useRoute();
const { 
    loading, 
    currentInvoice: invoice, 
    fetchInvoiceDetail, 
    payInvoice,
    downloadInvoice
} = useBilling();

const showPaymentModal = ref(false);
const paymentMethod = ref('stripe');
const processingPayment = ref(false);

// Company details (from config)
const companyName = import.meta.env.VITE_COMPANY_NAME || 'Your Company';
const companyAddress = import.meta.env.VITE_COMPANY_ADDRESS || '123 Business St, City, Country';

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const handlePayInvoice = () => {
    showPaymentModal.value = true;
};

const confirmPayment = async () => {
    if (!invoice.value) return;
    
    processingPayment.value = true;
    try {
        await payInvoice(invoice.value.id, {
            payment_method: paymentMethod.value
        });
        showPaymentModal.value = false;
        await fetchInvoiceDetail(route.params.id);
    } catch (error) {
        console.error('Payment failed:', error);
    } finally {
        processingPayment.value = false;
    }
};

onMounted(async () => {
    await fetchInvoiceDetail(route.params.id);
});
</script>