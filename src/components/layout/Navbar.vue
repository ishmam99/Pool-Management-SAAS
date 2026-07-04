<template>
  <nav
    class="bg-cyan-50 backdrop-blur-[20px] border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] sticky top-0 z-50 transition-all duration-300 hover:bg-white/95">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between px-20 items-center h-20">
        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0 group">
          <div class="flex items-center gap-3">
            <div
              class="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-600 to-red-700 p-[2px] transition-all duration-300 shadow-[0_4px_12px_rgba(220,38,38,0.3)] hover:scale-105 hover:rotate-[-5deg] hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
              <img src="/src/assets/logo.png" alt="Eagle Martial Arts"
                class="w-full h-full object-cover rounded-full bg-white">
            </div>
            <div class="flex flex-col leading-tight">
              <span class="text-xl font-extrabold text-red-600 tracking-tight">Pool Management</span>
              <span class="text-[0.65rem] font-semibold text-gray-500 tracking-wider uppercase">SaaS</span>
            </div>
          </div>
        </router-link>
        <!-- {{ authStore.layout }} -->
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link to="/"
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]">
            Home
          </router-link>

          <router-link to="/about"
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]">
            About Us
          </router-link>

          <router-link to="/blogs"
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]">
            Blog
          </router-link>

          <router-link to="/features"
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]">
            Features
          </router-link>

          <router-link to="/join-us"
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]">
            Join Us
          </router-link>

          <!-- Dashboard Link -->
          <router-link v-if="authStore.isAuthenticated" :to="authStore.currentDashboard || '/'"
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]">
            Dashboard
          </router-link>
        </div>

        <!-- Right side: auth & layout controls -->
        <div class="flex gap-2 items-center">
          <template v-if="authStore.isAuthenticated">
            <!-- Layout Toggle Group – only for providers -->
            <div v-if="authStore.authType === 'provider'"
              class="flex items-center space-x-1 ml-2 border-l border-gray-200 pl-3">
              <!-- General Layout -->
              <button @click="setLayout('general')"
                class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border-2" :class="selectedLayout === 'general'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                  : 'bg-transparent text-gray-600 border-gray-300 hover:bg-emerald-50/50 hover:border-emerald-300'">
                General Layout
              </button>

              <!-- Customer Layout -->
              <button @click="setLayout('customer')"
                class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border-2" :class="selectedLayout === 'customer'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                  : 'bg-transparent text-gray-600 border-gray-300 hover:bg-emerald-50/50 hover:border-emerald-300'">
                Customer Layout
              </button>

              <!-- Select Customer (visible only when Customer Layout is active) -->
             <div v-if="selectedLayout === 'customer'" class="relative">
  <button 
    @click="toggleSelectCustomerDropdown"
    class="px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 bg-white border-2 shadow-sm hover:shadow-md"
    :class="[
      selectedCustomer 
        ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50' 
        : 'border-gray-300 text-gray-600 hover:border-emerald-400 hover:text-emerald-600'
    ]"
  >
    <UserIcon class="w-4 h-4" />
    <span>{{ selectedCustomer ? selectedCustomer.contact_name : 'Select Customer' }}</span>
    <ChevronDownIcon 
      class="w-4 h-4 transition-transform duration-200 ml-1"
      :class="{ 'rotate-180': isCustomerDropdownOpen }"
    />
  </button>

  <!-- Dropdown -->
  <div 
    v-if="isCustomerDropdownOpen"
    class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden z-50 backdrop-blur-sm animate-slideDown"
  >
    <!-- Search Input -->
    <div class="p-3 border-b border-gray-100">
      <div class="relative">
        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="customerSearch"
          type="text"
          placeholder="Search customers..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
        />
      </div>
    </div>

    <!-- Customer List -->
    <div class="p-2 max-h-72 overflow-y-auto custom-scrollbar">
      <div v-if="customerLoading" class="text-center py-6">
        <div class="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-2 text-sm text-gray-500">Loading customers...</p>
      </div>
      
      <div v-else-if="filteredCustomers.length === 0" class="text-center py-8">
        <UsersIcon class="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p class="text-sm text-gray-500">No customers found</p>
      </div>

      <button 
        v-for="customer in filteredCustomers" 
        :key="customer.id" 
        @click="selectCustomer(customer)"
        class="w-full text-left px-4 py-3 rounded-xl transition-all duration-150 flex items-center gap-3 group"
        :class="[
          authStore.customerId === customer.id
            ? 'bg-emerald-50/80 ring-2 ring-emerald-500/30 shadow-sm'
            : 'hover:bg-gray-50/80'
        ]"
      >
        <!-- Avatar -->
        <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
          :class="[
            authStore.customerId === customer.id
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-200 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
          ]"
        >
          {{ getInitials(customer.contact_name) }}
        </div>

        <div class="flex-1 min-w-0">
          <div class="font-medium text-gray-800 truncate flex items-center gap-2">
            {{ customer.contact_name }}
            <span v-if="authStore.customerId === customer.id" class="flex-shrink-0">
              <CheckIcon class="w-4 h-4 text-emerald-600" />
            </span>
          </div>
          <div class="text-xs text-gray-500 truncate flex items-center gap-1">
            <BuildingIcon class="w-3 h-3" />
            {{ customer.company_name || 'No company' }}
          </div>
        </div>

        <!-- Status Badge -->
        <div class="flex-shrink-0">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="[
              customer.status === 'active'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-500'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full mr-1"
              :class="[
                customer.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
              ]"
            ></span>
            {{ customer.status || 'Active' }}
          </span>
        </div>
      </button>
    </div>

    <!-- Footer -->
    <div class="p-2 border-t border-gray-100 bg-gray-50/50">
      <button 
        @click="clearCustomerSelection"
        class="w-full text-center text-xs text-gray-500 hover:text-red-600 transition-colors duration-200 py-1.5 rounded-lg hover:bg-red-50"
        v-if="authStore.customerId"
      >
        Clear Selection
      </button>
    </div>
  </div>
