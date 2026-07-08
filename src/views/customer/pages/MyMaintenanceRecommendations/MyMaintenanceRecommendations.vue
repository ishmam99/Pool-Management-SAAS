<template>
    <div class="maintenance-recommendations-page bg-white min-h-screen m-10">
        <!-- Page Header -->
        <div class="page-header mb-6">
            <h1 class="text-2xl font-bold text-gray-800">
                My Maintenance Recommendations
            </h1>
            <p class="text-gray-600 mt-1">
                Review and accept maintenance recommendations for your pool equipment.
            </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading && !loaded" class="space-y-4">
            <div v-for="n in 5" :key="n" class="animate-pulse">
                <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div class="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="grid grid-cols-4 gap-4 mt-4">
                        <div class="h-4 bg-gray-200 rounded"></div>
                        <div class="h-4 bg-gray-200 rounded"></div>
                        <div class="h-4 bg-gray-200 rounded"></div>
                        <div class="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="recommendations.length === 0" class="text-center py-16">
            <div class="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto border border-gray-200">
                <div class="flex justify-center mb-4">
                    <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">
                    No Recommendations
                </h3>
                <p class="text-gray-600">
                    There are currently no maintenance recommendations.
                </p>
            </div>
        </div>

        <!-- Recommendations Table -->
        <div v-else class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                Recommendation
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                Pool
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                Equipment
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                Type
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                Priority
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                Est. Cost
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                Status
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                Recommended By
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                Created
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(recommendation, index) in recommendations" :key="recommendation.id" 
                            :class="{'bg-gray-50': index % 2 === 0}">
                            <td class="px-4 py-4 border-r border-gray-200">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ recommendation.title || 'Untitled' }}
                                </div>
                                <div class="text-sm text-gray-600 line-clamp-2">
                                    {{ recommendation.description || '' }}
                                </div>
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                                {{ recommendation.pool?.label || 'N/A' }}
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                                {{ recommendation.pool_equipment?.component?.name || 'N/A' }}
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                                {{ formatLabel(recommendation.recommendation_type) }}
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                <span :class="getPriorityBadgeClass(recommendation.priority)">
                                    {{ formatLabel(recommendation.priority) }}
                                </span>
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                                {{ recommendation.estimated_cost ? formatCurrency(recommendation.estimated_cost) : 'N/A' }}
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                <span :class="getStatusBadgeClass(recommendation.status)">
                                    {{ formatLabel(recommendation.status) }}
                                </span>
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                                {{ recommendation.recommended_by?.name || 'N/A' }}
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                                {{ formatDate(recommendation.created_at) }}
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap">
                                <button v-if="recommendation.status?.toLowerCase() === 'pending'"
                                    @click="acceptRecommendation(recommendation)"
                                    :disabled="loadingAccept"
                                    class="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-4 rounded-md text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                                    {{ loadingAccept && currentAcceptId === recommendation.id ? 'Accepting...' : 'Accept' }}
                                </button>
                                <span v-else-if="recommendation.status?.toLowerCase() === 'accepted'"
                                    class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Accepted
                                </span>
                                <span v-else
                                    class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600">
                                    {{ formatLabel(recommendation.status) }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="pagination" class="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="text-sm text-gray-600">
                        Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0 }} recommendations
                    </div>
                    <div class="flex space-x-2">
                        <button @click="changePage(pagination.current_page - 1)"
                            :disabled="pagination.current_page <= 1 || loading"
                            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                            Previous
                        </button>
                        <span class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                            {{ pagination.current_page }}
                        </span>
                        <button @click="changePage(pagination.current_page + 1)"
                            :disabled="pagination.current_page >= pagination.last_page || loading"
                            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../store/AuthStore.js';

const authStore = useAuthStore();
const loading = ref(false);
const loaded = ref(false);
const loadingAccept = ref(false);
const currentAcceptId = ref(null);
const recommendations = ref([]);
const pagination = ref(null);

// Get customer ID based on auth type
const customerId = computed(() => {
    return authStore.authType === 'provider'
        ? authStore.customerId
        : authStore.user?.id;
});

// Helper Functions
const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return 'N/A';
    }
};

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (e) {
        return `$${amount}`;
    }
};

const formatLabel = (str) => {
    if (!str) return 'N/A';
    try {
        return str
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    } catch (e) {
        return str || 'N/A';
    }
};

// Load recommendations
const loadRecommendations = async (page = 1) => {
    try {
        loading.value = true;
        
        const response = await api().get('/tenant/equipment-recommendations', {
            params: {
                customer_id: customerId.value,
                page: page
            }
        });

        const data = response.data?.data?.data || [];
        recommendations.value = data;
        pagination.value = response.data?.data || null;
        
        loaded.value = true;
    } catch (error) {
        console.error('Error loading recommendations:', error);
        await Swal.fire({
            title: 'Error!',
            text: 'Failed to load recommendations. Please try again.',
            icon: 'error',
            confirmButtonColor: '#2563eb',
        });
    } finally {
        loading.value = false;
    }
};

// Change page
const changePage = (page) => {
    if (page < 1 || page > pagination.value?.last_page) return;
    loadRecommendations(page);
};

// Accept recommendation
const acceptRecommendation = async (recommendation) => {
    const result = await Swal.fire({
        title: 'Accept Recommendation?',
        text: 'This recommendation will be marked as accepted.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Accept',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    loadingAccept.value = true;
    currentAcceptId.value = recommendation.id;

    try {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('status', 'accepted');

        await api().post(`/tenant/equipment-recommendations/${recommendation.id}`, formData);

        await Swal.fire({
            title: 'Accepted!',
            text: 'The recommendation has been successfully accepted.',
            icon: 'success',
            confirmButtonColor: '#2563eb',
            timer: 3000,
            timerProgressBar: true,
        });

        // Reload recommendations
        await loadRecommendations(pagination.value?.current_page || 1);
    } catch (error) {
        console.error('Error accepting recommendation:', error);
        await Swal.fire({
            title: 'Error!',
            text: 'Failed to accept the recommendation. Please try again.',
            icon: 'error',
            confirmButtonColor: '#2563eb',
        });
    } finally {
        loadingAccept.value = false;
        currentAcceptId.value = null;
    }
};

// Priority badge classes
const getPriorityBadgeClass = (priority) => {
    const normalized = priority?.toLowerCase() || '';
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    const classes = {
        'urgent': `${base} bg-red-100 text-red-800`,
        'high': `${base} bg-orange-100 text-orange-800`,
        'medium': `${base} bg-yellow-100 text-yellow-800`,
        'low': `${base} bg-green-100 text-green-800`,
    };
    
    return classes[normalized] || `${base} bg-gray-100 text-gray-800`;
};

// Status badge classes
const getStatusBadgeClass = (status) => {
    const normalized = status?.toLowerCase() || '';
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    const classes = {
        'pending': `${base} bg-yellow-100 text-yellow-800`,
        'accepted': `${base} bg-green-100 text-green-800`,
        'rejected': `${base} bg-red-100 text-red-800`,
        'completed': `${base} bg-blue-100 text-blue-800`,
    };
    
    return classes[normalized] || `${base} bg-gray-100 text-gray-800`;
};

onMounted(() => {
    loadRecommendations();
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
    height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>