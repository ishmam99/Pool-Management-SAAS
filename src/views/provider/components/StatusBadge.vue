<template>
    <span :class="{
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
        'bg-green-100 text-green-800': status === 'paid' || status === 'active',
        'bg-amber-100 text-amber-800': status === 'pending' || status === 'grace_period',
        'bg-red-100 text-red-800': status === 'overdue' || status === 'failed' || status === 'suspended',
        'bg-gray-100 text-gray-800': status === 'cancelled' || status === 'expired',
        'bg-blue-100 text-blue-800': status === 'trialing'
    }">
        {{ displayText }}
    </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: {
        type: String,
        required: true
    }
});

const displayText = computed(() => {
    const labels = {
        'paid': 'Paid',
        'pending': 'Pending',
        'overdue': 'Overdue',
        'cancelled': 'Cancelled',
        'failed': 'Failed',
        'active': 'Active',
        'trialing': 'Trialing',
        'grace_period': 'Grace Period',
        'suspended': 'Suspended',
        'expired': 'Expired'
    };
    return labels[props.status] || props.status.charAt(0).toUpperCase() + props.status.slice(1);
});
</script>