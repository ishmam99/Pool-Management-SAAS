<template>
    <div :class="[
        'bg-white rounded-2xl shadow-sm border transition-all hover:shadow-lg',
        isCurrent ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50' : 'border-gray-200',
        isPopular ? 'relative' : ''
    ]">
        <!-- Popular Badge -->
        <div v-if="isPopular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full">Most Popular</span>
        </div>

        <div class="p-6">
            <!-- Plan Name -->
            <h3 class="text-lg font-semibold text-gray-900">{{ plan.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ plan.description || 'Perfect for your needs' }}</p>

            <!-- Price -->
            <div class="mt-4">
                <span class="text-3xl font-bold text-gray-900">${{ plan.price }}</span>
                <span class="text-sm text-gray-500 ml-1">/ {{ plan.billing_cycle === 'yearly' ? 'year' : 'month' }}</span>
            </div>

            <!-- Features -->
            <ul class="mt-6 space-y-3">
                <li v-for="feature in features" :key="feature" 
                    class="flex items-start text-sm text-gray-600">
                    <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ feature }}
                </li>
            </ul>

            <!-- Limits -->
            <div class="mt-4 pt-4 border-t border-gray-100">
                <div v-if="plan.max_techs !== null" class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Max Techs</span>
                    <span class="font-medium text-gray-900">{{ plan.max_techs || 'Unlimited' }}</span>
                </div>
                <div v-if="plan.max_customers !== null" class="flex items-center justify-between text-sm mt-1">
                    <span class="text-gray-500">Max Customers</span>
                    <span class="font-medium text-gray-900">{{ plan.max_customers || 'Unlimited' }}</span>
                </div>
            </div>

            <!-- Action Button -->
            <button 
                @click="$emit('select', plan)"
                :disabled="isCurrent"
                :class="[
                    'w-full mt-6 px-4 py-2.5 rounded-lg font-medium transition-colors',
                    isCurrent
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                ]">
                {{ isCurrent ? 'Current Plan' : 'Select Plan' }}
            </button>

            <!-- Current Plan Badge -->
            <div v-if="isCurrent" class="mt-2 text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active Subscription
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    plan: {
        type: Object,
        required: true
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
    isPopular: {
        type: Boolean,
        default: false
    }
});

defineEmits(['select']);

const features = computed(() => {
    if (!props.plan.features) return ['No features listed'];
    try {
        if (typeof props.plan.features === 'string') {
            return JSON.parse(props.plan.features);
        }
        return props.plan.features;
    } catch {
        return ['No features listed'];
    }
});
</script>