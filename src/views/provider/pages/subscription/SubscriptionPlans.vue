<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-7xl mx-auto mb-8">
            <div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Subscription Plans</h1>
                <p class="text-sm text-gray-500 mt-1">Choose the perfect plan for your business needs</p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading available plans...</p>
            </div>
        </div>

        <!-- Plans Grid -->
        <div v-else class="max-w-7xl mx-auto">
            <!-- Toggle between Monthly/Yearly -->
            <div class="flex justify-center mb-8">
                <div class="bg-white rounded-lg p-1 border border-gray-200 inline-flex">
                    <button 
                        @click="billingCycle = 'monthly'" 
                        :class="[
                            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                            billingCycle === 'monthly' 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-gray-700 hover:text-gray-900'
                        ]">
                        Monthly
                    </button>
                    <button 
                        @click="billingCycle = 'yearly'" 
                        :class="[
                            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                            billingCycle === 'yearly' 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-gray-700 hover:text-gray-900'
                        ]">
                        Yearly
                        <span class="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Save 20%</span>
                    </button>
                </div>
            </div>

            <!-- Plans Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="plan in filteredPlans" :key="plan.id" 
                     :class="[
                         'bg-white rounded-2xl shadow-sm border transition-all hover:shadow-lg',
                         isCurrentPlan(plan.id) ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50' : 'border-gray-200',
                         plan.price === highestPrice ? 'relative' : ''
                     ]">
                    <!-- Popular Badge -->
                    <div v-if="plan.price === highestPrice" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
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
                            <li v-for="feature in getFeatures(plan)" :key="feature" 
                                class="flex items-start text-sm text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                {{ feature }}
                            </li>
                        </ul>

                        <!-- Limits -->
                        <div class="mt-4 pt-4 border-t border-gray-100">
                            <div class="flex items-center justify-between text-sm" v-if="plan.max_techs !== null">
                                <span class="text-gray-500">Max Techs</span>
                                <span class="font-medium text-gray-900">{{ plan.max_techs || 'Unlimited' }}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm mt-1" v-if="plan.max_customers !== null">
                                <span class="text-gray-500">Max Customers</span>
                                <span class="font-medium text-gray-900">{{ plan.max_customers || 'Unlimited' }}</span>
                            </div>
                        </div>

                        <!-- Action Button -->
                        <button 
                            @click="handlePlanSelect(plan)"
                            :disabled="isCurrentPlan(plan.id) && !canUpgrade"
                            :class="[
                                'w-full mt-6 px-4 py-2.5 rounded-lg font-medium transition-colors',
                                isCurrentPlan(plan.id)
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            ]">
                            {{ isCurrentPlan(plan.id) ? 'Current Plan' : 'Select Plan' }}
                        </button>

                        <!-- Current Plan Badge -->
                        <div v-if="isCurrentPlan(plan.id)" class="mt-2 text-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active Subscription
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Current Subscription Info -->
            <div v-if="currentSubscription" class="mt-8">
                <div :class="[
                    'rounded-xl border p-6',
                    subscriptionStatusClass
                ]">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0">
                                <div :class="[
                                    'w-12 h-12 rounded-lg flex items-center justify-center',
                                    subscriptionStatusIconClass
                                ]">
                                    <svg class="w-6 h-6" :class="subscriptionStatusIconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">Current Subscription</h3>
                                <p class="text-sm text-gray-600">
                                    You are currently on the <strong>{{ currentSubscription.plan?.name }}</strong> plan.
                                    {{ subscriptionStatusText }}
                                </p>
                                <div class="mt-2 flex flex-wrap gap-4 text-sm">
                                    <div>
                                        <span class="text-gray-500">Started:</span>
                                        <span class="font-medium text-gray-700">{{ formatDate(currentSubscription.current_period_start) }}</span>
                                    </div>
                                    <div>
                                        <span class="text-gray-500">Ends:</span>
                                        <span class="font-medium text-gray-700">{{ formatDate(currentSubscription.current_period_end) }}</span>
                                    </div>
                                    <div v-if="currentSubscription.auto_renew !== undefined">
                                        <span class="text-gray-500">Auto-renew:</span>
                                        <span :class="currentSubscription.auto_renew ? 'text-green-600' : 'text-red-600'">
                                            {{ currentSubscription.auto_renew ? 'Enabled' : 'Disabled' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <button 
                                v-if="canUpgrade" 
                                @click="showUpgradeModal = true"
                                class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                Upgrade Plan
                            </button>
                            <button 
                                v-if="['active', 'trialing'].includes(currentSubscription.status)"
                                @click="showCancelModal = true"
                                class="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                                Cancel
                            </button>
                            <button 
                                v-if="currentSubscription.status === 'cancelled'"
                                @click="handleRenew"
                                class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                                Renew
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Upgrade Modal -->
        <div v-if="showUpgradeModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showUpgradeModal = false">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Upgrade Plan</h3>
                        <button @click="showUpgradeModal = false" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <p class="text-sm text-gray-600">Select a plan to upgrade to:</p>
                        <div class="space-y-2">
                            <div v-for="plan in upgradeablePlans" :key="plan.id"
                                 @click="selectedUpgradePlan = plan"
                                 :class="[
                                     'border rounded-lg p-4 cursor-pointer transition-colors',
                                     selectedUpgradePlan?.id === plan.id 
                                         ? 'border-indigo-500 bg-indigo-50' 
                                         : 'border-gray-200 hover:border-indigo-200'
                                 ]">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <p class="font-medium text-gray-900">{{ plan.name }}</p>
                                        <p class="text-sm text-gray-500">${{ plan.price }}/{{ plan.billing_cycle === 'yearly' ? 'year' : 'month' }}</p>
                                    </div>
                                    <div v-if="plan.price > currentPlanPrice" class="text-green-600 text-sm font-medium">
                                        +${{ (plan.price - currentPlanPrice).toFixed(2) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button @click="confirmUpgrade" :disabled="!selectedUpgradePlan || processingUpgrade"
                                class="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            {{ processingUpgrade ? 'Upgrading...' : 'Confirm Upgrade' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cancel Modal -->
        <div v-if="showCancelModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showCancelModal = false">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
                        <button @click="showCancelModal = false" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <p class="text-sm text-gray-600">Are you sure you want to cancel your subscription?</p>
                        <p class="text-sm text-gray-500">You will lose access to premium features at the end of your billing period.</p>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation (optional)</label>
                            <textarea v-model="cancelReason" rows="3" 
                                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      placeholder="Tell us why you're cancelling..."></textarea>
                        </div>

                        <div class="flex gap-3">
                            <button @click="showCancelModal = false"
                                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Keep Subscription
                            </button>
                            <button @click="confirmCancel" :disabled="processingCancel"
                                    class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                {{ processingCancel ? 'Cancelling...' : 'Cancel Subscription' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSubscription } from '@/composables/tenant/useSubscription';

const {
    loading,
    plans,
    currentSubscription,
    fetchPlans,
    fetchMySubscriptions,
    subscribe,
    cancelSubscription,
    renewSubscription,
    upgradeSubscription
} = useSubscription();

const billingCycle = ref('monthly');
const showUpgradeModal = ref(false);
const showCancelModal = ref(false);
const selectedUpgradePlan = ref(null);
const cancelReason = ref('');
const processingUpgrade = ref(false);
const processingCancel = ref(false);

const filteredPlans = computed(() => {
    return plans.value
        .filter(plan => plan.is_active !== false)
        .filter(plan => plan.billing_cycle === billingCycle.value)
        .sort((a, b) => a.price - b.price);
});

const highestPrice = computed(() => {
    if (filteredPlans.value.length === 0) return 0;
    return Math.max(...filteredPlans.value.map(p => p.price));
});

const currentPlanPrice = computed(() => {
    return currentSubscription.value?.plan?.price || 0;
});

const upgradeablePlans = computed(() => {
    return filteredPlans.value.filter(plan => 
        plan.price > currentPlanPrice && plan.id !== currentSubscription.value?.subscription_plan_id
    );
});

const subscriptionStatusText = computed(() => {
    if (!currentSubscription.value) return '';
    const statuses = {
        active: 'Your subscription is active and will renew automatically.',
        trialing: 'Your subscription is in trial period.',
        grace_period: 'Your subscription is in grace period.',
        suspended: 'Your subscription is suspended.',
        cancelled: 'Your subscription has been cancelled.'
    };
    return statuses[currentSubscription.value.status] || '';
});

const subscriptionStatusClass = computed(() => {
    if (!currentSubscription.value) return 'border-gray-200';
    const classes = {
        active: 'border-green-200 bg-green-50',
        trialing: 'border-blue-200 bg-blue-50',
        grace_period: 'border-amber-200 bg-amber-50',
        suspended: 'border-red-200 bg-red-50',
        cancelled: 'border-gray-200 bg-gray-50'
    };
    return classes[currentSubscription.value.status] || 'border-gray-200';
});

const subscriptionStatusIconClass = computed(() => {
    if (!currentSubscription.value) return 'bg-gray-100';
    const classes = {
        active: 'bg-green-100',
        trialing: 'bg-blue-100',
        grace_period: 'bg-amber-100',
        suspended: 'bg-red-100',
        cancelled: 'bg-gray-100'
    };
    return classes[currentSubscription.value.status] || 'bg-gray-100';
});

const subscriptionStatusIconColor = computed(() => {
    if (!currentSubscription.value) return 'text-gray-600';
    const classes = {
        active: 'text-green-600',
        trialing: 'text-blue-600',
        grace_period: 'text-amber-600',
        suspended: 'text-red-600',
        cancelled: 'text-gray-600'
    };
    return classes[currentSubscription.value.status] || 'text-gray-600';
});

const isCurrentPlan = (planId) => {
    return currentSubscription.value?.subscription_plan_id === planId;
};

const getFeatures = (plan) => {
    if (!plan.features) return ['No features listed'];
    try {
        if (typeof plan.features === 'string') {
            return JSON.parse(plan.features);
        }
        return plan.features;
    } catch {
        return ['No features listed'];
    }
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const handlePlanSelect = async (plan) => {
    if (isCurrentPlan(plan.id)) return;
    
    try {
        await subscribe(plan.id);
        await fetchMySubscriptions();
    } catch (error) {
        console.error('Subscription failed:', error);
    }
};

const handleRenew = async () => {
    if (!currentSubscription.value) return;
    await renewSubscription(currentSubscription.value.id);
};

const confirmUpgrade = async () => {
    if (!selectedUpgradePlan.value || !currentSubscription.value) return;
    
    processingUpgrade.value = true;
    try {
        await upgradeSubscription(currentSubscription.value.id, selectedUpgradePlan.value.id);
        showUpgradeModal.value = false;
        selectedUpgradePlan.value = null;
        await fetchMySubscriptions();
    } catch (error) {
        console.error('Upgrade failed:', error);
    } finally {
        processingUpgrade.value = false;
    }
};

const confirmCancel = async () => {
    if (!currentSubscription.value) return;
    
    processingCancel.value = true;
    try {
        await cancelSubscription(currentSubscription.value.id, cancelReason.value);
        showCancelModal.value = false;
        cancelReason.value = '';
        await fetchMySubscriptions();
    } catch (error) {
        console.error('Cancellation failed:', error);
    } finally {
        processingCancel.value = false;
    }
};

onMounted(async () => {
    await Promise.all([
        fetchPlans(),
        fetchMySubscriptions()
    ]);
});
</script>