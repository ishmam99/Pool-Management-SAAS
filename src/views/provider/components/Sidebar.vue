<template>
  <div class="bg-slate-300 w-100 py-4 px-2 min-h-screen border-r border-gray-200">
    <div class="bg-[#a4cef125] p-2 h-full flex flex-col font-semibold">
      <!-- Header with Company Info -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-sm">
        <h4 class="font-bold text-center text-sm text-sky-700 mb-3 pb-2 border-b border-sky-100">
          Pool Service Provider Dashboard
        </h4>
        <div class="flex flex-col items-center gap-2">
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
            {{ companyInitials }}
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-800">{{ companyName }}</p>
            <p class="text-xs text-gray-500">Tenant Dashboard</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Link -->
      <router-link to="/provider/dashboard" active-class="bg-sky-100 text-sky-700"
        class="flex items-center justify-center mb-4 bg-white text-sky-600 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
        <i class="ri-dashboard-line mr-2"></i>
        Dashboard
      </router-link>

      <!-- Loading State -->
      <div v-if="isSidebarLoading" class="flex flex-col gap-2 my-2">
        <div v-for="i in 5" :key="i" class="h-10 bg-white/40 rounded-lg animate-pulse"></div>
      </div>

      <!-- Main Menu Items -->
      <div class="space-y-2 flex-1 overflow-y-auto">
        <div v-for="menu in menus" :key="menu.id" class="accordion-group bg-transparent rounded-xl">
          <!-- Menu Header -->
          <div
            class="flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 cursor-pointer"
            :class="dropdownHeaderClass" @click="toggleAccordion(menu.id)" :style="{
              backgroundColor: openSection === menu.id ? getMenuColor(menu.title) : 'white',
              color: openSection === menu.id ? 'white' : getMenuColor(menu.title),
              border: `2px solid ${getMenuColor(menu.title)}`
            }">
            <div class="flex items-center gap-3">
              <i class="py-1 px-2 rounded-md" :class="`${menu.icon}`" :style="{
                backgroundColor: getMenuColor(menu.title),
                color: 'white'
              }"></i>
              <span>{{ menu.title }}</span>
            </div>
            <i class="ri-arrow-down-s-line transition-transform duration-300"
              :class="{ 'rotate-180': openSection === menu.id }" :style="{
                color: openSection === menu.id ? 'white' : getMenuColor(menu.title)
              }"></i>
          </div>

          <!-- Dropdown Content -->
          <div v-show="openSection === menu.id" class="ml-4 mt-1 space-y-1 border-l-2 pl-3"
            :style="{ borderColor: getMenuColor(menu.title) }">
            <!-- Regular links (non-grouped) -->
            <router-link v-for="link in menu.links" :key="link.to" :to="link.to"
              class="flex items-center gap-2 p-2 text-sm rounded-lg transition-all duration-300"
              :class="dropdownItemClass" active-class="router-link-active" :style="{
                color: getMenuColor(menu.title),
                borderLeft: `3px solid transparent`
              }" @click="setActiveLink(menu.title, link.text)">
              <i class="py-1 px-2 rounded-md text-white" :class="`${link.icon}`" :style="{
                backgroundColor: getMenuColor(menu.title)
              }"></i>
              <span class="block max-w-[220px] truncate whitespace-nowrap" :title="link.text">
                {{ link.text }}
              </span>
            </router-link>
            <!-- Render Groups -->
            <template v-for="group in menu.groups" :key="group.key">
              <!-- Group Header (with toggle for sub-items) -->
              <div
                class="flex items-center justify-between w-full p-2 text-sm rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200"
                :style="{
                  backgroundColor: openSection === group.key ? getMenuColor(group.title) : 'white',
                  color: openSection === group.key ? 'white' : getMenuColor(group.title),
                  border: `2px solid ${getMenuColor(group.title)}`
                }" @click="toggleGroup(group.key)">
                <div class="flex items-center gap-2">
                  <i class="py-1 px-2 rounded-md text-white text-xs" :class="`${group.icon}`" :style="{
                    backgroundColor: getMenuColor(group.title)
                  }"></i>
                  <span class="text-sm" :style="{
                    color: openSection === group.key ? 'white' : getMenuColor(group.title)
                  }">{{ group.title }}</span>
                </div>

                <i class="ri-arrow-down-s-line transition-transform duration-300 text-xs"
                  :class="{ 'rotate-180': openGroup === group.key }" :style="{
                    color: openSection === group.key ? 'white' : getMenuColor(group.title)
                  }"></i>
              </div>
              <!-- Group Sub-items -->
              <div v-show="openGroup === group.key" class="ml-2 mt-1 space-y-1 border-l-2 pl-3"
                :style="{ borderColor: getMenuColor(menu.title) }">
                <router-link v-for="link in group.links" :key="link.to" :to="link.to"
                  class="flex items-center gap-2 p-2 text-sm rounded-lg transition-all duration-300"
                  :class="dropdownItemClass" active-class="router-link-active" :style="{
                    color: getMenuColor(menu.title),
                    borderLeft: `3px solid transparent`
                  }" @click="setActiveLink(menu.title, link.text)">
                  <i class="py-1 px-2 rounded-md text-white text-[5px]" :class="`${link.icon}`" :style="{
                    backgroundColor: getMenuColor(menu.title)
                  }"></i>
                  <span class="block max-w-[210px]  text-xs truncate whitespace-nowrap" :title="link.text">
                    {{ link.text }}
                  </span>
                </router-link>
              </div>
            </template>


          </div>
        </div>
      </div>

      <!-- LOGOUT -->
      <button type="button"
        class="py-3 px-6 mt-4 w-full bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-semibold transition-all duration-300 hover:from-red-700 hover:to-pink-700 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
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
const openGroup = ref('')
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
  'Customers': '#10b981',
  'Pools': '#0ea5e9',
  'Service Management': '#f97316',
  'Maintenance Management': '#3b82f6',
  'Technicians': '#8b5cf6',
  'Water Quality Monitoring': '#14b8a6',
  'Inventory': '#f59e0b',
  'Billing': '#06b6d4',
  'Communication': '#ec4899',
  'Customer Portal': '#6366f1',
  'Reports': '#ef4444',
  'Team': '#6b7280',
  'Company': '#4f46e5',
  'Settings': '#6b7280',

  // Agreements
  'Services & Agreements': '#50BEC8',
  'Maintenance Agreements': '#8E790D',

  // Service Management
  'Service Schedule': '#16a34a',      // Green
  'Perform Service': '#2563eb',       // Blue

  // Reserved (currently unused)
  'Invoice': '#a855f7',               // Purple
  'Maintenace List': '#f43f5e',               // Rose
  'Maintenace Schedule': '#f97316',               // Orange
  'All Customer': '#0f766e',               // Teal
  'Blank 5': '#7c3aed',               // Indigo
  'Blank 6': '#ca8a04',               // Yellow
}

