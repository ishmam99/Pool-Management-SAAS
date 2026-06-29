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
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <select
                        v-model="filters.customer"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                        <option value="">All Customers</option>
                        <option v-for="customer in uniqueCustomers" :key="customer" :value="customer">
                            {{ customer }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        v-model="filters.status"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <input
                        type="date"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Optional"
                    />
                </div>
                <div class="flex items-end">
                    <button
                        @click="resetFilters"
                        class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition"
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
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Order</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="agreement in filteredAgreements" :key="agreement.id" class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-sm font-medium text-gray-900">#{{ agreement.id }}</td>
                            <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.title }}</td>
                            <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.customer }}</td>
                            <td class="px-4 py-3 text-sm text-gray-700">#{{ agreement.work_order_id }}</td>
                            <td class="px-4 py-3 text-sm text-gray-700">{{ agreement.pool }}</td>
                            <td class="px-4 py-3 text-sm text-gray-700 font-medium">${{ agreement.price.toFixed(2) }}</td>
                            <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(agreement.scheduled_date) }}</td>
                            <td class="px-4 py-3">
                                <span :class="getStatusBadgeClass(agreement.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                                    {{ agreement.status }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(agreement.created_at) }}</td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <button
                                        @click="viewAgreement(agreement)"
                                        class="text-blue-600 hover:text-blue-800 transition"
                                        title="View"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="editAgreement(agreement)"
                                        class="text-yellow-600 hover:text-yellow-800 transition"
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="deleteAgreement(agreement)"
                                        class="text-red-600 hover:text-red-800 transition"
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredAgreements.length === 0">
                            <td colspan="10" class="px-4 py-12 text-center">
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
                        :disabled="pagination.current_page === 1"
                        class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span class="text-sm text-gray-700">
                        Page {{ pagination.current_page }} of {{ pagination.last_page }}
                    </span>
                    <button
                        @click="nextPage"
                        :disabled="pagination.current_page === pagination.last_page"
                        class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import api from '@/services/api'

// Mock Data
const mockAgreements = [
    {
        id: 1,
        title: 'Pump Motor Replacement',
        customer: 'John Smith',
        work_order_id: 94,
        pool: 'Sunset Pool',
        price: 450.00,
        scheduled_date: '2026-07-15',
        status: 'Active',
        created_at: '2026-07-10T09:00:00'
    },
    {
        id: 2,
        title: 'Pool Heater Installation',
        customer: 'Sarah Johnson',
        work_order_id: 87,
        pool: 'Grand Oasis',
        price: 1200.00,
        scheduled_date: '2026-07-20',
        status: 'Pending',
        created_at: '2026-07-12T14:30:00'
    },
    {
        id: 3,
        title: 'Plumbing Leak Repair',
        customer: 'Michael Brown',
        work_order_id: 102,
        pool: 'Blue Haven',
        price: 350.00,
        scheduled_date: '2026-07-05',
        status: 'Completed',
        created_at: '2026-07-01T11:15:00'
    },
    {
        id: 4,
        title: 'Acid Wash Service',
        customer: 'Emily Davis',
        work_order_id: 76,
        pool: 'Paradise Villa',
        price: 850.00,
        scheduled_date: '2026-07-25',
        status: 'Active',
        created_at: '2026-07-14T16:45:00'
    },
    {
        id: 5,
        title: 'Salt Cell Replacement',
        customer: 'Robert Wilson',
        work_order_id: 113,
        pool: 'Aqua Springs',
        price: 275.00,
        scheduled_date: '2026-07-18',
        status: 'Cancelled',
        created_at: '2026-07-08T10:20:00'
    },
    {
        id: 6,
        title: 'Filter Sand Replacement',
        customer: 'Jessica Martinez',
        work_order_id: 65,
        pool: 'Crystal Clear',
        price: 525.00,
        scheduled_date: '2026-07-28',
        status: 'Active',
        created_at: '2026-07-15T08:30:00'
    },
    {
        id: 7,
        title: 'Pool Light Repair',
        customer: 'David Anderson',
        work_order_id: 91,
        pool: 'Starlight Pools',
        price: 180.00,
        scheduled_date: '2026-07-12',
        status: 'Completed',
        created_at: '2026-07-09T13:50:00'
    },
    {
        id: 8,
        title: 'Equipment Inspection',
        customer: 'Jennifer Taylor',
        work_order_id: 129,
        pool: 'Tranquil Waters',
        price: 95.00,
        scheduled_date: '2026-08-01',
        status: 'Pending',
        created_at: '2026-07-16T09:15:00'
    },
    {
        id: 9,
        title: 'Automation System Installation',
        customer: 'Thomas Moore',
        work_order_id: 58,
        pool: 'Laguna Bay',
        price: 2150.00,
        scheduled_date: '2026-07-30',
        status: 'Active',
        created_at: '2026-07-13T14:00:00'
    },
    {
        id: 10,
        title: 'Tile Cleaning Service',
        customer: 'Lisa Garcia',
        work_order_id: 145,
        pool: 'Mediterranean Oasis',
        price: 625.00,
        scheduled_date: '2026-08-05',
        status: 'Active',
        created_at: '2026-07-17T10:45:00'
    }
]

