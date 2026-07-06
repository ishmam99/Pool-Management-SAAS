<template>
    <div class="p-6 ">
        <!-- Page Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Create Maintenance Agreement</h1>
            <p class="text-gray-600 mt-1">Create a one-time maintenance agreement based on an existing work order.</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Main Form -->
            <div class="flex-1">
                <!-- Section ① Customer Information -->
                <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div class="flex items-center gap-3 mb-6">
                        <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full text-sm">①</span>
                        <h2 class="text-xl font-semibold text-gray-800">Customer Information</h2>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
                        <select
                            v-model="form.customer_id"
                            @change="onCustomerChange"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            :disabled="loading.customers"
                        >
                            <option value="">Select a customer...</option>
                            <option
                                v-for="customer in customers"
                                :key="customer.id"
                                :value="customer.id"
                            >
                                {{ customer.contact_name }} - {{ customer.email }}
                            </option>
                        </select>
                        <div v-if="loading.customers" class="text-sm text-gray-500 mt-1">
                            <span class="inline-block animate-pulse">Loading customers...</span>
                        </div>
                    </div>

                    <!-- Customer Info Card -->
                    <div v-if="selectedCustomer" class="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Contact Name</p>
                                <p class="font-medium">{{ selectedCustomer.contact_name }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Email</p>
                                <p class="font-medium">{{ selectedCustomer.email }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Phone</p>
                                <p class="font-medium">{{ selectedCustomer.phone || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Customer Type</p>
                                <p class="font-medium">{{ selectedCustomer.type || 'N/A' }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <p class="text-sm text-gray-500">Billing Address</p>
                                <p class="font-medium">{{ selectedCustomer.billing_address || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Status</p>
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    {{ selectedCustomer.status || 'Active' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section ② Work Order Selection -->
                <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div class="flex items-center gap-3 mb-6">
                        <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full text-sm">②</span>
                        <h2 class="text-xl font-semibold text-gray-800">Work Order Selection</h2>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Select Work Order</label>
                        <select
                            v-model="form.work_order_id"
                            @change="onWorkOrderChange"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            :disabled="!form.customer_id || loading.workOrders"
                        >
                            <option value="">Select a work order...</option>
                            <option
                                v-for="wo in workOrders"
                                :key="wo.id"
                                :value="wo.id"
                            >
                                ID: {{ wo.id }} • {{ wo.type.toUpperCase() }} • {{ wo.pool.label || 'No Pool' }} • {{ wo.status }}
                            </option>
                        </select>
                        <div v-if="loading.workOrders" class="text-sm text-gray-500 mt-1">
                            <span class="inline-block animate-pulse">Loading work orders...</span>
                        </div>
                        <div v-if="!loading.workOrders && workOrders.length === 0 && form.customer_id" class="text-sm text-yellow-600 mt-1">
                            No maintenance work orders found for this customer.
                        </div>
                    </div>

                    <!-- Work Order Details Card -->
                    <div v-if="selectedWorkOrder" class="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Work Order ID</p>
                                <p class="font-medium">#{{ selectedWorkOrder.id }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Work Order Type</p>
                                <p class="font-medium">{{ selectedWorkOrder.type }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Status</p>
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {{ selectedWorkOrder.status }}
                                </span>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Pool Name</p>
                                <p class="font-medium">{{ selectedWorkOrder.pool.label || 'N/A' }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <p class="text-sm text-gray-500">Customer</p>
                                <p class="font-medium">{{ selectedWorkOrder.customer_name }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <p class="text-sm text-gray-500">Notes</p>
                                <p class="font-medium">{{ selectedWorkOrder.notes || 'No notes' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Created Date</p>
                                <p class="font-medium">{{ formatDate(selectedWorkOrder.created_at) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section ③ Maintenance Agreement Details -->
                <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div class="flex items-center gap-3 mb-6">
                        <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full text-sm">③</span>
                        <h2 class="text-xl font-semibold text-gray-800">Maintenance Agreement Details</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Agreement Title <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.title"
                                type="text"
                                placeholder="e.g., Pump Motor Replacement"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Maintenance Price <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    v-model="form.price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Scheduled Date <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.scheduled_date"
                                type="date"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Scheduled Start Time <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.start_time"
                                type="time"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estimated End Time</label>
                            <input
                                v-model="form.end_time"
                                type="time"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Warranty Period</label>
                            <select
                                v-model="form.warranty_period"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                                <option value="">Select warranty period...</option>
                                <option value="No Warranty">No Warranty</option>
                                <option value="30 Days">30 Days</option>
                                <option value="60 Days">60 Days</option>
                                <option value="90 Days">90 Days</option>
                                <option value="6 Months">6 Months</option>
                                <option value="1 Year">1 Year</option>
                            </select>
                        </div>

                        <!-- Terms & Conditions Template -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Terms &amp; Conditions Template <span class="text-red-500">*</span>
                            </label>
                            <select
                                v-model="form.term_template_id"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                :disabled="loading.termTemplates"
                            >
                                <option value="">Select a template...</option>
                                <option
                                    v-for="template in termTemplates"
                                    :key="template.id"
                                    :value="template.id"
                                >
                                    {{ template.name }}
                                </option>
                            </select>
                            <div v-if="loading.termTemplates" class="text-sm text-gray-500 mt-1">
                                <span class="inline-block animate-pulse">Loading templates...</span>
                            </div>
                        </div>

                        <!-- Template Preview Card -->
                        <div v-if="selectedTemplate && !loading.termTemplates" class="md:col-span-2">
                            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-2">
                                <h4 class="text-sm font-semibold text-blue-600 mb-2">Terms &amp; Conditions Preview</h4>
                                <h5 class="font-medium text-gray-800">{{ selectedTemplate.name }}</h5>
                                <p class="text-sm text-gray-600 mt-1">{{ selectedTemplate.description || 'No description available.' }}</p>
                                <p class="text-sm text-gray-500 mt-1">
                                    <span class="font-medium">{{ selectedTemplate.terms_count || 0 }}</span> Terms Included
                                </p>
                                
                                <!-- Terms List -->
                                <div v-if="selectedTemplate.terms && selectedTemplate.terms.length > 0" 
                                     class="mt-3 max-h-60 overflow-y-auto border-t border-gray-200 pt-3">
                                    <div 
                                        v-for="(term, index) in selectedTemplate.terms" 
                                        :key="index"
                                        class="flex items-start gap-2 py-1.5 text-sm text-gray-700 border-b border-gray-100 last:border-0"
                                    >
                                        <span class="text-green-600 mt-0.5">✓</span>
                                        <span>{{ term }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                v-model="form.notes"
                                rows="3"
                                placeholder="Additional maintenance instructions..."
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- Section ④ Maintenance Services Included -->
                <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full text-sm">④</span>
                        <h2 class="text-xl font-semibold text-gray-800">Maintenance Services Included</h2>
                    </div>
                    <p class="text-sm text-gray-600 mb-4 ml-11">Select all maintenance services included in this maintenance agreement.</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Equipment -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-700 mb-2">Equipment</h3>
                            <div class="space-y-2">
                                <label v-for="service in serviceCategories.equipment" :key="service" class="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        v-model="form.service_includes"
                                        :value="service"
                                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {{ service }}
                                </label>
                            </div>
                        </div>

                        <!-- Plumbing -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-700 mb-2">Plumbing</h3>
                            <div class="space-y-2">
                                <label v-for="service in serviceCategories.plumbing" :key="service" class="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        v-model="form.service_includes"
                                        :value="service"
                                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {{ service }}
                                </label>
                            </div>
                        </div>

                        <!-- Electrical -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-700 mb-2">Electrical</h3>
                            <div class="space-y-2">
                                <label v-for="service in serviceCategories.electrical" :key="service" class="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        v-model="form.service_includes"
                                        :value="service"
                                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {{ service }}
                                </label>
                            </div>
                        </div>

                        <!-- Cleaning & Restoration -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-700 mb-2">Cleaning & Restoration</h3>
                            <div class="space-y-2">
                                <label v-for="service in serviceCategories.cleaning" :key="service" class="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        v-model="form.service_includes"
                                        :value="service"
                                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {{ service }}
                                </label>
                            </div>
                        </div>

                        <!-- Installation -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-700 mb-2">Installation</h3>
                            <div class="space-y-2">
                                <label v-for="service in serviceCategories.installation" :key="service" class="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        v-model="form.service_includes"
                                        :value="service"
                                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {{ service }}
                                </label>
                            </div>
                        </div>

                        <!-- Safety & Inspection -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-700 mb-2">Safety & Inspection</h3>
                            <div class="space-y-2">
                                <label v-for="service in serviceCategories.safety" :key="service" class="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        v-model="form.service_includes"
                                        :value="service"
                                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {{ service }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <button
                    @click="createAgreement"
                    :disabled="loading.submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ loading.submit ? 'Creating...' : 'Create Maintenance Agreement' }}
                </button>
            </div>

            <!-- Section ⑤ Agreement Summary -->
            <div class="lg:w-80 flex-shrink-0">
                <div class="lg:sticky lg:top-6">
                    <div class="bg-white rounded-xl shadow-md p-6">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full text-sm">⑤</span>
                            <h2 class="text-xl font-semibold text-gray-800">Agreement Summary</h2>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-gray-500">Customer</p>
                                <p class="font-medium">{{ selectedCustomer?.contact_name || 'Not selected' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Work Order</p>
                                <p class="font-medium">{{ selectedWorkOrder ? `#${selectedWorkOrder.id}` : 'Not selected' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Pool</p>
                                <p class="font-medium">{{ selectedWorkOrder?.pool_name || 'Not selected' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Scheduled Date</p>
                                <p class="font-medium">{{ form.scheduled_date || 'Not set' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Scheduled Time</p>
                                <p class="font-medium">{{ form.start_time || 'Not set' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Price</p>
                                <p class="font-medium text-lg text-blue-600">${{ form.price || '0.00' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Warranty Period</p>
                                <p class="font-medium">{{ form.warranty_period || 'Not set' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Terms Template</p>
                                <p class="font-medium">{{ selectedTemplate?.name || 'Not selected' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Maintenance Services</p>
                                <p class="font-medium">{{ form.service_includes.length }} selected</p>
                                <ul class="mt-1 text-sm text-gray-600 space-y-1">
                                    <li v-for="service in form.service_includes" :key="service">
                                        • {{ service }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import api from '../../../../../services/api'
import { useAuthStore } from '../../../../../store/AuthStore'

const authStore = useAuthStore()

// Form data
const form = reactive({
    customer_id: '',
    work_order_id: '',
    title: '',
    price: 0,
    scheduled_date: '',
    start_time: '',
    end_time: '',
    warranty_period: '',
    status: 'active',
    notes: '',
    service_includes: [],
    term_template_id: '' // Added for Terms & Conditions Template
})

// Loading states
const loading = reactive({
    customers: false,
    workOrders: false,
    submit: false,
    termTemplates: false // Added for template loading
})

// Data stores
const customers = ref([])
const workOrders = ref([])
const termTemplates = ref([]) // Added for templates

// Service categories
const serviceCategories = {
    equipment: [
        'Replace Pool Pump',
        'Repair Pool Pump',
        'Replace Pump Motor',
        'Replace Pool Heater',
        'Repair Pool Heater',
        'Replace Salt Cell',
        'Replace Chlorinator',
        'Replace Filter Cartridge',
        'Replace Filter Sand',
        'Replace DE Grids'
    ],
    plumbing: [
        'Repair Plumbing Leak',
        'Replace PVC Pipe',
        'Repair Valve',
        'Replace Valve',
        'Repair Suction Line',
        'Repair Return Line'
    ],
    electrical: [
        'Repair Pool Light',
        'Replace Pool Light',
        'Replace Timer',
        'Replace Automation Controller',
        'Electrical Inspection'
    ],
    cleaning: [
        'Acid Wash',
        'Tile Cleaning',
        'Pressure Wash Deck',
        'Drain Pool',
        'Refill Pool'
    ],
    installation: [
        'Install New Pump',
        'Install Heater',
        'Install Automation System',
        'Install Salt System',
        'Install Pool Cover'
    ],
    safety: [
        'Equipment Inspection',
        'Leak Detection',
        'Pressure Test',
        'Safety Inspection',
        'Startup & System Testing'
    ]
}

// Computed
const selectedCustomer = computed(() => {
    return customers.value.find(c => c.id === Number(form.customer_id))
})

const selectedWorkOrder = computed(() => {
    return workOrders.value.find(wo => wo.id === Number(form.work_order_id))
})

// Computed for selected template
const selectedTemplate = computed(() => {
    return termTemplates.value.find(
        item => item.id === Number(form.term_template_id)
    )
})

// Methods
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const fetchCustomers = async () => {
    loading.customers = true

    const url = authStore.authType == 'admin' ? `/customer-management/customers-advance?tenant_id=${authStore.tenantId}` : '/customer-management/customers-advance'
    try {
        const response = await api().get(url)
        customers.value = response.data?.data ?? []
    } catch (error) {
        console.error('Error fetching customers:', error)
    } finally {
        loading.customers = false
    }
}

const fetchWorkOrders = async () => {
    if (!form.customer_id) {
        workOrders.value = []
        return
    }

    loading.workOrders = true
    try {
        const response = await api().get('/work-order-management/work-orders', {
            params: {
                customer_id: form.customer_id,
                type: 'repair,installation,inspection,one_time,emergency'
            }
        })
        workOrders.value = response.data?.data ?? []
    } catch (error) {
        console.error('Error fetching work orders:', error)
        workOrders.value = []
    } finally {
        loading.workOrders = false
    }
}

// Fetch term templates
const fetchTermTemplates = async () => {
    loading.termTemplates = true
const url = authStore.authType == 'admin' ? `/term-templates/templates?tenant_id=${authStore.tenantId}` : '/term-templates/templates'
    try {
        const response = await api().get('/term-templates/templates')
        termTemplates.value = response.data?.data || []

        // Automatically select default template
        const defaultTemplate = termTemplates.value.find(
            item => item.is_default == 1
        )

        if (defaultTemplate) {
            form.term_template_id = defaultTemplate.id
        }
    } catch (error) {
        console.error('Error fetching term templates:', error)
    } finally {
        loading.termTemplates = false
    }
}

const onCustomerChange = () => {
    form.work_order_id = ''
    workOrders.value = []
    if (form.customer_id) {
        fetchWorkOrders()
    }
}

const onWorkOrderChange = () => {
    // Work order selection logic
}

const createAgreement = async () => {
    // Validate required fields
    if (!form.customer_id) {
        alert('Please select a customer.')
        return
    }
    if (!form.work_order_id) {
        alert('Please select a work order.')
        return
    }
    if (!form.title) {
        alert('Please enter an agreement title.')
        return
    }
    if (!form.price || form.price <= 0) {
        alert('Please enter a valid maintenance price.')
        return
    }
    if (!form.scheduled_date) {
        alert('Please select a scheduled date.')
        return
    }
    if (!form.start_time) {
        alert('Please select a scheduled start time.')
        return
    }
    // Validate Terms & Conditions Template
    if (!form.term_template_id) {
        alert('Please select a Terms & Conditions Template.')
        return
    }

    loading.submit = true
    try {
        const payload = {
            customer_id: Number(form.customer_id),
            work_order_id: Number(form.work_order_id),
            title: form.title,
            price: parseFloat(form.price),
            scheduled_date: form.scheduled_date,
            start_time: form.start_time,
            end_time: form.end_time || null,
            warranty_period: form.warranty_period || null,
            status: form.status,
            term_template_id: Number(form.term_template_id), // Added term_template_id
            notes: form.notes || null,
            service_includes: form.service_includes
        }

        const response = await api().post('/maintenance-agreement-management/agreements', payload)
        alert('Maintenance agreement created successfully!')
        // Reset form or redirect as needed
        console.log('Agreement created:', response.data)
    } catch (error) {
        console.error('Error creating maintenance agreement:', error)
        alert('Failed to create maintenance agreement. Please try again.')
    } finally {
        loading.submit = false
    }
}

watch(() => authStore.tenantId, () => {
  fetchCustomers();
    fetchTermTemplates()
})


// Lifecycle
onMounted(() => {
    fetchCustomers()
    fetchTermTemplates() 
})
</script>