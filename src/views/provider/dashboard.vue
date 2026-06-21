<template>
  <div class="space-y-6  px-2">
    <!-- 1. Dashboard Header -->
    <section class="relative overflow-hidden bg-gradient-to-r from-[#0284C7] to-[#06B6D4] rounded-2xl p-8 text-white shadow-lg">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
      
      <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-1">Good Morning, PoolCare Solutions 👋</h1>
          <p class="text-blue-50 text-lg">Here is what's happening with your pool operations today.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button class="px-6 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-medium transition-all duration-200 flex items-center gap-2">
            <span class="text-xl">+</span> Add Pool
          </button>
          <button class="px-6 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-medium transition-all duration-200 flex items-center gap-2">
            <span class="text-xl">+</span> Create Service Request
          </button>
        </div>
      </div>
    </section>

    <!-- 2. Statistics Cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div v-for="stat in statistics" :key="stat.label" 
           class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stat.value }}</p>
            <p class="text-xs mt-2" :class="stat.trend > 0 ? 'text-emerald-600' : 'text-red-500'">
              {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}% from last month
            </p>
          </div>
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" 
               :style="{ backgroundColor: stat.iconBg }">
            {{ stat.icon }}
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Pool Management Overview -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800">Pool Overview</h2>
        <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm">View All →</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="status in poolStatus" :key="status.label" 
             class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p class="text-gray-500 text-sm font-medium">{{ status.label }}</p>
          <p class="text-3xl font-bold text-gray-800 mt-1">{{ status.count }}</p>
          <div class="w-full h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" 
                 :style="{ width: status.percentage + '%', backgroundColor: status.color }"></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ status.percentage }}% of total</p>
        </div>
      </div>
    </section>

    <!-- 4. Upcoming Maintenance Schedule -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800">Upcoming Maintenance</h2>
        <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm">View Calendar →</button>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th v-for="col in ['Customer', 'Pool', 'Service Type', 'Assigned Technician', 'Date', 'Status']" 
                    :key="col" 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in maintenanceSchedule" :key="item.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ item.customer }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ item.pool }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ item.serviceType }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ item.technician }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ item.date }}</td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 text-xs font-medium rounded-full"
                        :class="{
                          'bg-blue-100 text-blue-700': item.status === 'Scheduled',
                          'bg-yellow-100 text-yellow-700': item.status === 'In Progress',
                          'bg-emerald-100 text-emerald-700': item.status === 'Completed',
                          'bg-red-100 text-red-700': item.status === 'Cancelled'
                        }">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 5. Service Requests + Revenue Analytics -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Service Requests -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">Recent Service Requests</h2>
          <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm">View All →</button>
        </div>
        <div class="space-y-3">
          <div v-for="request in serviceRequests" :key="request.id" 
               class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h4 class="font-semibold text-gray-800">{{ request.customer }}</h4>
                <p class="text-sm text-gray-500">{{ request.address }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ request.issue }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 text-xs font-medium rounded-full"
                      :class="{
                        'bg-red-100 text-red-700': request.priority === 'High',
                        'bg-yellow-100 text-yellow-700': request.priority === 'Medium',
                        'bg-emerald-100 text-emerald-700': request.priority === 'Low'
                      }">
                  {{ request.priority }}
                </span>
                <span class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                  {{ request.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Analytics -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">Revenue Overview</h2>
          <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm">View Details →</button>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500">Monthly Revenue</p>
              <p class="text-2xl font-bold text-gray-800">$24,500</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Completed Jobs</p>
              <p class="text-2xl font-bold text-gray-800">184</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Pending Invoices</p>
              <p class="text-2xl font-bold text-gray-800">$8,320</p>
            </div>
          </div>
          
          <!-- Fake Chart -->
          <div class="space-y-3">
            <div v-for="(item, index) in [
              { label: 'Jan', amount: 18500 },
              { label: 'Feb', amount: 19200 },
              { label: 'Mar', amount: 20400 },
              { label: 'Apr', amount: 21800 },
              { label: 'May', amount: 22800 },
              { label: 'Jun', amount: 24500 }
            ]" :key="item.label" class="flex items-center gap-4">
              <span class="text-sm font-medium text-gray-600 w-8">{{ item.label }}</span>
              <div class="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div class="h-full rounded-lg transition-all duration-500"
                     :style="{ 
                       width: (item.amount / 25000 * 100) + '%',
                       backgroundColor: index === 5 ? '#0284C7' : '#06B6D4'
                     }">
                </div>
              </div>
              <span class="text-sm font-medium text-gray-700 w-16 text-right">${{ (item.amount/1000).toFixed(1) }}k</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Water Quality + Technician Activity -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Water Quality -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">Water Quality Status</h2>
          <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm">View Reports →</button>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div v-for="quality in waterQuality" :key="quality.name" class="space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-800">{{ quality.name }}</p>
                <p class="text-sm text-gray-500">{{ quality.value }}</p>
              </div>
              <span class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-emerald-100 text-emerald-700': quality.status === 'Normal' || quality.status === 'Good',
                      'bg-yellow-100 text-yellow-700': quality.status === 'Warning'
                    }">
                {{ quality.status }}
              </span>
            </div>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500"
                   :style="{ 
                     width: quality.percentage + '%',
                     backgroundColor: quality.status === 'Normal' || quality.status === 'Good' ? '#10B981' : '#F59E0B'
                   }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technician Activity -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">Technician Activity</h2>
          <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm">View All →</button>
        </div>
        <div class="space-y-3">
          <div v-for="tech in technicians" :key="tech.name" 
               class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#0284C7] to-[#06B6D4] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {{ tech.name.charAt(0) }}
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800">{{ tech.name }}</h4>
              <p class="text-sm text-gray-500">{{ tech.services }} completed today</p>
              <p class="text-xs text-gray-400 mt-1">{{ tech.task }}</p>
            </div>
            <span class="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
              {{ tech.status }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. Customer Overview -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800">Recent Customers</h2>
        <button class="text-[#0284C7] hover:text-[#06B6D4] font-medium text-sm">View All Customers →</button>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th v-for="col in ['Customer', 'Pools', 'Last Service', 'Next Appointment']" 
                    :key="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="customer in customers" :key="customer.name" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ customer.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ customer.pools }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ customer.lastService }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ customer.nextAppointment }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 10. Quick Actions -->
    <section>
      <h2 class="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="action in quickActions" :key="action.label"
             class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#06B6D4] flex items-center justify-center text-3xl text-white mb-3 group-hover:scale-110 transition-transform duration-200">
            {{ action.icon }}
          </div>
          <p class="font-medium text-gray-800 text-sm">{{ action.label }}</p>
        </div>
      </div>
    </section>

    <!-- 11. Empty States (commented out as they're for demonstration) -->
    <!-- 
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <div class="text-6xl mb-4">🏊</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No pools added yet</h3>
      <p class="text-gray-500 mb-6">Start by adding your first pool to begin tracking maintenance.</p>
      <button class="px-6 py-2.5 bg-[#0284C7] text-white rounded-xl hover:bg-[#06B6D4] transition-colors font-medium">
        Add Pool
      </button>
    </div>
    -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 2. Statistics Cards
const statistics = ref([
  {
    label: 'Total Pools',
    value: '245',
    icon: '🏊',
    iconBg: '#DBEAFE',
    trend: 12
  },
  {
    label: 'Upcoming Services',
    value: '32',
    icon: '📅',
    iconBg: '#FEF3C7',
    trend: 8
  },
  {
    label: 'Pending Requests',
    value: '18',
    icon: '📋',
    iconBg: '#FEE2E2',
    trend: -3
  },
  {
    label: 'Monthly Revenue',
    value: '$24,500',
    icon: '💰',
    iconBg: '#D1FAE5',
    trend: 15
  },
  {
    label: 'Active Technicians',
    value: '12',
    icon: '👥',
    iconBg: '#E0E7FF',
    trend: 5
  },
  {
    label: 'Customer Satisfaction',
    value: '98%',
    icon: '⭐',
    iconBg: '#FDE68A',
    trend: 2
  }
])

// 3. Pool Status
const poolStatus = ref([
  {
    label: 'Total Pools',
    count: 245,
    percentage: 100,
    color: '#0284C7'
  },
  {
    label: 'Healthy Pools',
    count: 220,
    percentage: 90,
    color: '#10B981'
  },
  {
    label: 'Needs Attention',
    count: 15,
    percentage: 6,
    color: '#F59E0B'
  },
  {
    label: 'Maintenance Due',
    count: 10,
    percentage: 4,
    color: '#EF4444'
  }
])

// 4. Upcoming Maintenance Schedule
const maintenanceSchedule = ref([
  {
    id: 1,
    customer: 'John Smith',
    pool: 'Residential Pool',
    serviceType: 'Chemical Check',
    technician: 'Mike',
    date: 'June 25, 2026',
    status: 'Scheduled'
  },
  {
    id: 2,
    customer: 'Sarah Johnson',
    pool: 'Commercial Pool',
    serviceType: 'Filter Cleaning',
    technician: 'Ahmed',
    date: 'June 26, 2026',
    status: 'Scheduled'
  },
  {
    id: 3,
    customer: 'Robert Chen',
    pool: 'Residential Pool',
    serviceType: 'Water Balance',
    technician: 'Maria',
    date: 'June 24, 2026',
    status: 'In Progress'
  },
  {
    id: 4,
    customer: 'Emily Davis',
    pool: 'Hotel Pool',
    serviceType: 'Pump Repair',
    technician: 'James',
    date: 'June 23, 2026',
    status: 'Completed'
  }
])

// 5. Service Requests
const serviceRequests = ref([
  {
    id: 1,
    customer: 'Michael Brown',
    address: '123 Main St, Anytown',
    issue: 'Heater not working',
    priority: 'High',
    status: 'Open'
  },
  {
    id: 2,
    customer: 'Lisa Anderson',
    address: '456 Oak Ave, Somewhere',
    issue: 'Cloudy water',
    priority: 'Medium',
    status: 'In Progress'
  },
  {
    id: 3,
    customer: 'David Wilson',
    address: '789 Pine Rd, Elsewhere',
    issue: 'Leaking filter',
    priority: 'Low',
    status: 'Open'
  }
])

// 7. Water Quality
const waterQuality = ref([
  {
    name: 'pH Level',
    value: '7.4 (Normal)',
    status: 'Normal',
    percentage: 74
  },
  {
    name: 'Chlorine',
    value: '2.5 ppm (Normal)',
    status: 'Normal',
    percentage: 83
  },
  {
    name: 'Alkalinity',
    value: '120 ppm (Good)',
    status: 'Good',
    percentage: 92
  }
])

// 8. Technicians
const technicians = ref([
  {
    name: 'Ahmed',
    services: 5,
    task: 'Working on John Smith\'s pool',
    status: 'Active'
  },
  {
    name: 'Maria',
    services: 4,
    task: 'Water testing at Hotel Pool',
    status: 'Active'
  },
  {
    name: 'James',
    services: 3,
    task: 'On break until 2pm',
    status: 'Available'
  }
])

// 9. Customers
const customers = ref([
  {
    name: 'John Smith',
    pools: '2',
    lastService: 'June 22, 2026',
    nextAppointment: 'July 15, 2026'
  },
  {
    name: 'Sarah Johnson',
    pools: '1',
    lastService: 'June 20, 2026',
    nextAppointment: 'July 10, 2026'
  },
  {
    name: 'Robert Chen',
    pools: '3',
    lastService: 'June 18, 2026',
    nextAppointment: 'July 5, 2026'
  },
  {
    name: 'Emily Davis',
    pools: '1',
    lastService: 'June 15, 2026',
    nextAppointment: 'July 20, 2026'
  }
])

// 10. Quick Actions
const quickActions = ref([
  {
    icon: '➕',
    label: 'Add New Pool'
  },
  {
    icon: '📋',
    label: 'Create Schedule'
  },
  {
    icon: '👤',
    label: 'Add Customer'
  },
  {
    icon: '🧾',
    label: 'Generate Invoice'
  },
  {
    icon: '📊',
    label: 'View Reports'
  }
])
</script>

<style scoped>
/* Smooth animations and custom styles */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Scrollbar styling for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>