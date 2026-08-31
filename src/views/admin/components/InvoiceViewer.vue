<template>
    <div v-if="invoice" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
        <div class="flex items-center justify-center min-h-screen px-4 py-8">
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
            
            <!-- Invoice Container -->
            <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                <!-- Close Button -->
                <button @click="closeModal" 
                        class="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>

                <!-- Invoice Content -->
                <div class="p-8 md:p-12">
                    <!-- Header -->
                    <div class="flex flex-col md:flex-row md:justify-between md:items-start border-b border-gray-200 pb-6 mb-6">
                        <!-- Company Logo & Info -->
                        <div class="flex items-start gap-4">
                            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                {{ companyInitials }}
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">{{ companyName }}</h2>
                                <p class="text-sm text-gray-500">{{ companyAddress }}</p>
                                <p class="text-sm text-gray-500">{{ companyPhone }}</p>
                                <p class="text-sm text-gray-500">{{ companyEmail }}</p>
                            </div>
                        </div>
                        
                        <!-- Invoice Title & Status -->
                        <div class="mt-4 md:mt-0 text-right">
                            <h1 class="text-3xl font-bold text-gray-900">INVOICE</h1>
                            <p class="text-sm text-gray-500 mt-1">#{{ invoice.invoice_number }}</p>
                            <div class="mt-2">
                                <span :class="{
                                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium': true,
                                    'bg-green-100 text-green-800': invoice.status === 'paid',
                                    'bg-amber-100 text-amber-800': invoice.status === 'pending',
                                    'bg-red-100 text-red-800': invoice.status === 'overdue',
                                    'bg-gray-100 text-gray-800': invoice.status === 'cancelled',
                                    'bg-purple-100 text-purple-800': invoice.status === 'failed'
                                }">
                                    <span class="w-2 h-2 rounded-full mr-2" :class="{
                                        'bg-green-500': invoice.status === 'paid',
                                        'bg-amber-500': invoice.status === 'pending',
                                        'bg-red-500': invoice.status === 'overdue',
                                        'bg-gray-500': invoice.status === 'cancelled',
                                        'bg-purple-500': invoice.status === 'failed'
                                    }"></span>
                                    {{ invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Bill To & Invoice Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Bill To -->
                        <div class="bg-gray-50 rounded-xl p-4">
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                            <h3 class="text-lg font-semibold text-gray-900">{{ invoice.tenant?.company_name || invoice.tenant?.name || 'N/A' }}</h3>
                            <p class="text-sm text-gray-600">{{ invoice.tenant?.email || 'N/A' }}</p>
                            <p class="text-sm text-gray-600">{{ invoice.tenant?.phone || 'N/A' }}</p>
                            <p v-if="invoice.tenant?.business_license" class="text-sm text-gray-500 mt-1">
                                License: {{ invoice.tenant.business_license }}
                            </p>
                        </div>

                        <!-- Invoice Details -->
                        <div class="bg-gray-50 rounded-xl p-4">
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Invoice Date</p>
                                    <p class="text-sm font-medium text-gray-900">{{ formatDate(invoice.created_at) }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Due Date</p>
                                    <p class="text-sm font-medium text-gray-900">{{ formatDate(invoice.due_date) }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Billing Period</p>
                                    <p class="text-sm font-medium text-gray-900">{{ invoice.billing_period }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Billing Model</p>
                                    <p class="text-sm font-medium text-gray-900 capitalize">{{ invoice.billing_model?.replace('_', ' ') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Invoice Items Table -->
                    <div class="mb-6">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b-2 border-gray-200">
                                    <th class="text-left py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                                    <th class="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quantity</th>
                                    <th class="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Unit Price</th>
                                    <th class="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Subscription Items -->
                                <template v-if="invoice.billing_model === 'subscription'">
                                    <tr class="border-b border-gray-100">
                                        <td class="py-3">
                                            <p class="font-medium text-gray-900">{{ invoice.plan_name || 'Subscription Plan' }}</p>
                                            <p class="text-xs text-gray-500">Monthly subscription fee</p>
                                        </td>
                                        <td class="text-right py-3 text-gray-600">1</td>
                                        <td class="text-right py-3 text-gray-600">${{ parseFloat(invoice.subtotal).toFixed(2) }}</td>
                                        <td class="text-right py-3 font-medium text-gray-900">${{ parseFloat(invoice.subtotal).toFixed(2) }}</td>
                                    </tr>
                                </template>

                                <!-- Per Pool Items -->
                                <template v-if="invoice.billing_model === 'per_pool' && invoice.pools_snapshot">
                                    <tr v-for="(pool, index) in invoice.pools_snapshot" :key="index" class="border-b border-gray-100">
                                        <td class="py-3">
                                            <p class="font-medium text-gray-900">{{ pool.pool_name }}</p>
                                            <p class="text-xs text-gray-500">Customer: {{ pool.customer_name }}</p>
                                            <span v-if="pool.is_free" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                                Free
                                            </span>
                                        </td>
                                        <td class="text-right py-3 text-gray-600">1</td>
                                        <td class="text-right py-3 text-gray-600">${{ parseFloat(pool.price).toFixed(2) }}</td>
                                        <td class="text-right py-3 font-medium text-gray-900">
                                            {{ pool.is_free ? '$0.00' : '$' + parseFloat(pool.price).toFixed(2) }}
                                        </td>
                                    </tr>
                                    <!-- Pool Summary -->
                                    <tr class="bg-gray-50">
                                        <td colspan="3" class="py-3 text-right font-medium text-gray-600">
                                            Total Pools: {{ invoice.total_active_pools }} ({{ invoice.billable_pools }} billable)
                                        </td>
                                        <td class="text-right py-3 font-medium text-gray-900">
                                            ${{ (parseFloat(invoice.per_pool_price) * invoice.billable_pools).toFixed(2) }}
                                        </td>
                                    </tr>
                                </template>

                                <!-- Hybrid Items -->
                                <template v-if="invoice.billing_model === 'hybrid'">
                                    <tr class="border-b border-gray-100">
                                        <td class="py-3">
                                            <p class="font-medium text-gray-900">{{ invoice.plan_name || 'Subscription Plan' }}</p>
                                            <p class="text-xs text-gray-500">Base subscription</p>
                                        </td>
                                        <td class="text-right py-3 text-gray-600">1</td>
                                        <td class="text-right py-3 text-gray-600">${{ parseFloat(invoice.subtotal).toFixed(2) }}</td>
                                        <td class="text-right py-3 font-medium text-gray-900">${{ parseFloat(invoice.subtotal).toFixed(2) }}</td>
                                    </tr>
                                    <tr v-for="(pool, index) in invoice.pools_snapshot" :key="index" class="border-b border-gray-100">
                                        <td class="py-3 pl-6">
                                            <p class="font-medium text-gray-900">{{ pool.pool_name }}</p>
                                            <p class="text-xs text-gray-500">Customer: {{ pool.customer_name }}</p>
                                        </td>
                                        <td class="text-right py-3 text-gray-600">1</td>
                                        <td class="text-right py-3 text-gray-600">${{ parseFloat(pool.price).toFixed(2) }}</td>
                                        <td class="text-right py-3 font-medium text-gray-900">${{ parseFloat(pool.price).toFixed(2) }}</td>
                                    </tr>
                                </template>

                                <!-- No Items -->
                                <template v-if="!invoice.pools_snapshot && invoice.billing_model !== 'subscription'">
                                    <tr>
                                        <td colspan="4" class="py-6 text-center text-gray-500">No items to display</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>

                    <!-- Totals -->
                    <div class="border-t-2 border-gray-200 pt-4">
                        <div class="flex justify-end">
                            <div class="w-full md:w-80 space-y-2">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">Subtotal</span>
                                    <span class="font-medium text-gray-900">${{ parseFloat(invoice.subtotal).toFixed(2) }}</span>
                                </div>
                                <div v-if="parseFloat(invoice.tax) > 0" class="flex justify-between text-sm">
                                    <span class="text-gray-600">Tax ({{ taxRate }}%)</span>
                                    <span class="font-medium text-gray-900">${{ parseFloat(invoice.tax).toFixed(2) }}</span>
                                </div>
                                <div v-if="parseFloat(invoice.discount) > 0" class="flex justify-between text-sm">
                                    <span class="text-gray-600">Discount</span>
                                    <span class="font-medium text-green-600">-${{ parseFloat(invoice.discount).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between pt-2 border-t-2 border-gray-200">
                                    <span class="text-base font-bold text-gray-900">Total</span>
                                    <span class="text-xl font-bold text-indigo-600">${{ parseFloat(invoice.total).toFixed(2) }}</span>
                                </div>
                                <p class="text-xs text-gray-400 text-right">Amount in USD</p>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Information -->
                    <div v-if="invoice.status === 'paid'" class="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-green-800">Payment Confirmed</p>
                                <p class="text-xs text-green-600">
                                    Paid on {{ formatDate(invoice.paid_at) }} 
                                    <span v-if="invoice.payment_method">via {{ invoice.payment_method }}</span>
                                </p>
                                <p v-if="invoice.transaction_id" class="text-xs text-green-600">
                                    Transaction: {{ invoice.transaction_id }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="invoice.status === 'pending' || invoice.status === 'overdue'" class="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-amber-800">
                                    {{ invoice.status === 'overdue' ? 'Payment Overdue' : 'Awaiting Payment' }}
                                </p>
                                <p class="text-xs text-amber-600">
                                    Due date: {{ formatDate(invoice.due_date) }}
                                    <span v-if="isOverdue" class="font-semibold"> ({{ daysOverdue }} days overdue)</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Notes -->
                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                            <div>
                                <p class="font-semibold text-gray-700">Payment Terms</p>
                                <p>Please pay within {{ paymentTerms }} days of invoice date</p>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-700">Payment Methods</p>
                                <p>Bank Transfer • Credit Card • PayPal</p>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-700">Questions?</p>
                                <p>{{ companyEmail }} • {{ companyPhone }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                        <button @click="$emit('download', invoice.id)" 
                                class="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            Download PDF
                        </button>
                        
                        <button v-if="invoice.status !== 'paid'" 
                                @click="$emit('pay', invoice)"
                                class="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                            </svg>
                            Pay Now
                        </button>

                        <button v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
                                @click="$emit('remind', invoice)"
                                class="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                            </svg>
                            Send Reminder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    invoice: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close', 'download', 'pay', 'remind']);

// Company Details (Should come from config)
const companyName = import.meta.env.VITE_COMPANY_NAME || 'PoolCare Solutions';
const companyAddress = import.meta.env.VITE_COMPANY_ADDRESS || '123 Business Avenue, Suite 100, Miami, FL 33101';
const companyPhone = import.meta.env.VITE_COMPANY_PHONE || '+1 (305) 555-0123';
const companyEmail = import.meta.env.VITE_COMPANY_EMAIL || 'billing@poolcare.com';
const taxRate = import.meta.env.VITE_TAX_RATE || 0;
const paymentTerms = import.meta.env.VITE_PAYMENT_TERMS || 15;

const companyInitials = computed(() => {
    return companyName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
});

const isOverdue = computed(() => {
    if (!props.invoice) return false;
    return props.invoice.status === 'overdue' || 
           (props.invoice.status === 'pending' && new Date(props.invoice.due_date) < new Date());
});

const daysOverdue = computed(() => {
    if (!isOverdue.value || !props.invoice?.due_date) return 0;
    const diff = new Date() - new Date(props.invoice.due_date);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

const closeModal = () => {
    emit('close');
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
</script>

<style scoped>
/* Optional: Print styles */
@media print {
    .fixed {
        position: static !important;
    }
    .backdrop-blur-sm {
        backdrop-filter: none !important;
    }
    .bg-gray-900 {
        background: none !important;
    }
    .shadow-2xl {
        box-shadow: none !important;
    }
}
</style>