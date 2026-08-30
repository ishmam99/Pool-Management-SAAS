<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-7xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Subscription Plans</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage subscription plans and pricing</p>
                </div>
                <button @click="showCreateModal = true" 
                        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Create Plan
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div class="max-w-7xl mx-auto mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select v-model="filters.is_active" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                        <select v-model="filters.billing_cycle" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="">All</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input type="text" v-model="filters.search" 
                               @input="applyFilters"
                               placeholder="Search plans..." 
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select v-model="filters.sort_by" 
                                @change="applyFilters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="id">ID</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="created_at">Created Date</option>
                        </select>
                    </div>
                </div>
                <div class="mt-4 flex justify-end">
                    <button @click="resetFilters" 
                            class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading plans...</p>
            </div>
        </div>

        <!-- Plans Table -->
        <div v-else class="max-w-7xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limits</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribers</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            
                            <tr v-if="plans.length == 0">
                                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                                    No plans found.
                                </td>
                            </tr>
                            <tr v-for="plan in plans" :key="plan" v-else class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">{{ plan.name }}</p>
                                        <p class="text-xs text-gray-500" v-if="plan.description">{{ plan.description }}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p class="text-sm font-semibold text-gray-900">${{ parseFloat(plan.price).toFixed(2) }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                        {{ plan.billing_cycle }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-600">
                                        <div>Techs: {{ plan.max_techs || '∞' }}</div>
                                        <div>Customers: {{ plan.max_customers || '∞' }}</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="{
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                                        'bg-green-100 text-green-800': plan.is_active,
                                        'bg-gray-100 text-gray-800': !plan.is_active
                                    }">
                                        {{ plan.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {{ plan.active_subscriptions_count || 0 }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click="editPlan(plan)" 
                                                class="text-indigo-600 hover:text-indigo-900 transition-colors">
                                            Edit
                                        </button>
                                        <button @click="togglePlanStatus(plan)" 
                                                :class="plan.is_active ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'"
                                                class="transition-colors">
                                            {{ plan.is_active ? 'Deactivate' : 'Activate' }}
                                        </button>
                                        <button @click="deletePlan(plan)" 
                                                class="text-red-600 hover:text-red-900 transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                        Showing {{ (pagination.currentPage - 1) * pagination.perPage + 1 }} to 
                        {{ Math.min(pagination.currentPage * pagination.perPage, pagination.total) }} of 
                        {{ pagination.total }} plans
                    </div>
                    <div class="flex gap-2">
                        <button @click="prevPage" 
                                :disabled="pagination.currentPage <= 1"
                                class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Previous
                        </button>
                        <span class="px-3 py-1 text-sm text-gray-700">
                            Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
                        </span>
                        <button @click="nextPage" 
                                :disabled="pagination.currentPage >= pagination.lastPage"
                                class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Plan Modal -->
        <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">
                            {{ showEditModal ? 'Edit Plan' : 'Create New Plan' }}
                        </h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="savePlan" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                            <input type="text" v-model="form.name" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea v-model="form.description" rows="2"
                                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                <input type="number" v-model="form.price" step="0.01" min="0" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
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

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Max Techs</label>
                                <input type="number" v-model="form.max_techs" min="0"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Max Customers</label>
                                <input type="number" v-model="form.max_customers" min="0"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                            <textarea v-model="featuresText" rows="4"
                                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      placeholder="24/7 Support&#10;Advanced Analytics&#10;Priority Service"></textarea>
                        </div>

                        <div class="flex items-center">
                            <input type="checkbox" v-model="form.is_active" 
                                   class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                            <label class="ml-2 text-sm text-gray-600">Active</label>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="closeModal"
                                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" :disabled="saving"
                                    class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {{ saving ? 'Saving...' : 'Save Plan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { adminApi } from '@/api/admin/subscription.js';
import Swal from 'sweetalert2';

const loading = ref(false);
const saving = ref(false);
const plans = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingPlan = ref(null);

const pagination = reactive({
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1
});

const filters = reactive({
    is_active: '',
    billing_cycle: '',
    search: '',
    sort_by: 'id'
});

const form = reactive({
    name: '',
    description: '',
    price: 0,
    billing_cycle: 'monthly',
    max_techs: null,
    max_customers: null,
    features: [],
    is_active: true
});

const featuresText = ref('');

const fetchPlans = async () => {
    loading.value = true;
    try {
        const response = await adminApi.getPlans({
            page: pagination.currentPage,
            per_page: pagination.perPage,
            ...filters
        });
        plans.value = response.data.data.data;
        // console.log('Fetched plans:', plans.value);
        pagination.total = response.data.total || 0;
        pagination.lastPage = response.data.last_page || 1;
    } catch (error) {
        console.error('Failed to load plans:', error);
        Swal.fire('Error', 'Failed to load subscription plans', 'error');
    } finally {
        loading.value = false;
    }
};

const applyFilters = () => {
    pagination.currentPage = 1;
    fetchPlans();
};

const resetFilters = () => {
    filters.is_active = '';
    filters.billing_cycle = '';
    filters.search = '';
    filters.sort_by = 'id';
    applyFilters();
};

const nextPage = () => {
    if (pagination.currentPage < pagination.lastPage) {
        pagination.currentPage++;
        fetchPlans();
    }
};

const prevPage = () => {
    if (pagination.currentPage > 1) {
        pagination.currentPage--;
        fetchPlans();
    }
};

const editPlan = (plan) => {
    editingPlan.value = plan;
    form.name = plan.name;
    form.description = plan.description || '';
    form.price = parseFloat(plan.price);
    form.billing_cycle = plan.billing_cycle;
    form.max_techs = plan.max_techs;
    form.max_customers = plan.max_customers;
    form.is_active = plan.is_active;
    
    try {
        const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : (plan.features || []);
        featuresText.value = features.join('\n');
    } catch {
        featuresText.value = '';
    }
    
    showEditModal.value = true;
};

const closeModal = () => {
    showCreateModal.value = false;
    showEditModal.value = false;
    editingPlan.value = null;
    resetForm();
};

const resetForm = () => {
    form.name = '';
    form.description = '';
    form.price = 0;
    form.billing_cycle = 'monthly';
    form.max_techs = null;
    form.max_customers = null;
    form.is_active = true;
    featuresText.value = '';
};

const savePlan = async () => {
    saving.value = true;
    try {
        const data = {
            ...form,
            features: featuresText.value.split('\n').filter(f => f.trim())
        };
        
        let response;
        if (editingPlan.value) {
            response = await adminApi.updatePlan(editingPlan.value.id, data);
        } else {
            response = await adminApi.createPlan(data);
        }
        
        Swal.fire('Success', editingPlan.value ? 'Plan updated successfully' : 'Plan created successfully', 'success');
        closeModal();
        fetchPlans();
    } catch (error) {
        console.error('Failed to save plan:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to save plan', 'error');
    } finally {
        saving.value = false;
    }
};

const togglePlanStatus = async (plan) => {
    try {
        await adminApi.togglePlanStatus(plan.id);
        Swal.fire('Success', `Plan ${plan.is_active ? 'deactivated' : 'activated'} successfully`, 'success');
        fetchPlans();
    } catch (error) {
        console.error('Failed to toggle plan status:', error);
        Swal.fire('Error', 'Failed to toggle plan status', 'error');
    }
};

const deletePlan = async (plan) => {
    const result = await Swal.fire({
        title: 'Delete Plan',
        text: `Are you sure you want to delete "${plan.name}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
        try {
            await adminApi.deletePlan(plan.id);
            Swal.fire('Deleted!', 'Plan has been deleted.', 'success');
            fetchPlans();
        } catch (error) {
            console.error('Failed to delete plan:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to delete plan', 'error');
        }
    }
};

onMounted(() => {
    fetchPlans();
});
</script>