<template>
    <div class="px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Create Pool</h1>
            <p class="text-sm text-gray-500 mt-1">Register a new swimming pool and assign it to a customer.</p>
        </div>

        <!-- Customer Selection -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Customer Selection</h2>
            <div class="max-w-md">
                <label class="block text-sm font-medium text-gray-700 mb-1">Select Customer *</label>

                <!-- Custom Searchable Dropdown -->
                <div class="relative" ref="dropdownRef">
                    <div class="relative">
                        <input ref="searchInput" type="text" v-model="searchQuery" @focus="isDropdownOpen = true"
                            @input="handleSearch" placeholder="Search by name or email..."
                            class="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.customer_id }" />
                        <button type="button" @click="toggleDropdown"
                            class="absolute inset-y-0 right-0 px-3 flex items-center">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <!-- Dropdown Options -->
                    <div v-if="isDropdownOpen && filteredCustomers.length > 0"
                        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div v-for="customer in filteredCustomers" :key="customer.id" @click="selectCustomer(customer)"
                            class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            :class="{ 'bg-blue-50': selectedCustomerId === customer.id }">
                            <div class="font-medium text-gray-900">{{ customer.contact_name }}</div>
                            <div class="text-xs text-gray-500">{{ customer.email }}</div>
                        </div>
                    </div>

                    <!-- No Results -->
                    <div v-if="isDropdownOpen && filteredCustomers.length === 0 && searchQuery"
                        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                        No customers found
                    </div>
                </div>

                <p v-if="errors.customer_id" class="mt-1 text-sm text-red-600">{{ errors.customer_id }}</p>

                <!-- Selected Customer Display -->
                <div v-if="selectedCustomer" class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="font-medium text-gray-900">{{ selectedCustomer.contact_name }}</span>
                            <span class="text-sm text-gray-600 ml-2">({{ selectedCustomer.email }})</span>
                        </div>
                        <button @click="clearCustomer" type="button" class="text-gray-400 hover:text-gray-600">
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Customer Information & Existing Pools -->
        <div v-if="selectedCustomer" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Customer Info Card -->
            <div class="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Customer Profile</h3>
                <div class="space-y-3">
                    <div>
                        <p class="text-sm text-gray-500">Name</p>
                        <p class="font-medium text-gray-900">{{ selectedCustomer.contact_name }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Email</p>
                        <p class="text-sm text-gray-700">{{ selectedCustomer.email }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Phone</p>
                        <p class="text-sm text-gray-700">{{ selectedCustomer.phone || 'N/A' }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Status</p>
                        <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                        </span>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Agreements</p>
                        <p class="text-sm font-medium text-gray-900">
                            {{ selectedCustomer.agreements?.length || 0 }} {{ selectedCustomer.agreements?.length === 1
                                ? 'Active Agreement' : 'Active Agreements' }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Existing Pools -->
            <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Current Pools</h3>
                <div v-if="selectedCustomer.pools && selectedCustomer.pools.length > 0"
                    class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="pool in selectedCustomer.pools" :key="pool.id"
                        class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start">
                            <h4 class="font-semibold text-gray-900">{{ pool.label }}</h4>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="pool.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'">
                                {{ pool.is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </div>
                        <div class="mt-2 space-y-1 text-sm text-gray-600">
                            <p><span class="font-medium">Chemical:</span> {{ getChemicalLabel(pool.chemical_type) }}</p>
                            <p><span class="font-medium">Volume:</span> {{ pool.volume_gallons ?
                                pool.volume_gallons.toLocaleString() + ' gal' : 'N/A' }}</p>
                            <p><span class="font-medium">Season:</span> {{ pool.season === 'year_round' ? 'Year Round' :
                                'Seasonal' }}</p>
                            <p class="truncate"><span class="font-medium">Address:</span> {{ pool.service_address ||
                                'N/A' }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p class="mt-2">No pools registered for this customer.</p>
                </div>
            </div>
        </div>

        <!-- Pool Information Form -->
        <div v-if="selectedCustomer" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">Pool Information</h2>

            <form @submit.prevent="submitPool" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Pool Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Pool Name *</label>
                        <input v-model="form.label" type="text" placeholder="Main Pool"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.label }" />
                        <p v-if="errors.label" class="mt-1 text-sm text-red-600">{{ errors.label }}</p>
                    </div>

                    <!-- Chemical Type -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Chemical Type *</label>
                        <select v-model="form.chemical_type"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.chemical_type }">
                            <option value="">Select Chemical Type</option>
                            <option value="chlorine">Chlorine</option>
                            <option value="salt">Salt</option>
                            <option value="bromine">Bromine</option>
                            <option value="baquacil">Baquacil</option>
                            <option value="mineral">Mineral</option>
                        </select>
                        <p v-if="errors.chemical_type" class="mt-1 text-sm text-red-600">{{ errors.chemical_type }}</p>
                    </div>

                    <!-- Service Address -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Service Address *</label>
                        <textarea v-model="form.service_address" rows="2" placeholder="123 Main St, City, State, ZIP"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.service_address }"></textarea>
                        <p v-if="errors.service_address" class="mt-1 text-sm text-red-600">{{ errors.service_address }}
                        </p>
                    </div>

                    <!-- Access Notes -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Access Notes</label>
                        <textarea v-model="form.access_notes" rows="2"
                            placeholder="Gate code, special instructions, pet notes..."
                            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                    </div>

                    <!-- Gate Code -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Gate Code</label>
                        <input v-model="form.gate_code" type="text" placeholder="1234"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <!-- Volume -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Pool Volume (Gallons)</label>
                        <input v-model.number="form.volume_gallons" type="number" min="0" placeholder="15000"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.volume_gallons }" />
                        <p v-if="errors.volume_gallons" class="mt-1 text-sm text-red-600">{{ errors.volume_gallons }}
                        </p>
                    </div>

                    <!-- Season -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Season *</label>
                        <select v-model="form.season"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.season }">
                            <option value="">Select Season</option>
                            <option value="year_round">Year Round</option>
                            <option value="seasonal">Seasonal</option>
                        </select>
                        <p v-if="errors.season" class="mt-1 text-sm text-red-600">{{ errors.season }}</p>
                    </div>

                    <!-- Toggles -->
                    <div class="md:col-span-2 flex flex-wrap items-center gap-6">
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-gray-700 mr-3">Has Dog</span>
                            <button type="button" @click="form.has_dog = !form.has_dog"
                                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                :class="form.has_dog ? 'bg-blue-600' : 'bg-gray-200'">
                                <span
                                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    :class="form.has_dog ? 'translate-x-5' : 'translate-x-0'" />
                            </button>
                        </div>

                        <div class="flex items-center">
                            <span class="text-sm font-medium text-gray-700 mr-3">Active Pool</span>
                            <button type="button" @click="form.is_active = !form.is_active"
                                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                :class="form.is_active ? 'bg-blue-600' : 'bg-gray-200'">
                                <span
                                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    :class="form.is_active ? 'translate-x-5' : 'translate-x-0'" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="pt-4 border-t border-gray-200">
                    <button type="submit" :disabled="isSubmitting"
                        class="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors">
                        <span v-if="isSubmitting" class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Creating Pool...
                        </span>
                        <span v-else>Create Pool</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '../../../../services/api'
import { useAuthStore } from '../../../../store/AuthStore'

const router = useRouter()

// State
const customers = ref([])
const selectedCustomerId = ref(null)
const selectedCustomer = ref(null)
const isSubmitting = ref(false)
const errors = ref({})
const searchQuery = ref('')
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const searchInput = ref(null)

// Form
const form = ref({
    customer_id: null,
    label: '',
    service_address: '',
    access_notes: '',
    gate_code: '',
    has_dog: false,
    volume_gallons: null,
    chemical_type: '',
    season: '',
    is_active: true
})

// Computed
const filteredCustomers = computed(() => {
    if (!searchQuery.value) return customers.value

    const query = searchQuery.value.toLowerCase()
    return customers.value.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
    )
})

// Methods
const getChemicalLabel = (type) => {
    const labels = {
        chlorine: 'Chlorine',
        salt: 'Salt',
        bromine: 'Bromine',
        baquacil: 'Baquacil',
        mineral: 'Mineral'
    }
    return labels[type] || type
}
const authStore = useAuthStore() 
const loadCustomers = async () => {
    try {
        const base = '/customer-management/customers-advance?with=pools,agreements';
        const url = authStore.authType === 'admin' ? `${base}&tenant_id=${authStore.tenantId}` : base;
        const response = await api().get(url)
        customers.value = response.data.data || []
    } catch (error) {
        console.error('Failed to load customers:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load customers. Please refresh the page.'
        })
    }
}

