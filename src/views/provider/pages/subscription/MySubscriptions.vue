<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-7xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">My Subscriptions</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage your active and past subscriptions</p>
                </div>
                <router-link to="/tenant/subscription-plans" 
                             class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    New Subscription
                </router-link>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading subscriptions...</p>
            </div>
        </div>

        <!-- Subscriptions List -->
        <div v-else class="max-w-7xl mx-auto space-y-4">
            <!-- Active Subscription -->
            <div v-if="currentSubscription" class="bg-white rounded-xl shadow-sm border border-green-200 p-6">
                <div class="flex items-start justify-between">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-3">
                                <h3 class="text-lg font-semibold text-gray-900">{{ currentSubscription.plan?.name }}</h3>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            <p class="text-sm text-gray-500 mt-1">Billing cycle: {{ currentSubscription.plan?.billing_cycle }}</p>
                            <div class="mt-2 flex flex-wrap gap-4 text-sm">
                                <div>
                                    <span class="text-gray-500">Started:</span>
                                    <span class="font-medium text-gray-700">{{ formatDate(currentSubscription.current_period_start) }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-500">Next billing:</span>
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
                    <div class="flex gap-2">
                        <button @click="handleUpgrade" 
                                class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                            Upgrade
                        </button>
                        <button @click="handleCancel" 
                                class="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Past Subscriptions -->
            <div v-if="pastSubscriptions.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Past Subscriptions</h3>
                <div class="space-y-3">
                    <div v-for="subscription in pastSubscriptions" :key="subscription.id" 
                         class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium text-gray-900">{{ subscription.plan?.name }}</p>
                            <p class="text-sm text-gray-500">
                                {{ formatDate(subscription.current_period_start) }} - {{ formatDate(subscription.current_period_end) }}
                            </p>
                        </div>
                        <span :class="{
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                            'bg-red-100 text-red-800': subscription.status === 'cancelled',
                            'bg-gray-100 text-gray-800': subscription.status === 'expired',
                            'bg-amber-100 text-amber-800': subscription.status === 'suspended'
                        }">
                            {{ subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!currentSubscription && pastSubscriptions.length === 0" class="text-center py-16">
                <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">No subscriptions</h3>
                <p class="mt-2 text-sm text-gray-500">Get started by subscribing to a plan</p>
                <router-link to="/tenant/subscription-plans" 
                             class="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    View Plans
                </router-link>
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
import { useRouter } from 'vue-router';
import { useSubscription } from '@/composables/tenant/useSubscription';

const router = useRouter();
const {
    loading,
    mySubscriptions,
    currentSubscription,
    fetchMySubscriptions,
    cancelSubscription
} = useSubscription();

const showCancelModal = ref(false);
const cancelReason = ref('');
const processingCancel = ref(false);

const pastSubscriptions = computed(() => {
    return mySubscriptions.value.filter(sub => 
        !['active', 'trialing', 'grace_period'].includes(sub.status)
    );
});

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const handleUpgrade = () => {
    router.push('/tenant/subscription-plans');
};

const handleCancel = () => {
    showCancelModal.value = true;
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
    await fetchMySubscriptions();
});
</script>