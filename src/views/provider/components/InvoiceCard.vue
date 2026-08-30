<template>
    <div @click="$emit('view', invoice)" 
         class="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-gray-50 cursor-pointer transition-all">
        <div class="flex items-center gap-4">
            <div class="flex-shrink-0">
                <div :class="{
                    'w-10 h-10 rounded-lg flex items-center justify-center': true,
                    'bg-green-100': invoice.status === 'paid',
                    'bg-amber-100': invoice.status === 'pending',
                    'bg-red-100': invoice.status === 'overdue',
                    'bg-gray-100': invoice.status === 'cancelled',
                    'bg-purple-100': invoice.status === 'failed'
                }">
                    <svg class="w-5 h-5" :class="{
                        'text-green-600': invoice.status === 'paid',
                        'text-amber-600': invoice.status === 'pending',
                        'text-red-600': invoice.status === 'overdue',
                        'text-gray-600': invoice.status === 'cancelled',
                        'text-purple-600': invoice.status === 'failed'
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
                <p v-if="invoice.plan_name" class="text-xs text-gray-400">{{ invoice.plan_name }}</p>
            </div>
        </div>
        <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">${{ parseFloat(invoice.total).toFixed(2) }}</p>
            <StatusBadge :status="invoice.status" />
        </div>
    </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';

defineProps({
    invoice: {
        type: Object,
        required: true
    }
});

defineEmits(['view']);
</script>