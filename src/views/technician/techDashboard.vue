<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Header with Stats -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <i class="ri-tools-fill text-purple-600"></i>
              Technician Dashboard
            </h1>
            <p class="text-gray-600 mt-1">Manage your daily service visits and tasks</p>
          </div>
          <div class="mt-4 md:mt-0 flex items-center gap-3">
            <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-md border border-gray-200">
              <span class="text-gray-600 text-sm">Today's Date:</span>
              <span class="text-gray-800 text-sm font-medium">{{ formattedDate }}</span>
            </div>
            <button @click="handleRefresh" class="bg-white hover:bg-gray-50 rounded-xl px-4 py-2 shadow-md border border-gray-200 text-gray-700 transition-all hover:shadow-lg">
              <i class="ri-refresh-line"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:scale-105">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Today's Visits</p>
              <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.todayVisits }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <i class="ri-calendar-check-line text-2xl text-white"></i>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-sm">
            <span class="text-green-600 font-medium">↑ 12%</span>
            <span class="text-gray-500">vs last week</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:scale-105">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Completed</p>
              <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.completed }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <i class="ri-checkbox-circle-line text-2xl text-white"></i>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-sm">
            <span class="text-green-600 font-medium">↑ 8%</span>
            <span class="text-gray-500">completion rate</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:scale-105">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Pending</p>
              <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.pending }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <i class="ri-time-line text-2xl text-white"></i>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-sm">
            <span class="text-red-600 font-medium">⏳ 3 overdue</span>
            <span class="text-gray-500">need attention</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:scale-105">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Rating</p>
              <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.rating }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
              <i class="ri-star-fill text-2xl text-white"></i>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-sm">
            <span class="text-yellow-600 font-medium">★ 4.8</span>
            <span class="text-gray-500">from 45 reviews</span>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Today's Schedule -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-gray-800">Today's Schedule</h2>
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

            <div class="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              <div v-for="visit in todayVisits" :key="visit.id" 
                   class="p-4 hover:bg-gray-50 transition-colors group">
                <div class="flex items-start gap-4">
                  <!-- Time -->
                  <div class="min-w-[80px]">
                    <span class="text-sm font-semibold text-gray-700">{{ visit.time }}</span>
                  </div>
                  
                  <!-- Status Badge -->
                  <div class="min-w-[100px]">
                    <span :class="getStatusBadgeClass(visit.status)" 
                          class="px-3 py-1 rounded-full text-xs font-semibold">
                      {{ visit.status }}
                    </span>
                  </div>
                  
                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div>
                        <p class="text-gray-800 font-semibold">{{ visit.customer }}</p>
                        <p class="text-gray-500 text-sm">{{ visit.address }}</p>
                        <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded"><i class="ri-home-line mr-1"></i>{{ visit.serviceType }}</span>
                          <span><i class="ri-time-line mr-1"></i>{{ visit.duration }}</span>
                        </div>
                      </div>
                      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button @click="startVisit(visit)" class="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Start Visit">
                          <i class="ri-play-fill text-lg"></i>
                        </button>
                        <button @click="completeVisit(visit)" class="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="Complete">
                          <i class="ri-check-double-line text-lg"></i>
                        </button>
                        <button @click="viewVisitDetails(visit)" class="p-1.5 hover:bg-purple-100 rounded-lg text-purple-600 transition-colors" title="View Details">
                          <i class="ri-eye-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              <button class="p-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl text-white transition-all shadow-lg hover:shadow-xl">
                <i class="ri-add-line text-2xl block"></i>
                <span class="text-xs mt-1 block">New Visit</span>
              </button>
              <button class="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white transition-all shadow-lg hover:shadow-xl">
                <i class="ri-route-line text-2xl block"></i>
                <span class="text-xs mt-1 block">Route</span>
              </button>
              <button class="p-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white transition-all shadow-lg hover:shadow-xl">
                <i class="ri-file-list-line text-2xl block"></i>
                <span class="text-xs mt-1 block">Reports</span>
              </button>
              <button class="p-4 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl text-white transition-all shadow-lg hover:shadow-xl">
                <i class="ri-settings-line text-2xl block"></i>
                <span class="text-xs mt-1 block">Settings</span>
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div class="space-y-4">
              <div v-for="activity in recentActivities" :key="activity.id" 
                   class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
                     :class="getActivityBgClass(activity.type)">
                  <i :class="getActivityIcon(activity.type)" class="text-lg"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-700">{{ activity.description }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Weather / Location -->
          <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Current Location</p>
                <p class="text-white font-medium text-lg">Downtown Area</p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-3xl">☀️</span>
                  <span class="text-white font-bold text-2xl">72°F</span>
                  <span class="text-white/80 text-sm">Sunny</span>
                </div>
              </div>
              <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <i class="ri-map-pin-2-line text-3xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Performance Chart -->
      <div class="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Weekly Performance</h3>
            <p class="text-gray-500 text-sm">Visits completed this week</p>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm shadow-md">Week</button>
            <button class="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">Month</button>
          </div>
        </div>
        <div class="h-64 flex items-end gap-4">
          <div v-for="(day, index) in weeklyData" :key="index" 
               class="flex-1 flex flex-col items-center gap-2 group">
            <div class="w-full max-w-[60px] relative">
              <div class="w-full rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer relative"
                   :style="{ height: `${day.height}%`, minHeight: '20px' }"
                   :class="getGradientColor(index)">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  {{ day.count }} visits
                </div>
              </div>
            </div>
            <span class="text-xs text-gray-500 font-medium">{{ day.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Visit Details Modal -->
    <div v-if="showVisitModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-800">Visit Details</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Customer</label>
              <p class="text-gray-800 font-semibold mt-1">{{ selectedVisit?.customer }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Service Type</label>
              <p class="text-gray-800 font-semibold mt-1">{{ selectedVisit?.serviceType }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Time</label>
              <p class="text-gray-800 font-semibold mt-1">{{ selectedVisit?.time }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Duration</label>
              <p class="text-gray-800 font-semibold mt-1">{{ selectedVisit?.duration }}</p>
            </div>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Address</label>
            <p class="text-gray-800 mt-1">{{ selectedVisit?.address }}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <label class="text-gray-500 text-xs font-medium uppercase tracking-wider">Notes</label>
            <p class="text-gray-600 text-sm mt-1">No additional notes for this visit.</p>
          </div>
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button @click="startVisit(selectedVisit)" class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              <i class="ri-play-fill mr-2"></i>Start Visit
            </button>
            <button @click="completeVisit(selectedVisit)" class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              <i class="ri-check-double-line mr-2"></i>Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../store/AuthStore.js';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../../services/api.js';

const authStore = useAuthStore();
const router = useRouter();

// State
const showVisitModal = ref(false);
const selectedVisit = ref(null);
const loading = ref(false);

// Stats
const stats = ref({
  todayVisits: 8,
  completed: 124,
  pending: 6,
  rating: '4.8'
});

// Today's Visits
const todayVisits = ref([
  {
    id: 1,
    customer: 'Sarah Johnson',
    address: '123 Maple Street, Apt 4B',
    time: '09:00 AM',
    status: 'pending',
    serviceType: 'Pool Cleaning',
    duration: '1.5 hrs'
  },
  {
    id: 2,
    customer: 'Michael Chen',
    address: '456 Oak Avenue',
    time: '10:30 AM',
    status: 'in-progress',
    serviceType: 'Chemical Treatment',
    duration: '2 hrs'
  },
  {
    id: 3,
    customer: 'Emily Rodriguez',
    address: '789 Pine Road',
    time: '01:00 PM',
    status: 'completed',
    serviceType: 'Equipment Repair',
    duration: '1 hr'
  },
  {
    id: 4,
    customer: 'David Kim',
    address: '321 Cedar Lane',
    time: '02:30 PM',
    status: 'pending',
    serviceType: 'Pool Inspection',
    duration: '1.5 hrs'
  },
  {
    id: 5,
    customer: 'Lisa Thompson',
    address: '654 Birch Boulevard',
    time: '04:00 PM',
    status: 'pending',
    serviceType: 'Deep Cleaning',
    duration: '2.5 hrs'
  }
]);

// Recent Activities
const recentActivities = ref([
  {
    id: 1,
    type: 'completed',
    description: 'Completed service at Sarah Johnson\'s pool',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'started',
    description: 'Started chemical treatment at Michael Chen\'s pool',
    time: '3 hours ago'
  },
  {
    id: 3,
    type: 'note',
    description: 'Added service notes for Emily Rodriguez',
    time: '5 hours ago'
  },
  {
    id: 4,
    type: 'schedule',
    description: 'New visit scheduled for tomorrow at 9:00 AM',
    time: '6 hours ago'
  }
]);

// Weekly Performance Data
const weeklyData = ref([
  { label: 'Mon', count: 5, height: 60 },
  { label: 'Tue', count: 7, height: 75 },
  { label: 'Wed', count: 4, height: 45 },
  { label: 'Thu', count: 8, height: 85 },
  { label: 'Fri', count: 6, height: 65 },
  { label: 'Sat', count: 3, height: 35 },
  { label: 'Sun', count: 2, height: 25 }
]);

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

// Methods
const getStatusBadgeClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-700 border border-blue-200',
    'completed': 'bg-green-100 text-green-700 border border-green-200',
    'cancelled': 'bg-red-100 text-red-700 border border-red-200'
  };
  return classes[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
};

const getGradientColor = (index) => {
  const colors = [
    'bg-gradient-to-t from-purple-400 to-purple-500',
    'bg-gradient-to-t from-blue-400 to-blue-500',
    'bg-gradient-to-t from-green-400 to-green-500',
    'bg-gradient-to-t from-yellow-400 to-yellow-500',
    'bg-gradient-to-t from-orange-400 to-orange-500',
    'bg-gradient-to-t from-red-400 to-red-500',
    'bg-gradient-to-t from-pink-400 to-pink-500'
  ];
  return colors[index % colors.length];
};

const getActivityBgClass = (type) => {
  const classes = {
    'completed': 'bg-green-100',
    'started': 'bg-blue-100',
    'note': 'bg-purple-100',
    'schedule': 'bg-yellow-100'
  };
  return classes[type] || 'bg-gray-100';
};

const getActivityIcon = (type) => {
  const icons = {
    'completed': 'ri-check-double-line text-green-600',
    'started': 'ri-play-fill text-blue-600',
    'note': 'ri-file-text-line text-purple-600',
    'schedule': 'ri-calendar-line text-yellow-600'
  };
  return icons[type] || 'ri-information-line text-gray-600';
};

const startVisit = (visit) => {
  if (!visit) return;
  Swal.fire({
    icon: 'info',
    title: 'Start Visit',
    text: `Starting service at ${visit.customer}'s location...`,
    confirmButtonColor: '#8b5cf6',
    confirmButtonText: 'Start Now',
    showCancelButton: true,
    cancelButtonColor: '#6b7280',
    background: '#ffffff',
    color: '#1f2937',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Visit Started',
        text: `Service at ${visit.customer}'s location has been started!`,
        confirmButtonColor: '#8b5cf6',
        timer: 2000,
        timerProgressBar: true,
      });
      closeModal();
    }
  });
};

const completeVisit = (visit) => {
  if (!visit) return;
  Swal.fire({
    icon: 'question',
    title: 'Complete Visit',
    text: `Mark this service at ${visit.customer}'s location as completed?`,
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'Yes, Complete',
    showCancelButton: true,
    cancelButtonColor: '#6b7280',
    background: '#ffffff',
    color: '#1f2937',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Visit Completed',
        text: `Service at ${visit.customer}'s location completed successfully!`,
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true,
      });
      closeModal();
    }
  });
};

const viewVisitDetails = (visit) => {
  selectedVisit.value = visit;
  showVisitModal.value = true;
};

const closeModal = () => {
  showVisitModal.value = false;
  selectedVisit.value = null;
};

const handleRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    Swal.fire({
      icon: 'success',
      title: 'Refreshed',
      text: 'Dashboard data updated successfully!',
      confirmButtonColor: '#8b5cf6',
      background: '#ffffff',
      color: '#1f2937',
      timer: 1500,
      timerProgressBar: true,
    });
  }, 1000);
};

// Check authentication
// onMounted(() => {
//   if (!authStore.isAuthenticated || authStore.userType !== 'technician') {
//     router.push('/login');
//   }
// });
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
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c4b5fd;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a78bfa;
}

/* Hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Card hover animations */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Gradient backgrounds for bars */
.bg-gradient-to-t {
  background-image: linear-gradient(to top, var(--tw-gradient-stops));
}
</style>