<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-6 md:py-8">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <i class="ri-tools-fill text-white text-xl"></i>
              </div>
              Technician Dashboard
            </h1>
            <p class="text-gray-600 mt-1 text-sm md:text-base">Manage your daily service visits and tasks</p>
          </div>
          
          <div class="flex flex-wrap items-center gap-3">
            <!-- Technician Info -->
            <div class="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-white/50">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                {{ getInitials(technician.name) }}
              </div>
              <div class="hidden sm:block">
                <p class="text-sm font-semibold text-gray-800">{{ technician.name }}</p>
                <p class="text-xs text-gray-500">{{ technician.email }}</p>
              </div>
            </div>

            <!-- Date -->
            <div class="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-white/50">
              <i class="ri-calendar-line text-purple-600"></i>
              <span class="text-sm font-medium text-gray-700">{{ formattedDate }}</span>
            </div>

            <!-- Refresh Button -->
            <button @click="handleRefresh"
              :disabled="refreshing"
              class="bg-white hover:bg-gray-50 rounded-xl px-4 py-2 shadow-md border border-white/50 text-gray-700 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="ri-refresh-line" :class="{ 'animate-spin': refreshing }"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Statistics Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div v-for="(stat, index) in statCards" :key="index"
          class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">{{ stat.label }}</p>
              <p class="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{{ stat.value }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
              :class="stat.iconBg">
              <i :class="stat.icon" class="text-xl text-white"></i>
            </div>
          </div>
          <div v-if="stat.change" class="mt-4 flex items-center gap-2 text-xs">
            <span :class="stat.changePositive ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ stat.change }}
            </span>
            <span class="text-gray-500">vs last week</span>
          </div>
        </div>
      </section>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Today's Visits -->
        <section class="lg:col-span-2">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div class="p-6 border-b border-gray-200/50">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-gray-800">Today's Visits</h2>
                  <p class="text-gray-500 text-sm mt-1">{{ todayVisits.length }} visits scheduled</p>
                </div>
                <div class="flex gap-2">
                  <button class="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors">
                    <i class="ri-list-view"></i> List
                  </button>
                  <button class="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    <i class="ri-calendar-2-line"></i> Calendar
                  </button>
                </div>
              </div>
            </div>

            <div class="divide-y divide-gray-100/50 max-h-[600px] overflow-y-auto">
              <!-- Empty State -->
              <div v-if="todayVisits.length === 0" class="p-8 text-center">
                <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i class="ri-calendar-check-line text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">No visits today</h3>
                <p class="text-gray-500 text-sm">You're all caught up! Enjoy your day.</p>
              </div>

              <!-- Visit Cards -->
              <div v-for="visit in todayVisits" :key="visit.id" 
                class="p-4 hover:bg-gray-50/50 transition-colors group">
                <div class="flex flex-col sm:flex-row sm:items-start gap-3">
                  <!-- Time -->
                  <div class="min-w-[80px]">
                    <span class="text-sm font-semibold text-gray-700">{{ formatTime(visit.scheduled_time) }}</span>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="text-gray-800 font-semibold">{{ visit.pool?.customer?.name || 'Unknown Customer' }}</p>
                          <span :class="getPriorityBadgeClass(visit.priority)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                            {{ visit.priority || 'Normal' }}
                          </span>
                          <span v-if="visit.work_order" class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            <i class="ri-file-list-line mr-1"></i>WO #{{ visit.work_order.id }}
                          </span>
                        </div>
                        <p class="text-gray-500 text-sm mt-1">{{ visit.pool?.service_address || 'No address provided' }}</p>
                        <div class="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                          <span v-if="visit.pool?.customer?.phone" class="flex items-center gap-1">
                            <i class="ri-phone-line"></i> {{ visit.pool.customer.phone }}
                          </span>
                          <span v-if="visit.pool?.customer?.email" class="flex items-center gap-1">
                            <i class="ri-mail-line"></i> {{ visit.pool.customer.email }}
                          </span>
                          <span v-if="visit.work_order?.type" class="bg-gray-100 px-2 py-0.5 rounded">
                            {{ visit.work_order.type }}
                          </span>
                        </div>
                      </div>
                      
                      <div class="flex flex-wrap items-center gap-2">
                        <!-- Status Badge -->
                        <span :class="getStatusBadgeClass(visit.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                          {{ visit.status }}
                        </span>
                        
                        <!-- Action Buttons -->
                        <div class="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button @click="viewVisitDetails(visit)" 
                            class="p-1.5 hover:bg-purple-100 rounded-lg text-purple-600 transition-colors" title="View Details">
                            <i class="ri-eye-line text-lg"></i>
                          </button>
                          
                          <button v-if="visit.work_order" 
                            @click="performService(visit.work_order.id)" 
                            class="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Perform Service">
                            <i class="ri-tools-line text-lg"></i>
                          </button>
                          
                          <button v-if="visit.pool?.customer?.phone" 
                            @click="callCustomer(visit.pool.customer.phone)" 
                            class="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="Call Customer">
                            <i class="ri-phone-line text-lg"></i>
                          </button>
                          
                          <button v-if="visit.pool?.service_address" 
                            @click="openMap(visit.pool.service_address)" 
                            class="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Navigate">
                            <i class="ri-map-pin-2-line text-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Right Sidebar -->
        <aside class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              <button @click="navigateTo('new-visit')"
                class="p-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <i class="ri-add-line text-2xl block"></i>
                <span class="text-xs mt-1 block">New Visit</span>
              </button>
              <button @click="navigateTo('route')"
                class="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <i class="ri-route-line text-2xl block"></i>
                <span class="text-xs mt-1 block">Route</span>
              </button>
              <button @click="navigateTo('reports')"
                class="p-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <i class="ri-file-list-line text-2xl block"></i>
                <span class="text-xs mt-1 block">Reports</span>
              </button>
              <button @click="navigateTo('settings')"
                class="p-4 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <i class="ri-settings-line text-2xl block"></i>
                <span class="text-xs mt-1 block">Settings</span>
              </button>
            </div>
          </div>

          <!-- Upcoming Visits -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Upcoming Visits</h3>
            <div v-if="upcomingVisits.length === 0" class="text-center py-6">
              <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <i class="ri-calendar-2-line text-2xl text-gray-400"></i>
              </div>
              <p class="text-gray-600 font-medium">No upcoming visits</p>
              <p class="text-gray-400 text-sm">Your schedule is clear for now</p>
            </div>
            <div v-for="visit in upcomingVisits.slice(0, 3)" :key="visit.id" class="mb-3 last:mb-0 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ visit.pool?.customer?.name || 'Unknown' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ formatDate(visit.scheduled_date) }}</p>
                  <p class="text-xs text-gray-500">{{ formatTime(visit.scheduled_time) }}</p>
                </div>
                <span :class="getStatusBadgeClass(visit.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                  {{ visit.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Recent Work Orders -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Work Orders</h3>
            <div v-if="recentWorkOrders.length === 0" class="text-center py-6">
              <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <i class="ri-file-list-line text-2xl text-gray-400"></i>
              </div>
              <p class="text-gray-600 font-medium">No work orders</p>
              <p class="text-gray-400 text-sm">Recent work orders will appear here</p>
            </div>
            <div v-for="order in recentWorkOrders.slice(0, 3)" :key="order.id" class="mb-3 last:mb-0 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-semibold text-gray-800 truncate">WO #{{ order.id }}</p>
                    <span :class="getWorkOrderTypeBadge(order.type)" class="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                      {{ order.type || 'Routine' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5 truncate">{{ order.pool?.name || 'Unknown Pool' }}</p>
                  <div v-if="order.checklist" class="mt-1">
                    <span class="text-xs text-gray-600">{{ order.checklist.completed }}/{{ order.checklist.total }} checklist items</span>
                  </div>
                  <p v-if="order.notes" class="text-xs text-gray-400 mt-0.5 truncate">{{ order.notes }}</p>
                </div>
                <span :class="getWorkOrderStatusBadge(order.status)" class="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                  {{ order.status || 'Created' }}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Visit Details Modal -->
    <div v-if="showVisitModal" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 class="text-xl font-semibold text-gray-800">Visit Details</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Customer</label>
              <p class="text-gray-800 font-semibold mt-1">{{ selectedVisit?.pool?.customer?.name || 'N/A' }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Status</label>
              <p class="mt-1"><span :class="getStatusBadgeClass(selectedVisit?.status)" class="px-3 py-1 rounded-full text-xs font-semibold">{{ selectedVisit?.status || 'N/A' }}</span></p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Scheduled Time</label>
              <p class="text-gray-800 font-semibold mt-1">{{ selectedVisit ? formatTime(selectedVisit.scheduled_time) : 'N/A' }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Priority</label>
              <p class="mt-1"><span :class="getPriorityBadgeClass(selectedVisit?.priority)" class="px-3 py-1 rounded-full text-xs font-semibold">{{ selectedVisit?.priority || 'Normal' }}</span></p>
            </div>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Service Address</label>
            <p class="text-gray-800 mt-1">{{ selectedVisit?.pool?.service_address || 'N/A' }}</p>
          </div>
          <div v-if="selectedVisit?.pool?.customer" class="bg-gray-50 p-3 rounded-lg">
            <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Contact Information</label>
            <div class="mt-1 space-y-1">
              <p v-if="selectedVisit.pool.customer.phone" class="text-gray-800"><i class="ri-phone-line mr-2"></i>{{ selectedVisit.pool.customer.phone }}</p>
              <p v-if="selectedVisit.pool.customer.email" class="text-gray-800"><i class="ri-mail-line mr-2"></i>{{ selectedVisit.pool.customer.email }}</p>
            </div>
          </div>
          <div v-if="selectedVisit?.work_order" class="bg-gray-50 p-3 rounded-lg">
            <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Work Order</label>
            <div class="mt-1">
              <p class="text-gray-800 font-semibold">WO #{{ selectedVisit.work_order.id }}</p>
              <p class="text-gray-600 text-sm">{{ selectedVisit.work_order.type || 'Routine' }}</p>
              <button @click="performService(selectedVisit.work_order.id)" 
                class="mt-2 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
                <i class="ri-tools-line mr-2"></i>Perform Service
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button v-if="selectedVisit?.pool?.customer?.phone" 
              @click="callCustomer(selectedVisit.pool.customer.phone)" 
              class="flex-1 min-w-[100px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              <i class="ri-phone-line mr-2"></i>Call
            </button>
            <button v-if="selectedVisit?.pool?.service_address" 
              @click="openMap(selectedVisit.pool.service_address)" 
              class="flex-1 min-w-[100px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              <i class="ri-map-pin-2-line mr-2"></i>Navigate
            </button>
            <button @click="closeModal" 
              class="flex-1 min-w-[100px] bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../../../store/AuthStore.js';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../../../../services/api.js';

const authStore = useAuthStore();
const router = useRouter();

// State
const loading = ref(true);
const refreshing = ref(false);
const showVisitModal = ref(false);
const selectedVisit = ref(null);

// Dashboard Data
const technician = ref({
  name: 'Loading...',
  email: 'loading@example.com',
  phone: 'Loading...'
});

const stats = ref({
  today_visits: 0,
  completed_today: 0,
  scheduled_visits: 0,
  pending_work_orders: 0,
  this_week_visits: 0,
  completed_this_week: 0,
  completion_rate: 0
});

const todayVisits = ref([]);
const upcomingVisits = ref([]);
const recentWorkOrders = ref([]);

// Computed
const formattedDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const statCards = computed(() => [
  {
    label: "Today's Visits",
    value: stats.value.today_visits,
    icon: 'ri-calendar-check-line',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    change: '+12%',
    changePositive: true
  },
  {
    label: 'Completed Today',
    value: stats.value.completed_today,
    icon: 'ri-checkbox-circle-line',
    iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
    change: '+8%',
    changePositive: true
  },
  {
    label: 'Scheduled Visits',
    value: stats.value.scheduled_visits,
    icon: 'ri-calendar-event-line',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    change: '-5%',
    changePositive: false
  },
  {
    label: 'Pending Work Orders',
    value: stats.value.pending_work_orders,
    icon: 'ri-time-line',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    change: '+3 overdue',
    changePositive: false
  },
  {
    label: 'Weekly Visits',
    value: stats.value.this_week_visits,
    icon: 'ri-bar-chart-line',
    iconBg: 'bg-gradient-to-br from-pink-500 to-pink-600',
    change: '+15%',
    changePositive: true
  },
  {
    label: 'Completed This Week',
    value: stats.value.completed_this_week,
    icon: 'ri-check-double-line',
    iconBg: 'bg-gradient-to-br from-teal-500 to-teal-600',
    change: '+10%',
    changePositive: true
  },
  {
    label: 'Completion Rate',
    value: `${stats.value.completion_rate}%`,
    icon: 'ri-percent-line',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    change: '+5%',
    changePositive: true
  }
]);

// Methods
const getInitials = (name) => {
  if (!name) return 'T';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatTime = (time) => {
  if (!time) return 'N/A';
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return date;
  }
};

const getStatusBadgeClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'scheduled': 'bg-blue-100 text-blue-700 border border-blue-200',
    'in-progress': 'bg-purple-100 text-purple-700 border border-purple-200',
    'completed': 'bg-green-100 text-green-700 border border-green-200',
    'cancelled': 'bg-red-100 text-red-700 border border-red-200',
    'created': 'bg-gray-100 text-gray-700 border border-gray-200'
  };
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border border-gray-200';
};

