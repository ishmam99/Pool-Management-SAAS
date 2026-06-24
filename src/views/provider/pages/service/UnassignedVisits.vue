```vue
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <!-- Header Skeleton -->
      <div class="animate-pulse">
        <div class="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div class="h-4 w-96 bg-gray-200 rounded"></div>
      </div>
      
      <!-- KPI Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="animate-pulse">
            <div class="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div class="h-8 w-16 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      
      <!-- Filter Skeleton -->
      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <div class="animate-pulse flex gap-4">
          <div class="h-10 w-64 bg-gray-200 rounded"></div>
          <div class="h-10 w-40 bg-gray-200 rounded"></div>
          <div class="h-10 w-40 bg-gray-200 rounded"></div>
          <div class="h-10 w-40 bg-gray-200 rounded"></div>
          <div class="h-10 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <!-- Main Layout Skeleton -->
      <div class="flex gap-6">
        <div class="w-7/10 space-y-4">
          <div class="bg-white rounded-2xl p-4 shadow-sm">
            <div class="animate-pulse space-y-4">
              <div v-for="i in 3" :key="i" class="border rounded-xl p-4">
                <div class="flex items-start justify-between">
                  <div class="space-y-2">
                    <div class="h-4 w-24 bg-gray-200 rounded"></div>
                    <div class="h-6 w-32 bg-gray-200 rounded"></div>
                    <div class="h-4 w-48 bg-gray-200 rounded"></div>
                  </div>
                  <div class="flex gap-2">
                    <div class="h-8 w-20 bg-gray-200 rounded"></div>
                    <div class="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-3/10 space-y-4">
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <div class="animate-pulse space-y-4">
              <div class="h-6 w-32 bg-gray-200 rounded"></div>
              <div class="h-12 w-full bg-gray-200 rounded"></div>
              <div class="space-y-2">
                <div v-for="i in 3" :key="i" class="border rounded-xl p-4">
                  <div class="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div class="h-6 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!visits.length && !loading" class="flex items-center justify-center min-h-[600px]">
      <div class="text-center">
        <div class="text-6xl mb-4">✅</div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">No unassigned visits</h3>
        <p class="text-gray-500">All service visits have been assigned to technicians.</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Page Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Unassigned Visits</h1>
          <p class="text-gray-500 mt-1">Manage and assign service visits that are awaiting technician assignment.</p>
        </div>
        <div class="flex gap-3">
          <button 
            v-if="selectedVisits.length > 0"
            class="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Assign Selected ({{ selectedVisits.length }})
          </button>
          <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Auto Assign
          </button>
          <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Create Route
          </button>
          <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Export
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm font-medium text-gray-500">Total Unassigned</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">{{ summary.totalUnassigned }}</p>
          <p class="text-xs text-gray-400 mt-1">Pending Assignment</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm font-medium text-gray-500">High Priority</p>
          <p class="text-3xl font-bold text-orange-500 mt-1">{{ summary.highPriority }}</p>
          <p class="text-xs text-gray-400 mt-1">Requires Attention</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm font-medium text-gray-500">Emergency</p>
          <p class="text-3xl font-bold text-red-500 mt-1">{{ summary.emergency }}</p>
          <p class="text-xs text-gray-400 mt-1">Immediate Action</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm font-medium text-gray-500">Today's Visits</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">{{ summary.todayVisits }}</p>
          <p class="text-xs text-gray-400 mt-1">Scheduled Today</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-sm font-medium text-gray-500">Revenue Impact</p>
          <p class="text-3xl font-bold text-green-600 mt-1">${{ summary.estimatedRevenue.toLocaleString() }}</p>
          <p class="text-xs text-gray-400 mt-1">Pending Revenue</p>
        </div>
      </div>

      <!-- Filter Toolbar -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Search -->
          <div class="flex-1 min-w-[200px]">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search visits..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
          </div>

          <!-- Priority Filter -->
          <select v-model="filters.priority" class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in filterOptions.priorities" :key="option" :value="option === 'All Priorities' ? '' : option">
              {{ option }}
            </option>
          </select>

          <!-- Service Type Filter -->
          <select v-model="filters.serviceType" class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in filterOptions.serviceTypes" :key="option" :value="option === 'All Services' ? '' : option">
              {{ option }}
            </option>
          </select>

          <!-- Date Filter -->
          <select v-model="filters.date" class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in filterOptions.dates" :key="option" :value="option === 'All' ? '' : option">
              {{ option }}
            </option>
          </select>

          <!-- Zone Filter -->
          <select v-model="filters.zone" class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in filterOptions.zones" :key="option" :value="option === 'All Zones' ? '' : option">
              {{ option }}
            </option>
          </select>

          <!-- Group By -->
          <select v-model="groupBy" class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in groupByOptions" :key="option" :value="option === 'None' ? '' : option">
              Group By: {{ option }}
            </option>
          </select>
        </div>
      </div>

      <!-- Bulk Selection Toolbar -->
      <div v-if="selectedVisits.length > 0" class="bg-blue-50 rounded-2xl p-3 mb-4 flex items-center justify-between">
        <span class="font-medium text-blue-700">{{ selectedVisits.length }} Visits Selected</span>
        <div class="flex gap-3">
          <button class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Assign Technician</button>
          <button class="px-3 py-1.5 border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100">Auto Assign</button>
          <button class="px-3 py-1.5 border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100">Create Route</button>
          <button class="px-3 py-1.5 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">Delete</button>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex gap-6">
        <!-- Left Panel: Visit List -->
        <div class="w-7/10">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="divide-y divide-gray-100">
              <div 
                v-for="visit in filteredVisits" 
                :key="visit.id"
                class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                @click="selectedVisit = visit"
              >
                <div class="flex items-start gap-4">
                  <!-- Checkbox -->
                  <input 
                    type="checkbox" 
                    :checked="selectedVisits.includes(visit.id)"
                    @change="toggleSelection(visit.id)"
                    class="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  
                  <!-- Visit Card -->
                  <div class="flex-1">
                    <div class="flex items-start justify-between">
                      <div class="space-y-1">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-mono text-gray-500">{{ visit.id }}</span>
                          <span 
                            class="px-2 py-0.5 text-xs font-medium rounded-full"
                            :class="{
                              'bg-blue-100 text-blue-700': visit.priority === 'Normal',
                              'bg-orange-100 text-orange-700': visit.priority === 'High',
                              'bg-red-100 text-red-700': visit.priority === 'Emergency'
                            }"
                          >
                            {{ visit.priority }}
                          </span>
                          <span class="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                            Awaiting Assignment
                          </span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="text-lg font-semibold text-gray-900">🏊 {{ visit.customer }}</span>
                          <span class="text-sm text-gray-500">• {{ visit.pool }}</span>
                        </div>
                        <div class="flex items-center gap-4 text-sm text-gray-600">
                          <span>📍 {{ visit.address.split(',').pop().trim() }}</span>
                          <span class="text-gray-300">|</span>
                          <span>{{ visit.service }}</span>
                          <span class="text-gray-300">|</span>
                          <span>🕒 {{ visit.scheduled_time }}</span>
                          <span class="text-gray-300">|</span>
                          <span>⏱ {{ visit.duration }}</span>
                          <span class="text-gray-300">|</span>
                          <span class="font-medium text-green-600">💵 ${{ visit.estimated_value }}</span>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <button class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Assign</button>
                        <button class="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">View</button>
                        <button class="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Edit</button>
                        <button class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Assignment Center -->
        <div class="w-3/10 space-y-4">
          <!-- Assignment Summary -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="font-semibold text-gray-900 mb-4">Assignment Summary</h3>
            <div class="text-center mb-4">
              <p class="text-4xl font-bold text-gray-900">{{ visits.length }}</p>
              <p class="text-sm text-gray-500">Visits Pending Assignment</p>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Estimated Revenue:</span>
                <span class="font-semibold text-green-600">${{ summary.estimatedRevenue.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Estimated Hours:</span>
                <span class="font-semibold text-gray-900">22h 40m</span>
              </div>
            </div>
          </div>

          <!-- Available Technicians -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="font-semibold text-gray-900 mb-4">Available Technicians</h3>
            <div class="space-y-3">
              <div 
                v-for="tech in technicians" 
                :key="tech.id"
                class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="font-medium text-gray-900">👤 {{ tech.name }}</p>
                    <p class="text-xs text-gray-500">Zone: {{ tech.zone }}</p>
                  </div>
                  <span 
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-700': tech.status === 'Available',
                      'bg-orange-100 text-orange-700': tech.status === 'Busy',
                      'bg-gray-100 text-gray-700': tech.status === 'Off Duty'
                    }"
                  >
                    {{ tech.status }}
                  </span>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Assigned:</span>
                    <span class="font-medium">{{ tech.visits_assigned }} / {{ tech.capacity }} Visits</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      class="h-1.5 rounded-full transition-all"
                      :class="{
                        'bg-green-500': (tech.visits_assigned / tech.capacity) < 0.7,
                        'bg-orange-500': (tech.visits_assigned / tech.capacity) >= 0.7 && (tech.visits_assigned / tech.capacity) < 0.9,
                        'bg-red-500': (tech.visits_assigned / tech.capacity) >= 0.9
                      }"
                      :style="{ width: `${(tech.visits_assigned / tech.capacity) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Assignment Suggestions -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 class="font-semibold text-gray-900 mb-3">🤖 AI Assignment Suggestions</h3>
            <div class="bg-white rounded-xl p-4 shadow-sm">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Assign John Smith</p>
                  <p class="text-xs text-gray-500">→ Mike Carter</p>
                  <p class="text-xs text-blue-600 mt-1">Reason: Closest Technician</p>
                </div>
                <div class="flex gap-2">
                  <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign</button>
                  <button class="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Ignore</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visit Details Drawer -->
    <div 
      v-if="selectedVisit"
      class="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto"
      :class="selectedVisit ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">Visit Details</h2>
          <button @click="selectedVisit = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Customer Information -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase mb-2">Customer Information</h3>
            <div class="space-y-1">
              <p class="font-medium text-gray-900">{{ selectedVisit.customer }}</p>
              <p class="text-sm text-gray-600">Phone: (555) 123-4567</p>
              <p class="text-sm text-gray-600">Email: customer@example.com</p>
              <p class="text-sm text-gray-600">{{ selectedVisit.address }}</p>
            </div>
          </div>

          <!-- Pool Information -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase mb-2">Pool Information</h3>
            <div class="space-y-1">
              <p class="font-medium text-gray-900">{{ selectedVisit.pool }}</p>
              <p class="text-sm text-gray-600">Type: In-ground</p>
              <p class="text-sm text-gray-600">Water Type: Chlorine</p>
              <p class="text-sm text-gray-600">Size: 20,000 gallons</p>
            </div>
          </div>

          <!-- Visit Information -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase mb-2">Visit Information</h3>
            <div class="space-y-1">
              <p class="text-sm"><span class="text-gray-500">Visit ID:</span> {{ selectedVisit.id }}</p>
              <p class="text-sm"><span class="text-gray-500">Service Type:</span> {{ selectedVisit.service }}</p>
              <p class="text-sm"><span class="text-gray-500">Scheduled Date:</span> {{ selectedVisit.scheduled_date }}</p>
              <p class="text-sm"><span class="text-gray-500">Scheduled Time:</span> {{ selectedVisit.scheduled_time }}</p>
              <p class="text-sm"><span class="text-gray-500">Duration:</span> {{ selectedVisit.duration }}</p>
              <p class="text-sm"><span class="text-gray-500">Priority:</span> {{ selectedVisit.priority }}</p>
            </div>
          </div>

          <!-- Agreement -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase mb-2">Agreement</h3>
            <div class="space-y-1">
              <p class="text-sm"><span class="text-gray-500">Service Plan:</span> Premium Pool Care</p>
              <p class="text-sm"><span class="text-gray-500">Frequency:</span> Weekly</p>
              <p class="text-sm"><span class="text-gray-500">Monthly Value:</span> $720</p>
            </div>
          </div>

          <button class="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Assign Technician
          </button>
        </div>
      </div>
    </div>

    <!-- Assign Technician Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Assign Technician</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Technician</label>
            <select class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
                {{ tech.name }} ({{ tech.status }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
            <input type="time" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea rows="3" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add notes..."></textarea>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button class="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Assign</button>
          <button @click="showAssignModal = false" class="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Auto Assign Modal -->
    <div v-if="showAutoAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Auto Assign Visits</h3>
        <div class="space-y-4">
          <div class="bg-blue-50 rounded-xl p-4">
            <p class="text-sm text-gray-600">{{ visits.length }} Visits Ready</p>
            <p class="text-sm text-gray-600">Available Technicians: {{ technicians.filter(t => t.status === 'Available').length }}</p>
          </div>
          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" checked class="w-4 h-4 text-blue-600">
              <span class="text-sm text-gray-700">Optimize Travel Distance</span>
            </label>
          </div>
          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" checked class="w-4 h-4 text-blue-600">
              <span class="text-sm text-gray-700">Balance Workload</span>
            </label>
          </div>
          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" checked class="w-4 h-4 text-blue-600">
              <span class="text-sm text-gray-700">Prioritize Emergency Visits</span>
            </label>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button class="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Run Assignment</button>
          <button @click="showAutoAssignModal = false" class="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Mock Data
const visits = ref([
  {
    id: 'VIS-1001',
    customer: 'John Smith',
    pool: 'Backyard Pool',
    service: 'Weekly Pool Cleaning',
    address: '245 Ocean Drive, Miami FL',
    scheduled_date: '2026-06-23',
    scheduled_time: '10:00 AM',
    duration: '45 min',
    priority: 'Normal',
    estimated_value: 180
  },
  {
    id: 'VIS-1002',
    customer: 'Sarah Johnson',
    pool: 'Villa Main Pool',
    service: 'Chemical Balance',
    address: '890 Palm Ave, Miami FL',
    scheduled_date: '2026-06-23',
    scheduled_time: '01:00 PM',
    duration: '30 min',
    priority: 'High',
    estimated_value: 240
  },
  {
    id: 'VIS-1003',
    customer: 'Ocean Resort',
    pool: 'Main Hotel Pool',
    service: 'Equipment Inspection',
    address: '500 Beach Road, Miami FL',
    scheduled_date: '2026-06-23',
    scheduled_time: '09:00 AM',
    duration: '90 min',
    priority: 'Emergency',
    estimated_value: 750
  },
  {
    id: 'VIS-1004',
    customer: 'Robert Chen',
    pool: 'Garden Pool',
    service: 'Maintenance',
    address: '123 Oak Street, Miami FL',
    scheduled_date: '2026-06-24',
    scheduled_time: '11:30 AM',
    duration: '60 min',
    priority: 'Normal',
    estimated_value: 220
  },
  {
    id: 'VIS-1005',
    customer: 'Maria Garcia',
    pool: 'Lap Pool',
    service: 'Pool Cleaning',
    address: '456 Palm Drive, Miami FL',
    scheduled_date: '2026-06-24',
    scheduled_time: '02:00 PM',
    duration: '45 min',
    priority: 'High',
    estimated_value: 310
  }
])

const technicians = ref([
  {
    id: 1,
    name: 'Mike Carter',
    status: 'Available',
    visits_assigned: 4,
    capacity: 8,
    zone: 'North'
  },
  {
    id: 2,
    name: 'Alex Green',
    status: 'Available',
    visits_assigned: 6,
    capacity: 8,
    zone: 'South'
  },
  {
    id: 3,
    name: 'David Ross',
    status: 'Busy',
    visits_assigned: 8,
    capacity: 8,
    zone: 'Central'
  },
  {
    id: 4,
    name: 'Lisa Park',
    status: 'Off Duty',
    visits_assigned: 0,
    capacity: 8,
    zone: 'West'
  }
])

// State
const loading = ref(false)
const searchQuery = ref('')
const selectedVisit = ref(null)
const selectedVisits = ref([])
const showAssignModal = ref(false)
const showAutoAssignModal = ref(false)
const groupBy = ref('')

const filters = ref({
  priority: '',
  serviceType: '',
  date: '',
  zone: ''
})

const filterOptions = {
  priorities: ['All Priorities', 'Normal', 'High', 'Emergency'],
  serviceTypes: ['All Services', 'Pool Cleaning', 'Chemical Balance', 'Equipment Inspection', 'Repair', 'Maintenance'],
  dates: ['Today', 'Tomorrow', 'This Week', 'Next Week', 'All'],
  zones: ['All Zones', 'North', 'South', 'East', 'West', 'Central']
}

const groupByOptions = ['None', 'Priority', 'Zone', 'Service Type', 'Date']

// Computed
const summary = computed(() => {
  const total = visits.value.length
  const high = visits.value.filter(v => v.priority === 'High').length
  const emergency = visits.value.filter(v => v.priority === 'Emergency').length
  const today = visits.value.filter(v => v.scheduled_date === '2026-06-23').length
  const revenue = visits.value.reduce((sum, v) => sum + v.estimated_value, 0)
  
  return {
    totalUnassigned: total,
    highPriority: high,
    emergency: emergency,
    todayVisits: today,
    estimatedRevenue: revenue
  }
})

const filteredVisits = computed(() => {
  let result = visits.value

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(v => 
      v.customer.toLowerCase().includes(query) ||
      v.pool.toLowerCase().includes(query) ||
      v.address.toLowerCase().includes(query) ||
      v.id.toLowerCase().includes(query)
    )
  }

  // Priority filter
  if (filters.value.priority) {
    result = result.filter(v => v.priority === filters.value.priority)
  }

  // Service Type filter
  if (filters.value.serviceType) {
    result = result.filter(v => v.service.includes(filters.value.serviceType))
  }

  // Date filter
  if (filters.value.date) {
    const today = new Date().toISOString().split('T')[0]
    if (filters.value.date === 'Today') {
      result = result.filter(v => v.scheduled_date === today)
    } else if (filters.value.date === 'Tomorrow') {
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
      result = result.filter(v => v.scheduled_date === tomorrow)
    }
    // This Week, Next Week, All would have more complex logic
  }

  // Zone filter (mock - using address)
  if (filters.value.zone) {
    result = result.filter(v => v.address.includes(filters.value.zone))
  }

  // Group by
  if (groupBy.value) {
    // Grouping logic would be implemented here
    // For now, just return filtered results
  }

  return result
})

// Methods
const toggleSelection = (visitId) => {
  const index = selectedVisits.value.indexOf(visitId)
  if (index > -1) {
    selectedVisits.value.splice(index, 1)
  } else {
    selectedVisits.value.push(visitId)
  }
}

// API Integration (commented)
// import axios from '@/services/api'
// const fetchUnassignedVisits = async () => {
//   loading.value = true
//   try {
//     const response = await axios.get('/service-visits/unassigned')
//     visits.value = response.data.data
//   } catch(error) {
//     console.error(error)
//   } finally {
//     loading.value = false
//   }
// }

onMounted(() => {
  // fetchUnassignedVisits()
  // Using mock data only
})
</script>

<style scoped>
.w-7\/10 {
  width: 70%;
}

.w-3\/10 {
  width: 30%;
}

@media (max-width: 1024px) {
  .w-7\/10,
  .w-3\/10 {
    width: 100%;
  }
}
</style>
```