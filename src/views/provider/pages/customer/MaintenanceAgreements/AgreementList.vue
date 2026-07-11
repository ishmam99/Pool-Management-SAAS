<template>
    <div class="p-6">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-800">Maintenance Agreements</h1>
                <p class="text-gray-600 mt-1">View and manage all one-time maintenance agreements.</p>
            </div>
            <button
                @click="createAgreement"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition flex items-center gap-2 whitespace-nowrap"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Create Maintenance Agreement
            </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                        v-model="filters.search"
                        type="text"
                        placeholder="Search by title..."
                        :disabled="loading"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <select
                        v-model="filters.customer_id"
                        :disabled="loading"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                    >
                        <option value="">All Customers</option>
                        <option v-for="customer in uniqueCustomers" :key="customer.id" :value="customer.id">
                            {{ customer.contact_name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        v-model="filters.status"
                        :disabled="loading"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <input
                        type="date"
                        :disabled="loading"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                        placeholder="Optional"
                    />
                </div>
                <div class="flex items-end">
                    <button
                        @click="resetFilters"
                        :disabled="loading"
                        class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="overflow-x-auto">
                <table class="table table-zebra w-full">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Phone</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Order</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Address</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Loading Skeletons -->
                        <template v-if="loading">
                            <tr v-for="n in 5" :key="'skeleton-' + n">
                                <td v-for="col in 15" :key="col" class="px-4 py-3">
                                    <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                            </tr>
                        </template>

                        <!-- Data Rows -->
                        <template v-else>
                            <tr v-for="agreement in filteredAgreements" :key="agreement.id" class="hover:bg-gray-50">
                                <td class="px-4 py-3 text-sm font-medium text-gray-900">#{{ agreement.id }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.title || '-' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.customer?.contact_name || '-' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.customer?.phone || '-' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.customer?.email || '-' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">#{{ agreement.work_order?.id || '-' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.work_order?.pool?.label || '-' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.work_order?.pool?.service_address || '-' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.work_order?.technician?.name || '-' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700 font-medium">${{ (agreement.price || 0) }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(agreement.scheduled_date) }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.warranty_period || '-' }}</td>
                                <td class="px-4 py-3">
                                    <span :class="getStatusBadgeClass(agreement.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                                        {{ formatStatus(agreement.status) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(agreement.created_at) }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2">
                                        <button
                                            @click="viewAgreement(agreement)"
                                            class="text-blue-600 hover:text-blue-800 transition"
                                            title="View"
                                            :disabled="loading"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            @click="openEditModal(agreement)"
                                            class="text-yellow-600 hover:text-yellow-800 transition"
                                            title="Edit"
                                            :disabled="loading"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>

                        <!-- Empty State -->
                        <tr v-if="!loading && filteredAgreements.length === 0">
                            <td colspan="15" class="px-4 py-12 text-center">
                                <div class="flex flex-col items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p class="text-gray-500 text-lg font-medium">No Maintenance Agreements Found</p>
                                    <p class="text-gray-400 text-sm mt-1">Try adjusting your filters or create a new agreement.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-sm text-gray-700">
                    Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
                </div>
                <div class="flex items-center gap-2">
                    <button
                        @click="prevPage"
                        :disabled="pagination.current_page === 1 || loading"
                        class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span class="text-sm text-gray-700">
                        Page {{ pagination.current_page }} of {{ pagination.last_page }}
                    </span>
                    <button
                        @click="nextPage"
                        :disabled="pagination.current_page === pagination.last_page || loading"
                        class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- View Agreement Modal -->
    <dialog id="viewAgreementModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 class="font-bold text-2xl mb-6 text-gray-800">Agreement Details</h3>
            
            <div v-if="selectedAgreement" class="space-y-6">
                <!-- Agreement Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-semibold text-lg text-gray-700 mb-3">Agreement</h4>
                        <div class="space-y-2">
                            <p><span class="font-medium text-gray-600">Title:</span> {{ selectedAgreement.title || '-' }}</p>
                            <p><span class="font-medium text-gray-600">Price:</span> ${{ (selectedAgreement.price || 0).toFixed(2) }}</p>
                            <p><span class="font-medium text-gray-600">Status:</span> 
                                <span :class="getStatusBadgeClass(selectedAgreement.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                                    {{ formatStatus(selectedAgreement.status) }}
                                </span>
                            </p>
                            <p><span class="font-medium text-gray-600">Scheduled Date:</span> {{ formatDate(selectedAgreement.scheduled_date) }}</p>
                            <p><span class="font-medium text-gray-600">Start Time:</span> {{ formatTime(selectedAgreement.start_time) }}</p>
                            <p><span class="font-medium text-gray-600">End Time:</span> {{ formatTime(selectedAgreement.end_time) }}</p>
                            <p><span class="font-medium text-gray-600">Warranty:</span> {{ selectedAgreement.warranty_period || '-' }}</p>
                            <p><span class="font-medium text-gray-600">Notes:</span> {{ selectedAgreement.notes || '-' }}</p>
                        </div>
                    </div>

                    <!-- Customer Info -->
                    <div>
                        <h4 class="font-semibold text-lg text-gray-700 mb-3">Customer</h4>
                        <div class="space-y-2">
                            <p><span class="font-medium text-gray-600">Name:</span> {{ selectedAgreement.customer?.contact_name || '-' }}</p>
                            <p><span class="font-medium text-gray-600">Phone:</span> {{ selectedAgreement.customer?.phone || '-' }}</p>
                            <p><span class="font-medium text-gray-600">Email:</span> {{ selectedAgreement.customer?.email || '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Work Order & Pool -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-semibold text-lg text-gray-700 mb-3">Work Order</h4>
                        <div class="space-y-2">
                            <p><span class="font-medium text-gray-600">ID:</span> #{{ selectedAgreement.work_order?.id || '-' }}</p>
                            <p><span class="font-medium text-gray-600">Type:</span> {{ selectedAgreement.work_order?.type || '-' }}</p>
                            <p><span class="font-medium text-gray-600">Status:</span> {{ selectedAgreement.work_order?.status || '-' }}</p>
                        </div>
                    </div>

                    <div>
                        <h4 class="font-semibold text-lg text-gray-700 mb-3">Pool</h4>
                        <div class="space-y-2">
                            <p><span class="font-medium text-gray-600">Label:</span> {{ selectedAgreement.work_order?.pool?.label || '-' }}</p>
                            <p><span class="font-medium text-gray-600">Service Address:</span> {{ selectedAgreement.work_order?.pool?.service_address || '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Technician -->
                <div>
                    <h4 class="font-semibold text-lg text-gray-700 mb-3">Technician</h4>
                    <div class="space-y-2">
                        <p><span class="font-medium text-gray-600">Name:</span> {{ selectedAgreement.work_order?.technician?.name || '-' }}</p>
                        <p><span class="font-medium text-gray-600">Phone:</span> {{ selectedAgreement.work_order?.technician?.phone || '-' }}</p>
                    </div>
                </div>

                <!-- Service Includes -->
                <div>
                    <h4 class="font-semibold text-lg text-gray-700 mb-3">Service Includes</h4>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="(item, index) in selectedAgreement.service_includes" :key="index" 
                              class="badge badge-primary badge-lg px-4 py-2">
                            {{ item }}
                        </span>
                        <span v-if="!selectedAgreement.service_includes?.length" class="text-gray-500 text-sm">
                            No service items included
                        </span>
                    </div>
                </div>

                <!-- Agreement Terms -->
                <div>
                    <h4 class="font-semibold text-lg text-gray-700 mb-3">Agreement Terms</h4>
                    <ul class="list-disc pl-6 space-y-1">
                        <li v-for="(term, index) in getTerms(selectedAgreement.term_template?.content)" :key="index" 
                            class="text-gray-700">
                            {{ term }}
                        </li>
                        <li v-if="!selectedAgreement.term_template?.content" class="text-gray-500 text-sm">
                            No terms available
                        </li>
                    </ul>
                </div>
            </div>

            <div class="modal-action">
                <form method="dialog">
                    <button class="btn btn-primary">Close</button>
                </form>
            </div>
        </div>
    </dialog>

    <!-- Edit Status Modal -->
    <dialog id="editStatusModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-2xl mb-6 text-gray-800">Edit Agreement Status</h3>
            
            <div v-if="editingAgreement" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                        v-model="selectedStatus"
                        :disabled="updatingStatus"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div v-if="statusError" class="text-red-600 text-sm mt-2">
                    {{ statusError }}
                </div>
            </div>

            <div class="modal-action">
                <button 
                    @click="updateStatus"
                    :disabled="updatingStatus"
                    class="btn btn-primary"
                >
                    <span v-if="updatingStatus" class="loading loading-spinner loading-sm mr-2"></span>
                    {{ updatingStatus ? 'Updating...' : 'Update Status' }}
                </button>
                <form method="dialog">
                    <button class="btn" :disabled="updatingStatus">Cancel</button>
                </form>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../../../../../services/api'
import { useAuthStore } from '../../../../../store/AuthStore'

// State
const authStore = useAuthStore()
const maintenanceAgreements = ref([])
const allAgreements = ref([])
const filters = ref({
    search: '',
    customer_id: '',
    status: ''
})
const pagination = ref({
    current_page: 1,
    per_page: 10,
    total: 0,
    from: 1,
    to: 10,
    last_page: 0
})
const loading = ref(false)
const selectedAgreement = ref(null)
const editingAgreement = ref(null)
const selectedStatus = ref('')
const updatingStatus = ref(false)
const statusError = ref('')

// Computed
const uniqueCustomers = computed(() => {
    const customerMap = new Map()
    allAgreements.value.forEach(item => {
        if (item.customer?.id && item.customer?.contact_name) {
            customerMap.set(item.customer.id, {
                id: item.customer.id,
                contact_name: item.customer.contact_name
            })
        }
    })
    return Array.from(customerMap.values())
})

const filteredAgreements = computed(() => {
    let filtered = allAgreements.value

    // Search filter
    if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase()
        filtered = filtered.filter(item => 
            (item.title || '').toLowerCase().includes(searchTerm) ||
            (item.customer?.contact_name || '').toLowerCase().includes(searchTerm) ||
            (item.work_order?.pool?.label || '').toLowerCase().includes(searchTerm) ||
            (item.work_order?.technician?.name || '').toLowerCase().includes(searchTerm)
        )
    }

    // Customer filter
    if (filters.value.customer_id) {
        filtered = filtered.filter(item => 
            item.customer?.id === filters.value.customer_id
        )
    }

    // Status filter
    if (filters.value.status) {
        filtered = filtered.filter(item =>
            item.status === filters.value.status
        )
    }

    // Update pagination
    pagination.value.total = filtered.length
    pagination.value.last_page = Math.ceil(pagination.value.total / pagination.value.per_page)
    pagination.value.from = (pagination.value.current_page - 1) * pagination.value.per_page + 1
    pagination.value.to = Math.min(pagination.value.current_page * pagination.value.per_page, pagination.value.total)

    const start = (pagination.value.current_page - 1) * pagination.value.per_page
    const end = start + pagination.value.per_page
    return filtered.slice(start, end)
})

// Methods
const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const formatTime = (timeString) => {
    if (!timeString) return '-'
    try {
        const [hours, minutes] = timeString.split(':')
        const date = new Date()
        date.setHours(parseInt(hours), parseInt(minutes))
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return timeString
    }
}

const formatStatus = (status) => {
    if (!status) return '-'
    return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusBadgeClass = (status) => {
    const classes = {
        'active': 'bg-green-100 text-green-700',
        'completed': 'bg-blue-100 text-blue-700',
        'cancelled': 'bg-red-100 text-red-700'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
}

const getTerms = (content) => {
    if (!content) return []
    if (Array.isArray(content)) return content
    if (typeof content === 'string') {
        return content.split('\n').filter(line => line.trim())
    }
    return []
}

const loadMaintenanceAgreements = async () => {
    loading.value = true
    try {
        const url = authStore.authType == 'admin' ? `/maintenance-agreement-management/agreements?tenant_id=${authStore.tenantId}` : '/maintenance-agreement-management/agreements'
        const response = await api().get(url)
        allAgreements.value = response.data.data || []
        maintenanceAgreements.value = allAgreements.value
    } catch (error) {
        console.error('Error loading agreements:', error)
        // Show error toast here
    } finally {
        loading.value = false
    }
}

// const loadMaintenanceAgreements = async () => {
//     loading.value = true
//     try {
//         const response = await api().get('/maintenance-agreement-management/agreements')
//         allAgreements.value = response.data.data || []
//         maintenanceAgreements.value = allAgreements.value
//     } catch (error) {
//         console.error('Error loading agreements:', error)
//         // Show error toast here
//     } finally {
//         loading.value = false
//     }
// }

const resetFilters = () => {
    filters.value = {
        search: '',
        customer_id: '',
        status: ''
    }
    pagination.value.current_page = 1
}

const createAgreement = () => {
    console.log('Create new maintenance agreement')
    // Navigate to create page
}

const viewAgreement = (agreement) => {
    selectedAgreement.value = agreement
    document.getElementById('viewAgreementModal').showModal()
}

const openEditModal = (agreement) => {
    editingAgreement.value = agreement
    selectedStatus.value = agreement.status
    statusError.value = ''
    document.getElementById('editStatusModal').showModal()
}

const updateStatus = async () => {
    if (!editingAgreement.value || !selectedStatus.value) return
    
    updatingStatus.value = true
    statusError.value = ''
    
    try {
        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('status', selectedStatus.value)
        
        await api().post(
            `/maintenance-agreement-management/agreements/${editingAgreement.value.id}`,
            formData
        )
        
        // Close modal
        document.getElementById('editStatusModal').close()
        
        // Show success toast (implement your toast system)
        console.log('Status updated successfully')
        
        // Reload agreements
        await loadMaintenanceAgreements()
        
        // Reset edit state
        editingAgreement.value = null
        selectedStatus.value = ''
        
    } catch (error) {
        console.error('Error updating status:', error)
        statusError.value = error.response?.data?.message || 'Failed to update status'
    } finally {
        updatingStatus.value = false
    }
}

const prevPage = () => {
    if (pagination.value.current_page > 1) {
        pagination.value.current_page--
    }
}

const nextPage = () => {
    if (pagination.value.current_page < pagination.value.last_page) {
        pagination.value.current_page++
    }
}

watch(() => authStore.tenantId, () => {
  loadMaintenanceAgreements();
})

// Lifecycle
onMounted(() => {
    loadMaintenanceAgreements()
})
</script>