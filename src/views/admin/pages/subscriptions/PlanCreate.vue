<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div class="max-w-4xl mx-auto">
            <!-- Page Header -->
            <div class="mb-8">
                <div class="flex items-center gap-3">
                    <router-link to="/admin/subscription/plans" 
                                 class="text-gray-500 hover:text-gray-700 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                    </router-link>
                    <div>
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Create Subscription Plan</h1>
                        <p class="text-sm text-gray-500 mt-1">Create a new subscription plan for tenants</p>
                    </div>
                </div>
            </div>

            <!-- Form -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form @submit.prevent="savePlan" class="space-y-6">
                    <!-- Plan Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                        <input type="text" v-model="form.name" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                               placeholder="e.g., Premium Plan">
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea v-model="form.description" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="Describe the plan features and benefits..."></textarea>
                    </div>

                    <!-- Price & Billing Cycle -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                            <div class="relative">
                                <span class="absolute left-3 top-2 text-gray-500">$</span>
                                <input type="number" v-model="form.price" step="0.01" min="0" required
                                       class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                       placeholder="0.00">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Billing Cycle *</label>
                            <select v-model="form.billing_cycle" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    <!-- Limits -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Max Techs</label>
                            <input type="number" v-model="form.max_techs" min="0"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                   placeholder="Leave empty for unlimited">
                            <p class="text-xs text-gray-400 mt-1">Maximum number of technicians allowed</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Max Customers</label>
                            <input type="number" v-model="form.max_customers" min="0"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                   placeholder="Leave empty for unlimited">
                            <p class="text-xs text-gray-400 mt-1">Maximum number of customers allowed</p>
                        </div>
                    </div>

                    <!-- Features -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Features</label>
                        <div class="space-y-2">
                            <div v-for="(feature, index) in featureList" :key="index" class="flex gap-2">
                                <input type="text" v-model="featureList[index]" 
                                       class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                       placeholder="Enter a feature...">
                                <button type="button" @click="removeFeature(index)" 
                                        class="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </div>
                            <button type="button" @click="addFeature" 
                                    class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                Add Feature
                            </button>
                        </div>
                    </div>

                    <!-- Sort Order -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                        <input type="number" v-model="form.sort_order" min="0"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                               placeholder="0">
                        <p class="text-xs text-gray-400 mt-1">Lower numbers appear first in listings</p>
                    </div>

                    <!-- Active Status -->
                    <div class="flex items-center">
                        <input type="checkbox" v-model="form.is_active" 
                               class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                        <label class="ml-2 text-sm text-gray-600">Active (Available for subscription)</label>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex gap-3 pt-4 border-t border-gray-200">
                        <router-link to="/admin/subscription/plans" 
                                     class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition-colors">
                            Cancel
                        </router-link>
                        <button type="submit" :disabled="saving"
                                class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ saving ? 'Creating...' : 'Create Plan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { adminApi } from '@/api/admin/subscription.js';
import Swal from 'sweetalert2';

const router = useRouter();
const saving = ref(false);

const form = reactive({
    name: '',
    description: '',
    price: 0,
    billing_cycle: 'monthly',
    max_techs: null,
    max_customers: null,
    features: [],
    sort_order: 0,
    is_active: true
});

const featureList = ref(['']);

const addFeature = () => {
    featureList.value.push('');
};

const removeFeature = (index) => {
    if (featureList.value.length > 1) {
        featureList.value.splice(index, 1);
    }
};

const savePlan = async () => {
    saving.value = true;
    try {
        // Filter out empty features
        const features = featureList.value.filter(f => f.trim() !== '');
        
        const data = {
            ...form,
            features: features.length > 0 ? features : null
        };
        
        await adminApi.createPlan(data);
        Swal.fire('Success', 'Plan created successfully', 'success');
        router.push('/admin/subscription/plans');
    } catch (error) {
        console.error('Failed to create plan:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to create plan', 'error');
    } finally {
        saving.value = false;
    }
};
</script>