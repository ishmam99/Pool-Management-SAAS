<template>
  <div class="min-h-screen bg-gray-100 p-6 font-sans">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Technician Dashboard</h1>
        <p class="text-gray-500">Welcome back, {{ technician.name }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>

      <div v-else>
        <!-- Technician Profile Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row md:items-center gap-6 border border-gray-200">
          <div class="flex-shrink-0">
            <div class="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-3xl font-bold">
              {{ technician.name?.charAt(0) || 'T' }}
            </div>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-semibold text-gray-800">{{ technician.name }}</h2>
            <div class="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
              <span><i class="fas fa-envelope mr-2"></i>{{ technician.email }}</span>
              <span><i class="fas fa-phone mr-2"></i>{{ technician.phone || 'N/A' }}</span>
              <span><i class="fas fa-id-badge mr-2"></i>Technician ID: #{{ technician.id }}</span>
            </div>
          </div>
          <div class="flex-shrink-0">
            <span class="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <i class="fas fa-circle mr-1" style="font-size: 8px;"></i> Active
            </span>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Today's Visits</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.today_visits }}</p>
              </div>
              <div class="bg-blue-100 p-3 rounded-full text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              <span class="text-green-600">{{ stats.completed_today }} completed</span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Scheduled Visits</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.scheduled_visits }}</p>
              </div>
              <div class="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              <span class="text-yellow-600">{{ stats.this_week_visits }} this week</span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow p-5 border-l-4 border-red-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Pending Work Orders</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.pending_work_orders }}</p>
              </div>
              <div class="bg-red-100 p-3 rounded-full text-red-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              <span class="text-red-600">Needs attention</span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Completion Rate</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.completion_rate }}%</p>
              </div>
              <div class="bg-green-100 p-3 rounded-full text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              <span class="text-green-600">{{ stats.completed_this_week }} completed this week</span>
            </div>
          </div>
        </div>

        <!-- Recent Work Orders -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 class="text-lg font-semibold text-gray-800">Recent Work Orders</h3>
            <span class="text-sm text-gray-500">Last {{ recentWorkOrders.length }} orders</span>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in recentWorkOrders" :key="order.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">#{{ order.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ order.pool?.label || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="{
                            'bg-blue-100 text-blue-800': order.type === 'routine',
                            'bg-orange-100 text-orange-800': order.type === 'repair',
                            'bg-purple-100 text-purple-800': order.type === 'installation'
                          }">
                      {{ order.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="{
                            'bg-yellow-100 text-yellow-800': order.status === 'created' || order.status === 'scheduled',
                            'bg-green-100 text-green-800': order.status === 'completed',
                            'bg-red-100 text-red-800': order.status === 'cancelled'
                          }">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button @click="viewOrder(order)" class="text-teal-600 hover:text-teal-900 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
                <tr v-if="recentWorkOrders.length === 0">
                  <td colspan="6" class="px-6 py-10 text-center text-gray-400">No recent work orders found</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
            <span class="text-xs text-gray-500">Showing latest {{ recentWorkOrders.length }} orders</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Optional: Modal for Order Details (placeholder) -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">Work Order #{{ selectedOrder.id }}</h3>
          <button @click="selectedOrder = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-3">
          <p><strong>Pool:</strong> {{ selectedOrder.pool?.label || 'N/A' }}</p>
          <p><strong>Type:</strong> {{ selectedOrder.type }}</p>
          <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
          <p><strong>Created:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
          <p><strong>Notes:</strong> {{ selectedOrder.notes || 'No notes' }}</p>
          <div v-if="selectedOrder.checklist && selectedOrder.checklist.length">
            <p class="font-medium">Checklist:</p>
            <ul class="list-disc pl-5 text-sm">
              <li v-for="(item, idx) in selectedOrder.checklist" :key="idx">
                {{ item.item }} <span v-if="item.isChecked === 'true'" class="text-green-600">✓</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button @click="selectedOrder = null" class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../../../services/api'

const loading = ref(true)
const technician = ref({})
const stats = ref({})
const recentWorkOrders = ref([])
const selectedOrder = ref(null)

const fetchDashboard = async () => {
  try {
    const response = await api().get('/technician-portal/dashboard')
    const data = response.data.data
    technician.value = data.technician || {}
    stats.value = data.stats || {}
    recentWorkOrders.value = data.recent_work_orders || []
  } catch (error) {
    console.error('Failed to fetch dashboard:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewOrder = (order) => {
  selectedOrder.value = order
}

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
/* Optional custom styles if needed */
</style>