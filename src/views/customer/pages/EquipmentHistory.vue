<template>
    <div class="min-h-screen bg-gray-50 font-inter">

        <!-- ===== PAGE HEADER ===== -->
        <div class="relative overflow-hidden bg-white border-b border-gray-200">
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl"></div>
                <div class="absolute -bottom-10 left-10 w-60 h-60 rounded-full bg-violet-500/5 blur-3xl"></div>
            </div>
            <div class="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div class="flex items-center gap-3">
                    <button @click="goBack"
                        class="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all">
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div
                        class="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200">
                        <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Pool Equipment History
                        </h1>
                        <p class="text-sm text-gray-500 mt-0.5">View maintenance recommendations and complete service
                            history for this installed equipment.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

            <!-- ===== EQUIPMENT INFORMATION CARD ===== -->
            <div v-if="loadingHistory"
                class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div class="h-5 bg-gray-200 rounded-lg w-56"></div>
                </div>
                <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="i in 6" :key="i" class="space-y-2">
                        <div class="h-3 bg-gray-200 rounded w-20"></div>
                        <div class="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="equipment" class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
               
                <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Component Name</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.component_name || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Component Type</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.component_type || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Manufacturer</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.manufacturer || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Equipment Model</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.equipment_model || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Serial Number</p>
                        <p class="text-sm font-mono font-semibold text-gray-900">{{ equipment?.serial_number || '—' }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pool Name</p>
                        <p class="text-sm font-semibold text-gray-900">{{ equipment?.pool_name || '—' }}</p>
                    </div>
                    <div>
                                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Customer
                                </p>
                                <p class="text-sm font-bold text-gray-900">
                                    {{ customer }}
                                </p>
                            </div>

                  
                </div>
            </div>

            <!-- ===== CUSTOMER NAME ===== -->


            <!-- ===== TABS ===== -->
            <div class="flex items-center gap-3 border-b border-gray-200">
                <button @click="activeTab = 'recommendations'"
                    class="relative px-5 py-3 text-sm font-semibold transition-all"
                    :class="activeTab === 'recommendations' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'">
                    <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Maintenance Recommendations
                        <span
                            class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700">{{
                            recommendations.length }}</span>
                    </span>
                    <span v-if="activeTab === 'recommendations'"
                        class="absolute left-0 right-0 -bottom-px h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></span>
                </button>
                <button @click="activeTab = 'history'" class="relative px-5 py-3 text-sm font-semibold transition-all"
                    :class="activeTab === 'history' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'">
                    <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Service History
                        <span
                            class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700">{{
                            serviceHistory.length }}</span>
                    </span>
                    <span v-if="activeTab === 'history'"
                        class="absolute left-0 right-0 -bottom-px h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></span>
                </button>
            </div>

            <!-- ===== TAB 1: MAINTENANCE RECOMMENDATIONS ===== -->
            <div v-if="activeTab === 'recommendations'">

                <!-- Loading Skeleton -->
                <div v-if="loadingRecommendations"
                    class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
                    <div class="bg-gray-50 px-5 py-4 border-b border-gray-200">
                        <div class="h-5 bg-gray-200 rounded-lg w-56"></div>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="i in 3" :key="i" class="px-5 py-4">
                            <div class="h-4 bg-gray-200 rounded-lg w-full"></div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="recommendations.length === 0"
                    class="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div class="relative mb-6">
                        <div class="absolute inset-0 rounded-full bg-cyan-100/30 blur-2xl scale-150"></div>
                        <div
                            class="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200">
                            <svg class="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">No Recommendations</h3>
                    <p class="text-sm text-gray-500 text-center max-w-xs">No maintenance recommendations found.</p>
                </div>

                <!-- Table -->
                <div v-else class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <div
                        class="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-base font-bold text-gray-900">Maintenance Recommendations</h3>
                        <span class="text-sm font-semibold text-gray-600">{{ recommendations.length }} item{{
                            recommendations.length !== 1 ? 's' : '' }}</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-gray-50 border-b border-gray-200">
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Title</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Recommendation Type</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Priority</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Estimated Cost</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Status</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Recommended By</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Created Date</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                                        Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(rec, idx) in recommendations" :key="rec?.id || idx"
                                    :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
                                    class="hover:bg-cyan-50/40 transition-colors">
                                    <td class="px-4 py-3 border-r border-gray-100 font-semibold text-gray-900">{{
                                        rec?.title || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">{{
                                        rec?.recommendation_type || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 whitespace-nowrap">
                                        <span :class="getPriorityBadgeClass(rec?.priority)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {{ formatLabel(rec?.priority) }}
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-r border-gray-100 font-semibold text-gray-900 whitespace-nowrap">
                                        {{ formatCurrency(rec?.estimated_cost) }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 whitespace-nowrap">
                                        <span :class="getStatusBadgeClass(rec?.status)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {{ formatLabel(rec?.status) }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">{{
                                        rec?.recommended_by?.name || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">{{
                                        formatDate(rec?.created_at) }}</td>
                                                                <td class="px-4 py-4 whitespace-nowrap">
                                <button v-if="rec.status?.toLowerCase() === 'pending'"
                                    @click="acceptRecommendation(rec)"
                                    :disabled="loadingAccept"
                                    class="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-4 rounded-md text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                                    {{ loadingAccept && currentAcceptId === rec.id ? 'Accepting...' : 'Accept' }}
                                </button>
                                <span v-else-if="rec.status?.toLowerCase() === 'accepted'"
                                    class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Accepted
                                </span>
                                <span v-else
                                    class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600">
                                    {{ formatLabel(rec.status) }}
                                </span>
                            </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ===== TAB 2: SERVICE HISTORY ===== -->
            <div v-if="activeTab === 'history'">

                <!-- Loading Skeleton -->
                <div v-if="loadingHistory"
                    class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
                    <div class="bg-gray-50 px-5 py-4 border-b border-gray-200">
                        <div class="h-5 bg-gray-200 rounded-lg w-56"></div>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="i in 3" :key="i" class="px-5 py-4">
                            <div class="h-4 bg-gray-200 rounded-lg w-full"></div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="serviceHistory.length === 0"
                    class="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div class="relative mb-6">
                        <div class="absolute inset-0 rounded-full bg-cyan-100/30 blur-2xl scale-150"></div>
                        <div
                            class="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200">
                            <svg class="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">No History</h3>
                    <p class="text-sm text-gray-500 text-center max-w-xs">No service history available.</p>
                </div>

                <!-- Table -->
                <div v-else class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <div
                        class="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-base font-bold text-gray-900">Service History</h3>
                        <span class="text-sm font-semibold text-gray-600">{{ serviceHistory.length }} record{{
                            serviceHistory.length !== 1 ? 's' : '' }}</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-gray-50 border-b border-gray-200">
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Work Order ID</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Service Type</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Issue Type</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Technician</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Status</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider border-r border-gray-100">
                                        Visit Date & Time</th>
                                    <th
                                        class="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                                        Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(item, idx) in serviceHistory" :key="item?.work_order_id || idx"
                                    :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
                                    class="hover:bg-cyan-50/40 transition-colors">
                                    <td
                                        class="px-4 py-3 border-r border-gray-100 font-mono font-semibold text-gray-900 whitespace-nowrap">
                                        {{ item?.work_order_id || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">{{
                                        item?.type || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">{{
                                        item?.pivot?.issue_type || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">{{
                                        item?.technician || '—' }}</td>
                                    <td class="px-4 py-3 border-r border-gray-100 whitespace-nowrap">
                                        <span :class="getStatusBadgeClass(item?.pivot?.status)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {{ formatLabel(item?.pivot?.status) }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">
                                        <div class="flex flex-col gap-0.5">
                                            <span>{{ formatDate(item?.scheduled_visit?.scheduled_date) }} </span>
                                            <span>{{ formatTimeWindow(item?.scheduled_visit?.time_window_start,
                                                item?.scheduled_visit?.time_window_end) }}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap">
                                        <button @click="handlePerformService(item?.work_order_id)"
                                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-sm shadow-cyan-500/20 transition-all hover:-translate-y-0.5">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                                            </svg>
                                            Perform Service
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>



    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../services/api.js'

// ===== STATE =====
const route = useRoute()
const router = useRouter()
const poolEquipmentId = ref(route.params.id)

const recommendations = ref([])
const serviceHistory = ref([])
const equipment = ref(null)
const customer = ref(null)

const loadingRecommendations = ref(false)
const loadingHistory = ref(false)

const activeTab = ref('recommendations')

const deletingRecId = ref(null)
const updatingRec = ref(false)

// Edit Recommendation Modal
const editRecommendationModal = ref(false)
const editRecFormError = ref('')
const editRecForm = ref({
    id: null,
    title: '',
    description: '',
    recommendation_type: '',
    priority: '',
    estimated_cost: '',
})

// ===== COMPUTED =====
const customerInitials = computed(() => {
    if (!customer.value) return '—'
    return customer.value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0]?.toUpperCase())
        .join('')
})

// ===== API =====

// 1. Load maintenance recommendations
async function fetchRecommendations() {
    if (!poolEquipmentId.value) return
    loadingRecommendations.value = true
    try {
        const response = await api().get('/tenant/equipment-recommendations', {
            params: { pool_equipment_id: poolEquipmentId.value }
        })
        // Fix: response.data.data.data is the recommendations array
        const data = response.data
        recommendations.value = data?.data?.data || []

        // Fix: Get customer name from first recommendation
        if (recommendations.value.length) {
            customer.value = recommendations.value[0]?.customer?.contact_name ?? ''
        }
    } catch (error) {
        console.error('Failed to load maintenance recommendations:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to load maintenance recommendations',
            confirmButtonColor: '#0891b2'
        })
    } finally {
        loadingRecommendations.value = false
    }
}