</div>
            </div>

            <!-- Logout Button – always visible for authenticated users -->
            <button @click="handleLogout"
              class="px-4 py-2 font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(220,38,38,0.4)]">
              Logout
            </button>
          </template>

          <!-- Login Link (when not authenticated) -->
          <router-link v-else to="/login"
            class="px-4 py-2 font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(220,38,38,0.4)]">
            Login
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu"
          class="md:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-red-50/50"
          aria-label="Toggle menu">
          <div class="w-6 h-[18px] flex flex-col justify-between transition-all duration-300"
            :class="{ 'active': isMobileOpen }">
            <span class="block h-[2.5px] bg-gray-700 rounded transition-all duration-300"
              :class="{ 'translate-y-[7.5px] rotate-45': isMobileOpen }"></span>
            <span class="block h-[2.5px] bg-gray-700 rounded transition-all duration-300"
              :class="{ 'opacity-0 scale-x-0': isMobileOpen }"></span>
            <span class="block h-[2.5px] bg-gray-700 rounded transition-all duration-300"
              :class="{ '-translate-y-[7.5px] -rotate-45': isMobileOpen }"></span>
          </div>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation (placeholder – you can later add layout controls here) -->
  </nav>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/AuthStore.js';
import api from '../../services/api.js';

const router = useRouter();
const authStore = useAuthStore();

// Mobile menu states
const isMobileOpen = ref(false);
const isMobileDropdownOpen = ref(false);

// Layout state
const selectedLayout = ref(authStore.layout || 'general');

// Customer dropdown states
const isCustomerDropdownOpen = ref(false);
const customers = ref([]);
const customerLoading = ref(false);
const customerSearch = ref('');
const selectedCustomer = ref(null);

// Ref for dropdown container (used for click-outside detection)
const dropdownWrapper = ref(null);

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value;
  if (!isMobileOpen.value) {
    isMobileDropdownOpen.value = false;
  }
};

const toggleMobileDropdown = () => {
  isMobileDropdownOpen.value = !isMobileDropdownOpen.value;
};

const closeMobileMenu = () => {
  isMobileOpen.value = false;
  isMobileDropdownOpen.value = false;
};

// Layout toggle – saves to store
const setLayout = (layout) => {
  selectedLayout.value = layout;
  authStore.layout = layout;
  // If switching to general, clear customer selection
  if (layout === 'general') {
    selectedCustomer.value = null;
    authStore.customerId = null;
    isCustomerDropdownOpen.value = false;
    // Optionally navigate back to provider dashboard
    if (router.currentRoute.value.path.startsWith('/customer')) {
      router.push('/provider/dashboard');
    }
  } else if (layout === 'customer') {
    // If no customer selected, open dropdown to force selection
    if (!authStore.customerId && customers.value.length > 0) {
      // Auto-select first customer? Or open dropdown? We'll open dropdown.
      // But let's not auto-select, let user choose.
      // However, we might want to open the dropdown automatically.
      // We'll open it if we have customers.
      if (customers.value.length > 0) {
        isCustomerDropdownOpen.value = true;
      }
    }
  }
};