const handleSearch = () => {
    isDropdownOpen.value = true
}

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
    if (isDropdownOpen.value) {
        nextTick(() => {
            searchInput.value?.focus()
        })
    }
}

const selectCustomer = (customer) => {
    selectedCustomerId.value = customer.id
    selectedCustomer.value = customer
    form.value.customer_id = customer.id
    searchQuery.value = customer.name
    isDropdownOpen.value = false
    errors.value.customer_id = null
}

const clearCustomer = () => {
    selectedCustomerId.value = null
    selectedCustomer.value = null
    form.value.customer_id = null
    searchQuery.value = ''
    isDropdownOpen.value = false
}

const closeDropdown = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isDropdownOpen.value = false
    }
}

const validateForm = () => {
    const newErrors = {}

    if (!form.value.customer_id) {
        newErrors.customer_id = 'Please select a customer'
    }
    if (!form.value.label?.trim()) {
        newErrors.label = 'Pool name is required'
    }
    if (!form.value.service_address?.trim()) {
        newErrors.service_address = 'Service address is required'
    }
    if (!form.value.chemical_type) {
        newErrors.chemical_type = 'Chemical type is required'
    }
    if (!form.value.season) {
        newErrors.season = 'Season is required'
    }
    if (form.value.volume_gallons !== null && form.value.volume_gallons < 0) {
        newErrors.volume_gallons = 'Volume must be 0 or greater'
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
}

const submitPool = async () => {
    if (!validateForm()) {
        // Scroll to first error
        const firstError = document.querySelector('.border-red-500')
        if (firstError) {
            firstError.focus()
        }
        return
    }

    isSubmitting.value = true

    try {
        const payload = {
            customer_id: form.value.customer_id,
            label: form.value.label.trim(),
            service_address: form.value.service_address.trim(),
            access_notes: form.value.access_notes?.trim() || '',
            gate_code: form.value.gate_code?.trim() || '',
            has_dog: form.value.has_dog == true ? 1 : 0,
            volume_gallons: form.value.volume_gallons || null,
            chemical_type: form.value.chemical_type,
            season: form.value.season,
            is_active: form.value.is_active == true ? 1 : 0
        }

        await api().post('/pool-management/pools', payload)

        // Success
        const result = await Swal.fire({
            icon: 'success',
            title: 'Pool Created Successfully',
            text: 'The pool has been added to the selected customer.',
            showCancelButton: true,
            confirmButtonText: 'View Pools',
            cancelButtonText: 'Create Another',
            reverseButtons: true
        })

        if (result.isConfirmed) {
            // router.push('/provider/pools')
        } else {
            // Reset form but keep customer selected
            resetForm()
            // Reload customer pool list
            await loadCustomers()
            // Re-select the customer to refresh pool list
            if (selectedCustomerId.value) {
                const customer = customers.value.find(c => c.id === selectedCustomerId.value)
                if (customer) {
                    selectedCustomer.value = customer
                } else {
                    clearCustomer()
                }
            }
        }
    } catch (error) {
        console.error('Pool creation failed:', error)
        const message = error.response?.data?.message || 'Failed to create pool. Please try again.'
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
        })
    } finally {
        isSubmitting.value = false
    }
}

const resetForm = () => {
    form.value = {
        customer_id: form.value.customer_id,
        label: '',
        service_address: '',
        access_notes: '',
        gate_code: '',
        has_dog: false,
        volume_gallons: null,
        chemical_type: '',
        season: '',
        is_active: true
    }
    errors.value = {}
}

watch(() => authStore.tenantId, () => {
  loadCustomers();
    // fetchTermTemplates()
})

// Lifecycle
onMounted(() => {
    loadCustomers()
    document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown)
})
</script>