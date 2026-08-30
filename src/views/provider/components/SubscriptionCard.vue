<template>
    <div :class="[
        'bg-white rounded-xl border p-6 transition-shadow hover:shadow-md',
        statusClass
    ]">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                    <div :class="[
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        iconBgClass
                    ]">
                        <svg class="w-6 h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>
                <div>
                    <div class="flex items-center gap-3 flex-wrap">
                        <h3 class="text-lg font-semibold text-gray-900">{{ subscription.plan?.name }}</h3>
                        <StatusBadge :status="subscription.status" />
                    </div>
                    <p class="text-sm text-gray-500 mt-1">Billing cycle: {{ subscription.plan?.billing_cycle }}</p>
                    <div class="mt-2 flex flex-wrap gap-4 text-sm">
                        <div>
                            <span class="text-gray-500">Started:</span>
                            <span class="font-medium text-gray-700">{{ formatDate(subscription.current_period_start) }}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">Next billing:</span>
                            <span class="font-medium text-gray-700">{{ formatDate(subscription.current_period_end) }}</span>
                        </div>
                        <div v-if="subscription.auto_renew !== undefined">
                            <span class="text-gray-500">Auto-renew:</span>
                            <span :class="subscription.auto_renew ? 'text-green-600' : 'text-red-600'">
                                {{ subscription.auto_renew ? 'Enabled' : 'Disabled' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                <slot name="actions"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';

const props = defineProps({
    subscription: {
        type: Object,
        required: true
    }
});

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const statusClass = computed(() => {
    const classes = {
        'active': 'border-green-200',
        'trialing': 'border-blue-200',
        'grace_period': 'border-amber-200',
        'suspended': 'border-red-200',
        'cancelled': 'border-gray-200'
    };
    return classes[props.subscription.status] || 'border-gray-200';
});

const iconBgClass = computed(() => {
    const classes = {
        'active': 'bg-green-100',
        'trialing': 'bg-blue-100',
        'grace_period': 'bg-amber-100',
        'suspended': 'bg-red-100',
        'cancelled': 'bg-gray-100'
    };
    return classes[props.subscription.status] || 'bg-gray-100';
});

const iconColorClass = computed(() => {
    const classes = {
        'active': 'text-green-600',
        'trialing': 'text-blue-600',
        'grace_period': 'text-amber-600',
        'suspended': 'text-red-600',
        'cancelled': 'text-gray-600'
    };
    return classes[props.subscription.status] || 'text-gray-600';
});
</script>