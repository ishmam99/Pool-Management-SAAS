<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <!-- Card: Current Plan -->
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
                    <p class="text-lg font-semibold text-gray-900">{{ planName || 'No Active Plan' }}</p>
                    <p class="text-xs text-gray-400 mt-1" v-if="billingCycle">
                        {{ billingCycle === 'yearly' ? 'Annual' : 'Monthly' }} Billing
                    </p>
                </div>
            </div>
        </div>

        <!-- Card: Next Billing -->
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

        <!-- Card: Pending Amount -->
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
                    <p class="text-xs text-gray-400 mt-1">{{ pendingCount }} invoice(s) pending</p>
                </div>
            </div>
        </div>

        <!-- Card: Total Invoices -->
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
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    planName: {
        type: String,
        default: null
    },
    billingCycle: {
        type: String,
        default: null
    },
    nextBillingDate: {
        type: String,
        default: null
    },
    daysUntilBilling: {
        type: Number,
        default: null
    },
    pendingAmount: {
        type: Number,
        default: 0
    },
    pendingCount: {
        type: Number,
        default: 0
    },
    totalInvoices: {
        type: Number,
        default: 0
    }
});
</script>