const getPriorityBadgeClass = (priority) => {
  const classes = {
    'normal': 'bg-blue-100 text-blue-700 border border-blue-200',
    'high': 'bg-orange-100 text-orange-700 border border-orange-200',
    'urgent': 'bg-red-100 text-red-700 border border-red-200'
  };
  return classes[priority?.toLowerCase()] || 'bg-blue-100 text-blue-700 border border-blue-200';
};

const getWorkOrderTypeBadge = (type) => {
  const classes = {
    'routine': 'bg-green-100 text-green-700 border border-green-200',
    'repair': 'bg-red-100 text-red-700 border border-red-200',
    'installation': 'bg-blue-100 text-blue-700 border border-blue-200',
    'inspection': 'bg-purple-100 text-purple-700 border border-purple-200',
    'one-time': 'bg-orange-100 text-orange-700 border border-orange-200'
  };
  return classes[type?.toLowerCase()] || 'bg-gray-100 text-gray-700 border border-gray-200';
};

const getWorkOrderStatusBadge = (status) => {
  const classes = {
    'created': 'bg-gray-100 text-gray-700 border border-gray-200',
    'scheduled': 'bg-blue-100 text-blue-700 border border-blue-200',
    'in-progress': 'bg-purple-100 text-purple-700 border border-purple-200',
    'completed': 'bg-green-100 text-green-700 border border-green-200',
    'cancelled': 'bg-red-100 text-red-700 border border-red-200'
  };
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border border-gray-200';
};

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    const response = await api().get('/technician-portal/dashboard');
    
    if (response.data) {
      const data = response.data?.data ?? {};
      
      // Set technician info
      if (data.technician) {
        technician.value = {
          name: data.technician.name || 'Technician',
          email: data.technician.email || 'N/A',
          phone: data.technician.phone || 'N/A'
        };
      }
      
      // Set stats
      if (data.stats) {
        stats.value = {
          today_visits: data.stats.today_visits || 0,
          completed_today: data.stats.completed_today || 0,
          scheduled_visits: data.stats.scheduled_visits || 0,
          pending_work_orders: data.stats.pending_work_orders || 0,
          this_week_visits: data.stats.this_week_visits || 0,
          completed_this_week: data.stats.completed_this_week || 0,
          completion_rate: data.stats.completion_rate || 0
        };
      }
      
      // Set today's visits
      todayVisits.value = data.today_visits || [];
      
      // Set upcoming visits
      upcomingVisits.value = data.upcoming_visits || [];
      
      // Set recent work orders
      recentWorkOrders.value = data.recent_work_orders || [];
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load dashboard data. Please try again.',
      confirmButtonColor: '#8b5cf6',
      background: '#ffffff',
      color: '#1f2937'
    });
  } finally {
    loading.value = false;
  }
};