// 2. Load service history
async function fetchServiceHistory() {
    if (!poolEquipmentId.value) return
    loadingHistory.value = true
    try {
        const response = await api().get(`/tenant/pool-equipments/${poolEquipmentId.value}/history`)
        // Fix: response.data.data contains the data
        const data = response.data?.data || {}
        serviceHistory.value = data?.service_history || []
        equipment.value = data?.equipment || {}
    } catch (error) {
        console.error('Failed to load service history:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to load service history',
            confirmButtonColor: '#0891b2'
        })
    } finally {
        loadingHistory.value = false
    }
}

// 3. Update recommendation via POST /tenant/equipment-recommendations/{id} with _method=PUT
async function updateRecommendation() {
    editRecFormError.value = ''

    if (!editRecForm.value.title || !editRecForm.value.recommendation_type || !editRecForm.value.priority) {
        editRecFormError.value = 'Title, Recommendation Type, and Priority are required.'
        return
    }

    updatingRec.value = true
    try {
        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('title', editRecForm.value.title)
        formData.append('description', editRecForm.value.description || '')
        formData.append('recommendation_type', editRecForm.value.recommendation_type)
        formData.append('priority', editRecForm.value.priority)
        formData.append('estimated_cost', editRecForm.value.estimated_cost || '')

        const response = await api().post(`/tenant/equipment-recommendations/${editRecForm.value.id}`, formData)
        const data = response.data

        Swal.fire({
            icon: 'success',
            title: 'Updated',
            text: data.message || 'Recommendation updated successfully',
            background: '#ffffff',
            color: '#1f2937',
            iconColor: '#22d3ee',
            confirmButtonColor: '#0891b2',
            timer: 2000,
            showConfirmButton: false
        })

        closeEditRecommendationModal()
        await fetchRecommendations()

    } catch (error) {
        console.error('Failed to update recommendation:', error)
        editRecFormError.value = error.response?.data?.message || 'Failed to update recommendation'
    } finally {
        updatingRec.value = false
    }
}