// Function to get menu color with fallback
const getMenuColor = (menuTitle) => {
  if (menuColors[menuTitle]) return menuColors[menuTitle];
  const matchedKey = Object.keys(menuColors).find(key => menuTitle.startsWith(key));
  if (matchedKey) return menuColors[matchedKey];
  return '#6B7280';
}

// Track active menu item for styling
const activeMenu = ref('')

const setActiveLink = (menuTitle, linkText) => {
  activeMenu.value = `${menuTitle}-${linkText}`
}

function toggleAccordion(name) {
  if (openSection.value === name) {
    openSection.value = ''
    openGroup.value = '' // Close any open group when closing section
  } else {
    openSection.value = name
  }
}

function toggleGroup(key) {
  if (openGroup.value === key) {
    openGroup.value = ''
  } else {
    openGroup.value = key
  }
}

// Sidebar Menu Configuration - Complete Structure with Groups
const menus = [
  {
    id: 'customers',
    title: 'Customers',
    icon: 'ri-user-community-line',

    links: [
          { to: '/provider/customer-create', icon: 'ri-user-add-line', text: 'Add New Customer' },

    ],
    groups: [
      {
        key: 'customer-all-customer',
        icon: 'ri-group-line',
        title: 'All Customers',
        links: [
          { to: '/provider/customers/prospective', icon: 'ri-list-unordered', text: 'Prospective Customers' },
          { to: '/provider/customers/current', icon: 'ri-list-unordered', text: 'Current Customers' },
          { to: '/provider/customers/previous', icon: 'ri-list-unordered', text: 'Previous Customers' },
        ]
      },
      {
        key: 'customer-service-agreement',
        icon: 'ri-file-text-line',
        title: 'Services & Agreements',
        links: [
          { to: '/provider/customer-add-serivice-customer', icon: 'ri-file-add-line', text: 'Add Service' },
          { to: '/provider/customer-add-terms-customer', icon: 'ri-file-add-line', text: 'Add Terms and Conditions' },
          { to: '/provider/customer-service', icon: 'ri-file-add-line', text: 'Create Service' },
          { to: '/provider/customer-service-terms-and-conditions', icon: 'ri-file-add-line', text: 'Create Terms and Conditions' },
          // { to: '/provider/customer-service-agreements-create', icon: 'ri-file-add-line', text: 'Create Agreement' },
          { to: '/provider/customer-service-agreements', icon: 'ri-file-text-line', text: 'Service Agreements' },
        ]
      },
      {
        key: 'customer-maintenance-agreement',
        icon: 'ri-file-text-line',
        title: 'Maintenance Agreements',
        links: [
          { to: '/provider/customer-maintenance-agreements-create', icon: 'ri-file-add-line', text: 'Create Agreement' },
          { to: '/provider/customer-maintenance-agreements', icon: 'ri-file-text-line', text: 'Maintenance Agreements' },
        ]
      }

    ]
  },
  {
    id: 'pools',
    title: 'Pools',
    icon: 'ri-water-flash-line',
    groups: [],
    links: [
      { to: '/provider/pools-create', icon: 'ri-list-unordered', text: 'Add Pools' },
      { to: '/provider/pools', icon: 'ri-list-unordered', text: 'All Pools' },
      { to: '/provider/pools-types', icon: 'ri-grid-line', text: 'By Type' },
      { to: '/provider/pools-equipment', icon: 'ri-tools-line', text: 'Equipment Register' },
      // { to: '/provider/pools-map', icon: 'ri-map-2-line', text: 'Pool Map View' }
    ]
  },
  {
    id: 'service-management',
    title: 'Service Management',
    icon: 'ri-calendar-check-line',
    groups: [
      {
        key: 'service-management-schedule',
        icon: 'ri-file-text-line',
        title: 'Service Schedule',
        links: [
          { to: '/provider/services-calendar', icon: 'ri-calendar-2-line', text: 'Service Schedule Calendar View' },
          { to: '/provider/services-list', icon: 'ri-user-unfollow-line', text: 'Service Schedule List View' },
        ]
      },
      {
        key: 'service-management-perform-service',
        icon: 'ri-file-text-line',
        title: 'Perform Service',
        links: [
          { to: '/provider/services-perform-service-by-pool', icon: 'ri-file-add-line', text: 'Perform Service by Pool' },
          { to: '/provider/services-perform-service-today', icon: 'ri-file-text-line', text: 'Perform Service Today' },
        ]
      }

    ],

  },
  {
    id: 'maintenance-management',
    title: 'Maintenance Management',
    icon: 'ri-tools-line',

    links: [
      { to: '/provider/schedule-maintenance', icon: 'ri-check-double-line', text: 'Create Schedule Maintenance' },
    ],
    groups: [
      {
        key: 'maintenance-management-schedule',
        icon: 'ri-file-text-line',
        title: 'Maintenace Schedule',
        links: [
          { to: '/provider/maintenance-calendar', icon: 'ri-calendar-2-line', text: 'Maintenace Schedule Calendar View' },
          { to: '/provider/maintenance-unassigned', icon: 'ri-user-unfollow-line', text: 'Maintenace Schedule List View' },
        ]
      },
      {
        key: 'maintenance-management-list',
        icon: 'ri-file-text-line',
        title: 'Maintenace List',
        links: [
          { to: '/provider/maintenance/repair', icon: 'ri-error-warning-line', text: 'Repair Maintenance' },
          { to: '/provider/maintenance/installation', icon: 'ri-error-warning-line', text: 'Installation Maintenance' },
          { to: '/provider/maintenance/requested', icon: 'ri-mail-send-line', text: 'Requested Maintenance' }, // inspection
          { to: '/provider/maintenance/recommended', icon: 'ri-lightbulb-line', text: 'Recommended Maintenance' }, // one time
          { to: '/provider/maintenance/emergency', icon: 'ri-alarm-warning-line', text: 'Emergency Maintenance' } // emergency
        ]
      }

    ],
  },
  {
    id: 'technicians',
    title: 'Technicians',
    icon: 'ri-team-line',
    groups: [],
    links: [
      { to: '/provider/technicians/new', icon: 'ri-user-add-line', text: 'Add New Technician' },
      { to: '/provider/technicians', icon: 'ri-list-unordered', text: 'Technician List' },
    ]
  },
  {
    id: 'water-quality',
    title: 'Water Quality Monitoring',
    icon: 'ri-drop-line',
    groups: [],
    links: [
      { to: '/provider/water-quality/readings', icon: 'ri-file-chart-line', text: 'Chemical Readings Log' },
      { to: '/provider/water-quality/chemicals', icon: 'ri-flask-line', text: 'Chemical Usage' },
      { to: '/provider/water-quality/alerts', icon: 'ri-notification-3-line', text: 'Alerts' },
      { to: '/provider/water-quality/dosing', icon: 'ri-calculator-line', text: 'Dosing Calculator' }
    ]
  },
  // {
  //   id: 'inventory',
  //   title: 'Inventory',
  //   icon: 'ri-store-3-fill',
  //   groups: [],
  //   links: [
  //     { to: '/provider/inventory/warehouse', icon: 'ri-building-4-line', text: 'Warehouse' },
  //     { to: '/provider/inventory/truck-stock', icon: 'ri-truck-line', text: 'Truck Stock' },
  //     { to: '/provider/inventory/purchase-orders', icon: 'ri-file-list-3-line', text: 'Purchase Orders' },
  //     { to: '/provider/inventory/suppliers', icon: 'ri-store-3-line', text: 'Suppliers' },
  //     { to: '/provider/inventory/low-stock', icon: 'ri-alert-line', text: 'Low Stock Alerts' }
  //   ]
  // },
  {
    id: 'billing',
    title: 'Billing',
    icon: 'ri-bank-card-line',
    groups: [
      {
        key: 'billing-invoice',
        icon: 'ri-file-text-line',
        title: 'Invoice',
        links: [
          { to: '/provider/billing/invoices/create', icon: 'ri-add-circle-line', text: 'Create Invoice' },
          { to: '/provider/billing/invoices', icon: 'ri-file-list-line', text: 'Invoice List' },
        ]
      },
      {
        key: 'billing-payments',
        icon: 'ri-money-dollar-circle-line',
        title: 'Payments',
        links: [
          { to: '/provider/billing/payments', icon: 'ri-money-dollar-circle-line', text: 'Payment List' },
          { to: '/provider/billing/payment-methods', icon: 'ri-bank-card-line', text: 'Payment Methods' },
        ]
      },
    ],
    links: []
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: 'ri-chat-3-line',
    groups: [],
    links: [
      { to: '/provider/communication/inbox', icon: 'ri-mail-line', text: 'Inbox' },
      { to: '/provider/communication/notifications', icon: 'ri-notification-3-line', text: 'Notifications' },
      // { to: '/provider/communication/templates', icon: 'ri-file-copy-line', text: 'Templates' },
      // { to: '/provider/communication/bulk', icon: 'ri-send-plane-line', text: 'Bulk Send' }
    ]
  },
  // {
  //   id: 'customer-portal',
  //   title: 'Customer Portal',
  //   icon: 'ri-global-line',
  //   groups: [],
  //   links: [
  //     { to: '/provider/portal/branding', icon: 'ri-palette-line', text: 'Branding' },
  //     { to: '/provider/portal/content', icon: 'ri-edit-2-line', text: 'Content' },
  //     { to: '/provider/portal/preview', icon: 'ri-eye-line', text: 'Preview' }
  //   ]
  // },
  {
    id: 'reports',
    title: 'Reports',
    icon: 'ri-bar-chart-2-line',
    groups: [],
    links: [
      { to: '/provider/reports/revenue', icon: 'ri-money-dollar-box-line', text: 'Revenue' },
      // { to: '/provider/reports/ar-aging', icon: 'ri-time-line', text: 'AR Aging' },
      { to: '/provider/reports/technician-performance', icon: 'ri-user-star-line', text: 'Technician Performance' },
      // { to: '/provider/reports/route-efficiency', icon: 'ri-road-map-line', text: 'Route Efficiency' },
      // { to: '/provider/reports/tax', icon: 'ri-taxi-line', text: 'Tax Reports' }
    ]
  },
  {
    id: 'team',
    title: 'Team',
    icon: 'ri-group-line',
    groups: [],
    links: [
      { to: '/provider/team/users', icon: 'ri-user-3-line', text: 'Users' },
      { to: '/provider/team/roles', icon: 'ri-shield-keyhole-line', text: 'Roles & Permissions' },
      { to: '/provider/team/activity', icon: 'ri-history-line', text: 'Activity Logs' }
    ]
  },
  {
    id: 'company',
    title: 'Company',
    icon: 'ri-building-line',
    groups: [],
    links: [
      { to: '/provider/company/profile', icon: 'ri-store-line', text: 'Profile' },
      // { to: '/provider/company/pricing', icon: 'ri-price-tag-3-line', text: 'Pricing' },
      // { to: '/provider/company/service-areas', icon: 'ri-map-pin-2-line', text: 'Service Areas' },
      // { to: '/provider/company/subscription', icon: 'ri-subscription-line', text: 'Subscription' }
    ]
  },
  // {
  //   id: 'settings',
  //   title: 'Settings',
  //   icon: 'ri-settings-3-line',
  //   groups: [],
  //   links: [
  //     { to: '/provider/settings/general', icon: 'ri-settings-2-line', text: 'General' },
  //     { to: '/provider/settings/email-sms', icon: 'ri-mail-send-line', text: 'Email / SMS' },
  //     { to: '/provider/settings/tax', icon: 'ri-taxi-line', text: 'Tax' },
  //     { to: '/provider/settings/payment-gateway', icon: 'ri-bank-card-line', text: 'Payment Gateway' },
  //     { to: '/provider/settings/import-export', icon: 'ri-upload-download-line', text: 'Import / Export' }
  //   ]
  // }
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

/* Ensure sidebar content doesn't overflow */
.overflow-y-auto {
  overflow-y: auto;
  flex: 1;
}

/* Nested items styling */
.ml-6 {
  margin-left: 1.5rem;
}

.ml-6 .router-link {
  font-size: 0.8rem;
  padding-left: 0.5rem;
}

/* Adjust spacing for nested items */
.ml-6 .router-link i {
  font-size: 0.75rem;
}

/* Group header styling */
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Make sidebar narrower for better fit */
.w-80 {
  width: 20rem;
}

@media (max-width: 768px) {
  .w-80 {
    width: 100%;
    max-width: 280px;
  }
}
</style>