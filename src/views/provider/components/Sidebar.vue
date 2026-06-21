<template>
  <div class="bg-slate-300 w-96 py-4 px-2 min-h-screen border-r border-gray-200">
    <div class="bg-[#a4cef125] p-2 h-full flex flex-col font-semibold">
      <!-- Header with Company Info -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-sm">
        <h4 class="font-bold text-center text-sm text-sky-700 mb-3 pb-2 border-b border-sky-100">
          Pool Service Provider Dashboard
        </h4>
        <div class="flex flex-col items-center gap-2">
          <div class="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
            {{ companyInitials }}
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-800">{{ companyName }}</p>
            <p class="text-xs text-gray-500">Provider Dashboard</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Link -->
      <router-link to="/provider" active-class="bg-sky-100 text-sky-700"
        class="flex items-center justify-center mb-4 bg-white text-sky-600 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
        <i class="ri-dashboard-line mr-2"></i>
        Dashboard
      </router-link>

      <!-- Loading State -->
      <div v-if="isSidebarLoading" class="flex flex-col gap-2 my-2">
        <div v-for="i in 5" :key="i" class="h-10 bg-white/40 rounded-lg animate-pulse"></div>
      </div>

      <!-- Main Menu Items -->
      <div class="space-y-2">
        <div v-for="menu in menus" :key="menu.id" class="accordion-group bg-transparent rounded-xl">
          <!-- Menu Header -->
          <div class="flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300"
            :class="dropdownHeaderClass" @click="toggleAccordion(menu.id)"
            :style="{
              backgroundColor: openSection === menu.id ? getMenuColor(menu.title) : 'white',
              color: openSection === menu.id ? 'white' : getMenuColor(menu.title),
              border: `2px solid ${getMenuColor(menu.title)}`
            }">
            <div class="flex items-center gap-3">
              <i class="py-1 px-2 rounded-md" 
                :class="`${menu.icon}`"
                :style="{
                  backgroundColor: getMenuColor(menu.title),
                  color: 'white'
                }"></i>
              <span>{{ menu.title }}</span>
            </div>
            <i class="ri-arrow-down-s-line transition-transform duration-300"
              :class="{ 'rotate-180': openSection === menu.id }"
              :style="{
                color: openSection === menu.id ? 'white' : getMenuColor(menu.title)
              }"></i>
          </div>

          <!-- Dropdown Content -->
          <div v-show="openSection === menu.id" class="ml-4 mt-1 space-y-1 border-l-2 pl-3"
            :style="{ borderColor: getMenuColor(menu.title) }">
            <router-link v-for="link in menu.links" :key="link.to" :to="link.to"
              class="flex items-center gap-2 p-2 text-sm rounded-lg transition-all duration-300"
              :class="dropdownItemClass" active-class="router-link-active"
              :style="{
                color: getMenuColor(menu.title),
                borderLeft: `3px solid transparent`
              }"
              active-class-style="router-link-active-provider"
              @click="setActiveLink(menu.title, link.text)">
              <i class="py-1 px-2 rounded-md text-white" 
                :class="`${link.icon}`"
                :style="{
                  backgroundColor: getMenuColor(menu.title)
                }"></i>
              <span class="block max-w-[160px] truncate whitespace-nowrap" :title="link.text">
                {{ link.text }}
              </span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- LOGOUT -->
      <button type="button"
        class="py-3 px-6 mt-6 w-full bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-semibold transition-all duration-300 hover:from-red-700 hover:to-pink-700 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
        @click="authStore.logout(), router.push('/login/adminLogin')">
        <i class="ri-logout-box-r-line"></i>
        Log Out
      </button>

      <div class="flex flex-col gap-2 overflow-hidden mt-4"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../store/AuthStore.js'

const dropdownHeaderClass = 'bg-white text-blue-800 hover:bg-blue-50 shadow-md'
const dropdownItemClass = 'bg-white text-blue-800 hover:bg-blue-50'