// 4. Delete recommendation via DELETE /tenant/equipment-recommendations/{id}
async function handleDeleteRecommendation(id) {
    if (!id) return

    const result = await Swal.fire({
        title: 'Delete Recommendation?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        background: '#ffffff',
        color: '#1f2937',
        iconColor: '#f43f5e',
        confirmButtonColor: '#f43f5e',
        cancelButtonColor: '#9ca3af',
    })

    if (!result.isConfirmed) return

    deletingRecId.value = id
    try {
        const response = await api().delete(`/tenant/equipment-recommendations/${id}`)
        const data = response.data

        Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: data.message || 'Recommendation deleted successfully',
            background: '#ffffff',
            color: '#1f2937',
            iconColor: '#22d3ee',
            confirmButtonColor: '#0891b2',
            timer: 2000,
            showConfirmButton: false
        })

        await fetchRecommendations()

    } catch (error) {
        console.error('Failed to delete recommendation:', error)
        Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: error.response?.data?.message || 'Failed to delete recommendation',
            background: '#ffffff',
            color: '#1f2937',
            confirmButtonColor: '#0891b2'
        })
    } finally {
        deletingRecId.value = null
    }
}

// ===== NAVIGATION =====
function handlePerformService(workOrderId) {
    if (!workOrderId) return
    router.push(`/customer/service-reports/${workOrderId}`)
}

