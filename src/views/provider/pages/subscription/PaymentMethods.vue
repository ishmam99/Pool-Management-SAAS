<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-4xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Payment Methods</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage your payment methods for subscriptions</p>
                </div>
                <button @click="showAddModal = true" 
                        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Payment Method
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-4xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading payment methods...</p>
            </div>
        </div>

        <!-- Payment Methods -->
        <div v-else class="max-w-4xl mx-auto space-y-6">
            <!-- Credit/Debit Cards -->
            <div v-if="cardMethods.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Cards</h3>
                <div class="space-y-3">
                    <div v-for="method in cardMethods" :key="method.id" 
                         class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                                <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                                    <line x1="2" y1="11" x2="22" y2="11"/>
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">
                                    {{ method.card_type || 'Card' }} ending in {{ method.last_four }}
                                </p>
                                <p class="text-sm text-gray-500">Expires {{ method.expiry_month }}/{{ method.expiry_year }}</p>
                            </div>
                            <span v-if="method.is_default" 
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Default
                            </span>
                        </div>
                        <div class="flex gap-2">
                            <button v-if="!method.is_default" 
                                    @click="setDefault(method.id)"
                                    class="text-sm text-indigo-600 hover:text-indigo-900 transition-colors">
                                Set Default
                            </button>
                            <button @click="removeMethod(method.id)" 
                                    class="text-sm text-red-600 hover:text-red-900 transition-colors">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bank Accounts -->
            <div v-if="bankMethods.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Bank Accounts</h3>
                <div class="space-y-3">
                    <div v-for="method in bankMethods" :key="method.id" 
                         class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="2" y="6" width="20" height="12" rx="2" ry="2"/>
                                    <line x1="2" y1="10" x2="22" y2="10"/>
                                    <line x1="6" y1="14" x2="18" y2="14"/>
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ method.bank_name }}</p>
                                <p class="text-sm text-gray-500">Account ending in {{ method.last_four }}</p>
                            </div>
                            <span v-if="method.is_default" 
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Default
                            </span>
                        </div>
                        <div class="flex gap-2">
                            <button v-if="!method.is_default" 
                                    @click="setDefault(method.id)"
                                    class="text-sm text-indigo-600 hover:text-indigo-900 transition-colors">
                                Set Default
                            </button>
                            <button @click="removeMethod(method.id)" 
                                    class="text-sm text-red-600 hover:text-red-900 transition-colors">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="paymentMethods.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                    <line x1="2" y1="11" x2="22" y2="11"/>
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">No payment methods</h3>
                <p class="mt-2 text-sm text-gray-500">Add a payment method to manage your subscriptions</p>
                <button @click="showAddModal = true" 
                        class="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Add Payment Method
                </button>
            </div>
        </div>

        <!-- Add Payment Method Modal -->
        <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showAddModal = false">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Add Payment Method</h3>
                        <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="handleAddPaymentMethod" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                            <select v-model="newPaymentMethod.type" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="card">Credit/Debit Card</option>
                                <option value="bank">Bank Account</option>
                            </select>
                        </div>

                        <div v-if="newPaymentMethod.type === 'card'">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <input type="text" v-model="newPaymentMethod.card_number" 
                                       placeholder="4242 4242 4242 4242"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                                    <input type="text" v-model="newPaymentMethod.expiry" 
                                           placeholder="MM/YY"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                    <input type="text" v-model="newPaymentMethod.cvc" 
                                           placeholder="123"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                                <input type="text" v-model="newPaymentMethod.cardholder_name" 
                                       placeholder="John Doe"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                        </div>

                        <div v-if="newPaymentMethod.type === 'bank'">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                <input type="text" v-model="newPaymentMethod.bank_name" 
                                       placeholder="Chase Bank"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                <input type="text" v-model="newPaymentMethod.account_number" 
                                       placeholder="1234567890"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                                <input type="text" v-model="newPaymentMethod.routing_number" 
                                       placeholder="021000021"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                        </div>

                        <div class="flex items-center">
                            <input type="checkbox" v-model="newPaymentMethod.set_as_default" 
                                   class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                            <label class="ml-2 text-sm text-gray-600">Set as default payment method</label>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="showAddModal = false"
                                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" :disabled="processingAdd"
                                    class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                {{ processingAdd ? 'Adding...' : 'Add Payment Method' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePaymentMethods } from '@/composables/tenant/usePaymentMethods';

const {
    loading,
    paymentMethods,
    cardMethods,
    bankMethods,
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod
} = usePaymentMethods();

const showAddModal = ref(false);
const processingAdd = ref(false);

const newPaymentMethod = ref({
    type: 'card',
    card_number: '',
    expiry: '',
    cvc: '',
    cardholder_name: '',
    bank_name: '',
    account_number: '',
    routing_number: '',
    set_as_default: true
});

const handleAddPaymentMethod = async () => {
    processingAdd.value = true;
    try {
        await addPaymentMethod(newPaymentMethod.value);
        showAddModal.value = false;
        // Reset form
        newPaymentMethod.value = {
            type: 'card',
            card_number: '',
            expiry: '',
            cvc: '',
            cardholder_name: '',
            bank_name: '',
            account_number: '',
            routing_number: '',
            set_as_default: true
        };
    } catch (error) {
        console.error('Failed to add payment method:', error);
    } finally {
        processingAdd.value = false;
    }
};

const setDefault = async (methodId) => {
    try {
        await setDefaultPaymentMethod(methodId);
    } catch (error) {
        console.error('Failed to set default:', error);
    }
};

const removeMethod = async (methodId) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return;
    
    try {
        await removePaymentMethod(methodId);
    } catch (error) {
        console.error('Failed to remove payment method:', error);
    }
};

onMounted(async () => {
    await fetchPaymentMethods();
});
</script>