// State
const maintenanceAgreements = ref([])
const filters = ref({
    search: '',
    customer: '',
    status: ''
})
const pagination = ref({
    current_page: 1,
    per_page: 5,
    total: 0,
    from: 1,
    to: 5,
    last_page: 0
})

// Computed
const uniqueCustomers = computed(() => {
    const customers = new Set()
    maintenanceAgreements.value.forEach(item => {
        customers.add(item.customer)
    })
    return Array.from(customers)
})

const filteredAgreements = computed(() => {
    let filtered = maintenanceAgreements.value

    // Search filter
    if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase()
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(searchTerm)
        )
    }

    // Customer filter
    if (filters.value.customer) {
        filtered = filtered.filter(item =>
            item.customer === filters.value.customer
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
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const getStatusBadgeClass = (status) => {
    const classes = {
        'Active': 'bg-green-100 text-green-700',
        'Completed': 'bg-blue-100 text-blue-700',
        'Cancelled': 'bg-red-100 text-red-700',
        'Pending': 'bg-yellow-100 text-yellow-700'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
}

const loadMaintenanceAgreements = async () => {
    // TODO: Enable when backend is ready

    /*
    try {
        const response = await api().get('/maintenance-agreement-management/agreements')
        maintenanceAgreements.value = response.data.data
    } catch (error) {
        console.error(error)
    }
    */

    // Mock data for now
    maintenanceAgreements.value = mockAgreements
    pagination.value.total = mockAgreements.length
    pagination.value.last_page = Math.ceil(pagination.value.total / pagination.value.per_page)
}

const resetFilters = () => {
    filters.value = {
        search: '',
        customer: '',
        status: ''
    }
    pagination.value.current_page = 1
}

const createAgreement = () => {
    console.log('Create new maintenance agreement')
    // Navigate to create page
}

const viewAgreement = (agreement) => {
    console.log('View agreement:', agreement)
}

const editAgreement = (agreement) => {
    console.log('Edit agreement:', agreement)
}

const deleteAgreement = (agreement) => {
    // SweetAlert confirmation would go here
    if (confirm(`Are you sure you want to delete agreement #${agreement.id}?`)) {
        console.log('Delete agreement:', agreement)
        // Remove from list
        maintenanceAgreements.value = maintenanceAgreements.value.filter(
            item => item.id !== agreement.id
        )
        pagination.value.total = maintenanceAgreements.value.length
        pagination.value.last_page = Math.ceil(pagination.value.total / pagination.value.per_page)
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

// Lifecycle
onMounted(() => {
    loadMaintenanceAgreements()
})
</script>