function goBack() {
    router.back()
}

// ===== MODAL HANDLERS =====
function openEditRecommendationModal(rec) {
    if (!rec) return
    editRecFormError.value = ''
    editRecForm.value = {
        id: rec.id,
        title: rec.title || '',
        description: rec.description || '',
        recommendation_type: rec.recommendation_type || '',
        priority: rec.priority || '',
        estimated_cost: rec.estimated_cost || '',
    }
    editRecommendationModal.value = true
}

function closeEditRecommendationModal() {
    if (updatingRec.value) return
    editRecommendationModal.value = false
    editRecFormError.value = ''
    editRecForm.value = {
        id: null,
        title: '',
        description: '',
        recommendation_type: '',
        priority: '',
        estimated_cost: '',
    }
}

// ===== HELPERS =====
function getStatusBadgeClass(status) {
    const map = {
        'active': 'bg-green-100 text-green-700 border border-green-200',
        'completed': 'bg-green-100 text-green-700 border border-green-200',
        'pending': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        'in_progress': 'bg-blue-100 text-blue-700 border border-blue-200',
        'scheduled': 'bg-blue-100 text-blue-700 border border-blue-200',
        'cancelled': 'bg-red-100 text-red-700 border border-red-200',
        'dismissed': 'bg-gray-100 text-gray-600 border border-gray-200',
    }
    return map[status] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

function getPriorityBadgeClass(priority) {
    const map = {
        'low': 'bg-gray-100 text-gray-600 border border-gray-200',
        'medium': 'bg-blue-100 text-blue-700 border border-blue-200',
        'high': 'bg-amber-100 text-amber-700 border border-amber-200',
        'urgent': 'bg-red-100 text-red-700 border border-red-200',
    }
    return map[priority] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

function formatLabel(value) {
    if (!value) return '—'
    return value
        .toString()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const formatTimeWindow = (start, end) => {
    const formatTime = (value) => {
        if (!value) return ''
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return value
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }

    const startLabel = formatTime(start)
    const endLabel = formatTime(end)

    if (!startLabel && !endLabel) return ''
    if (startLabel && endLabel) return `${startLabel} – ${endLabel}`
    return startLabel || endLabel
}



function formatDate(date) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === '') return '—'
    return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

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

// ===== LIFECYCLE =====
onMounted(async () => {
    if (!poolEquipmentId.value) {
        console.warn('No pool_equipment_id found in route params')
        return
    }

    await Promise.all([
        fetchRecommendations(),
        fetchServiceHistory()
    ])
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.font-inter {
    font-family: 'Inter', sans-serif;
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
    transform: scale(0.95) translateY(8px);
}
</style>