const authStore = useAuthStore()
const router = useRouter()
const openSection = ref('')
const isSidebarLoading = ref(false)

// Get company info from auth store
const companyName = computed(() => {
  return authStore?.user?.company_name || authStore?.user?.name || 'PoolCare Solutions'
})

const companyInitials = computed(() => {
  const name = companyName.value
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Menu Colors Configuration
const menuColors = {
  'My Pools': '#0ea5e9', // sky-500
  'Customers': '#10b981', // emerald-500
  'Service Management': '#f97316', // orange-500
  'Maintenance Schedule': '#3b82f6', // blue-500
  'Service Requests': '#8b5cf6', // violet-500
  'Technician Management': '#06b6d4', // cyan-500
  'Water Quality Monitoring': '#14b8a6', // teal-500
  'Invoice & Payments': '#10b981', // emerald-500
  'Reports & Analytics': '#6366f1', // indigo-500
  'Messages / Communication': '#f43f5e', // rose-500
  'Provider Profile': '#6b7280', // gray-500
}

// Function to get menu color with fallback
const getMenuColor = (menuTitle) => {
  // Try exact match first
  if (menuColors[menuTitle]) return menuColors[menuTitle];
  
  // Fallback: check if any key is a prefix of the title
  const matchedKey = Object.keys(menuColors).find(key => menuTitle.startsWith(key));
  if (matchedKey) return menuColors[matchedKey];
  
  return '#6B7280'; // default gray
}

// Track active menu item for styling
const activeMenu = ref('')

const setActiveLink = (menuTitle, linkText) => {
  activeMenu.value = `${menuTitle}-${linkText}`
}

function toggleAccordion(name) {
  if (openSection.value === name) {
    openSection.value = ''
  } else {
    openSection.value = name
  }
}

// Sidebar Menu Configuration
const menus = [
  {
    id: 'my-pools',
    title: 'My Pools',
    icon: 'ri-water-flash-line',
    links: [
      { to: '/provider/pools', icon: 'ri-list-unordered', text: 'All Pools' },
      { to: '/provider/pools/create', icon: 'ri-add-circle-line', text: 'Add New Pool' },
      { to: '/provider/pools/active', icon: 'ri-checkbox-circle-line', text: 'Active Pools' },
      { to: '/provider/pools/maintenance', icon: 'ri-tools-line', text: 'Maintenance Required' }
    ]
  },
  {
    id: 'customers',
    title: 'Customers',
    icon: 'ri-user-community-line',
    links: [
      { to: '/provider/customers', icon: 'ri-list-unordered', text: 'All Customers' },
      { to: '/provider/customers/create', icon: 'ri-user-add-line', text: 'Add Customer' },
      { to: '/provider/customers/requests', icon: 'ri-mail-send-line', text: 'Customer Requests' }
    ]
  },
  {
    id: 'service-management',
    title: 'Service Management',
    icon: 'ri-tools-line',
    links: [
      { to: '/provider/services', icon: 'ri-list-unordered', text: 'Service List' },
      { to: '/provider/services/create', icon: 'ri-add-circle-line', text: 'Create Service' },
      { to: '/provider/services/categories', icon: 'ri-grid-line', text: 'Service Categories' }
    ]
  },
  {
    id: 'maintenance-schedule',
    title: 'Maintenance Schedule',
    icon: 'ri-calendar-check-line',
    links: [
      { to: '/provider/maintenance/calendar', icon: 'ri-calendar-2-line', text: 'Calendar View' },
      { to: '/provider/maintenance/upcoming', icon: 'ri-time-line', text: 'Upcoming Maintenance' },
      { to: '/provider/maintenance/completed', icon: 'ri-check-double-line', text: 'Completed Maintenance' }
    ]
  },
  {
    id: 'service-requests',
    title: 'Service Requests',
    icon: 'ri-mail-send-line',
    links: [
      { to: '/provider/service-request/new', icon: 'ri-mail-line', text: 'New Requests' },
      { to: '/provider/service-request/assigned', icon: 'ri-user-shared-line', text: 'Assigned Requests' },
      { to: '/provider/service-request/completed', icon: 'ri-checkbox-circle-line', text: 'Completed Requests' }
    ]
  },
  {
    id: 'technician-management',
    title: 'Technician Management',
    icon: 'ri-team-line',
    links: [
      { to: '/provider/technicians', icon: 'ri-list-unordered', text: 'All Technicians' },
      { to: '/provider/technicians/create', icon: 'ri-user-add-line', text: 'Add Technician' },
      { to: '/provider/technicians/schedule', icon: 'ri-calendar-line', text: 'Technician Schedule' }
    ]
  },
  {
    id: 'water-quality',
    title: 'Water Quality Monitoring',
    icon: 'ri-drop-line',
    links: [
      { to: '/provider/water-quality', icon: 'ri-file-chart-line', text: 'Water Quality Reports' },
      { to: '/provider/chemicals', icon: 'ri-flask-line', text: 'Chemical Tracking' },
      { to: '/provider/equipment', icon: 'ri-hard-drive-line', text: 'Equipment Status' }
    ]
  },
  {
    id: 'invoices-payments',
    title: 'Invoice & Payments',
    icon: 'ri-file-list-3-line',
    links: [
      { to: '/provider/invoices', icon: 'ri-file-list-line', text: 'Invoices' },
      { to: '/provider/invoices/create', icon: 'ri-file-add-line', text: 'Create Invoice' },
      { to: '/provider/payments', icon: 'ri-bank-card-line', text: 'Payment History' }
    ]
  },
  {
    id: 'reports-analytics',
    title: 'Reports & Analytics',
    icon: 'ri-bar-chart-line',
    links: [
      { to: '/provider/reports/services', icon: 'ri-bar-chart-2-line', text: 'Service Reports' },
      { to: '/provider/reports/revenue', icon: 'ri-money-dollar-circle-line', text: 'Revenue Reports' },
      { to: '/provider/reports/customers', icon: 'ri-user-line', text: 'Customer Reports' }
    ]
  },
  {
    id: 'messages',
    title: 'Messages / Communication',
    icon: 'ri-chat-3-line',
    links: [
      { to: '/provider/messages', icon: 'ri-mail-line', text: 'Customer Messages' },
      { to: '/provider/notifications', icon: 'ri-notification-3-line', text: 'Notifications' }
    ]
  },
  {
    id: 'provider-profile',
    title: 'Provider Profile',
    icon: 'ri-settings-3-line',
    links: [
      { to: '/provider/profile', icon: 'ri-store-line', text: 'Business Profile' },
      { to: '/provider/profile/service-area', icon: 'ri-map-pin-2-line', text: 'Service Area' },
      { to: '/provider/settings', icon: 'ri-settings-line', text: 'Settings' }
    ]
  }
]

onMounted(() => {
  // Any initialization logic can go here
})
</script>

<style scoped>
.router-link-active {
  background-color: #f0f9ff;
  border-left: 3px solid #0ea5e9 !important;
  border-radius: 0.375rem;
  padding: 0.5rem;
  transition: background-color 0.3s, color 0.3s;
}

/* Custom active class for provider links */
.router-link-active-provider {
  background-color: #f0f9ff;
  border-left: 3px solid #0ea5e9 !important;
  border-radius: 0.375rem;
  padding: 0.5rem;
  transition: background-color 0.3s, color 0.3s;
}

/* Hover effects for menu items */
.accordion-group:hover .menu-header {
  transform: translateX(2px);
}

/* Smooth transitions */
.accordion-group {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar for dropdown */
.ml-4 {
  max-height: 300px;
  overflow-y: auto;
}

.ml-4::-webkit-scrollbar {
  width: 4px;
}

.ml-4::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.ml-4::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.ml-4::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>