const handleRefresh = async () => {
  if (refreshing.value) return;
  
  refreshing.value = true;
  try {
    await fetchDashboardData();
    await Swal.fire({
      icon: 'success',
      title: 'Refreshed',
      text: 'Dashboard data updated successfully!',
      confirmButtonColor: '#8b5cf6',
      background: '#ffffff',
      color: '#1f2937',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error refreshing dashboard:', error);
  } finally {
    refreshing.value = false;
  }
};

const viewVisitDetails = (visit) => {
  selectedVisit.value = visit;
  showVisitModal.value = true;
};

const closeModal = () => {
  showVisitModal.value = false;
  selectedVisit.value = null;
};

const performService = (workOrderId) => {
  if (!workOrderId) {
    Swal.fire({
      icon: 'warning',
      title: 'No Work Order',
      text: 'This visit does not have an associated work order.',
      confirmButtonColor: '#8b5cf6'
    });
    return;
  }
  
  closeModal();
  router.push(`/technician/perform-service/${workOrderId}`);
};

const callCustomer = (phone) => {
  if (!phone) return;
  window.location.href = `tel:${phone}`;
};

const openMap = (address) => {
  if (!address) return;
  const encodedAddress = encodeURIComponent(address);
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
};

const navigateTo = (route) => {
  router.push(`/technician/${route}`);
};

// Lifecycle
onMounted(async () => {
  // // Check authentication
  // if (!authStore.isAuthenticated || authStore.userType != 'technician') {
  //   router.push('/login');
  //   return;
  // }
  
  await fetchDashboardData();
});
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(196, 181, 253, 0.8);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(167, 139, 250, 1);
}

/* Hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Card hover animations */
.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

.hover\:-translate-y-0\.5:hover {
  transform: translateY(-0.125rem);
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Glassmorphism backdrop */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>