// Toggle the Select Customer dropdown
const toggleSelectCustomerDropdown = async () => {
  // If switching to customer layout, set layout first
  if (selectedLayout.value !== 'customer') {
    setLayout('customer');
    // Wait for reactivity
    await nextTick();
  }
  
  // Fetch customers if not loaded
  if (customers.value.length === 0) {
    customerLoading.value = true;
    try {
      const response = await api().get('/customer-management/customers-active');
      customers.value = response.data.data || [];
      // Auto-select first if no selection and we have customers
      if (customers.value.length > 0 && !authStore.customerId) {
        const first = customers.value[0];
        selectedCustomer.value = first;
        authStore.customerId = first.id;
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      customerLoading.value = false;
    }
  }
  
  // Toggle dropdown
  isCustomerDropdownOpen.value = !isCustomerDropdownOpen.value;
  if (isCustomerDropdownOpen.value) {
    customerSearch.value = '';
  }
  // Do NOT navigate here – only navigate when a customer is selected
};

// Fetch customers (separate function, used also on mount)
const fetchCustomers = async () => {
  if (authStore.authType !== 'provider') return;
  customerLoading.value = true;
  try {
    const response = await api().get('/customer-management/customers-active');
    customers.value = response.data.data || [];
    
    // Auto-select customer if we have a stored ID or select first one
    if (customers.value.length > 0) {
      const storedId = authStore.customerId;
      if (storedId) {
        const found = customers.value.find(c => c.id === storedId);
        if (found) {
          selectedCustomer.value = found;
          authStore.customerId = found.id;
        } else {
          // If stored ID not found, select first
          selectedCustomer.value = customers.value[0];
          authStore.customerId = customers.value[0].id;
        }
      } else {
        // If no stored ID, select first only if layout is 'customer'? 
        // We'll leave it unselected to force user to pick.
        // But to have a valid state, we might select first.
        // Let's select first only if layout is 'customer'
        if (authStore.layout === 'customer') {
          selectedCustomer.value = customers.value[0];
          authStore.customerId = customers.value[0].id;
        }
      }
    } else {
      selectedCustomer.value = null;
      authStore.customerId = null;
    }
  } catch (error) {
    console.error('Failed to fetch customers:', error);
  } finally {
    customerLoading.value = false;
  }
};

// Select a customer – saves to store and navigates
const selectCustomer = (customer) => {
  selectedCustomer.value = customer;
  authStore.customerId = customer.id;
  // Ensure layout is customer
  if (selectedLayout.value !== 'customer') {
    setLayout('customer');
  }
  isCustomerDropdownOpen.value = false;
  customerSearch.value = '';
  // Navigate to customer dashboard
  router.push('/customer/dashboard');
};

// Clear customer selection – resets to general layout
const clearCustomerSelection = () => {
  selectedCustomer.value = null;
  authStore.customerId = null;
  isCustomerDropdownOpen.value = false;
  customerSearch.value = '';
  // Switch back to general layout
  setLayout('general');
  // Navigate to provider dashboard
  router.push('/provider/dashboard');
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Filtered customers based on search
const filteredCustomers = computed(() => {
  if (!customerSearch.value.trim()) return customers.value;
  const search = customerSearch.value.toLowerCase().trim();
  return customers.value.filter(customer => 
    customer.contact_name?.toLowerCase().includes(search) ||
    customer.company_name?.toLowerCase().includes(search) ||
    customer.email?.toLowerCase().includes(search)
  );
});

// Handle click outside dropdown
const handleClickOutside = (event) => {
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(event.target)) {
    isCustomerDropdownOpen.value = false;
  }
};

// Logout
const handleLogout = async () => {
  try {
    authStore.logout();
    closeMobileMenu();
    await router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// On mount
onMounted(() => {
  // Ensure layout is persisted
  if (authStore.layout) {
    selectedLayout.value = authStore.layout;
  } else {
    authStore.layout = 'general';
    selectedLayout.value = 'general';
  }
  if (authStore.authType === 'provider') {
    fetchCustomers();
  }
  
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch for changes in userType to fetch customers
watch(() => authStore.authType, (newType) => {
  if (newType === 'provider') {
    fetchCustomers();
  }
});

// Watch for customerId changes to update selectedCustomer
watch(() => authStore.customerId, (newId) => {
  if (newId && customers.value.length > 0) {
    const found = customers.value.find(c => c.id === newId);
    if (found) {
      selectedCustomer.value = found;
    }
  } else if (!newId) {
    selectedCustomer.value = null;
  }
});

// Also watch layout changes from other components (e.g., if set elsewhere)
watch(() => authStore.layout, (newLayout) => {
  selectedLayout.value = newLayout;
});
</script>

<style scoped>
/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Loading spinner */
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #10b981;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Button hover effects */
.customer-select-btn {
  transition: all 0.2s ease;
}

.customer-select-btn:hover {
  transform: translateY(-1px);
}

.customer-select-btn:active {
  transform: translateY(0px);
}

/* Customer item hover */
.customer-item {
  transition: all 0.15s ease;
  position: relative;
}

.customer-item:hover {
  transform: translateX(2px);
}

/* Selected state */
.customer-item-selected {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

/* Status badge pulse */
.status-active {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Dropdown shadow */
.dropdown-shadow {
  box-shadow: 
    0 20px 60px -12px rgba(0, 0, 0, 0.15),
    0 4px 18px 0 rgba(0, 0, 0, 0.05);
}

/* Mobile menu styles */
@media (max-width: 768px) {
  .dropdown-mobile {
    max-height: 70vh;
  }
}

/* Smooth hover transitions */
.hover-transition {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Search input focus glow */
.search-input:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Avatar gradient */
.avatar-gradient {
  background: linear-gradient(135deg, #10b981, #059669);
}

/* Empty state illustration */
.empty-state-icon {
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.empty-state:hover .empty-state-icon {
  opacity: 0.6;
}

/* Selection checkmark animation */
.checkmark-enter {
  animation: checkmarkPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes checkmarkPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Glass morphism effect for dropdown */
.glass-effect {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.98);
}

/* Ripple effect on click */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.ripple:active::after {
  opacity: 1;
  transition: opacity 0s;
}
</style>

