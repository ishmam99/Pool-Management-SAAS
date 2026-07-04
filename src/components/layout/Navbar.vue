<template>
  <nav class="bg-cyan-50 backdrop-blur-[20px] border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] sticky top-0 z-50 transition-all duration-300 hover:bg-white/95">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between px-20 items-center h-20">
        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0 group">
          <div class="flex items-center gap-3">
            <div class="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-600 to-red-700 p-[2px] transition-all duration-300 shadow-[0_4px_12px_rgba(220,38,38,0.3)] hover:scale-105 hover:rotate-[-5deg] hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
              <img 
                src="/src/assets/logo.png" 
                alt="Eagle Martial Arts" 
                class="w-full h-full object-cover rounded-full bg-white"
              >
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
          <router-link 
            to="/" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            Home
          </router-link>

          <router-link 
            to="/about" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            About Us
          </router-link>

          <router-link 
            to="/blogs" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            Blog
          </router-link>

          <router-link 
            to="/features" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            Features
          </router-link>

          <router-link 
            to="/join-us" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            Join Us
          </router-link>

          <!-- Dashboard Link -->
          <router-link                          
            v-if="authStore.isAuthenticated"
            :to="authStore.currentDashboard || '/'"
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            Dashboard
          </router-link>
        </div>

        <!-- Right side: auth & layout controls -->
       <!-- Right side: auth & layout controls -->
<div class="flex gap-2 items-center">
  <template v-if="authStore.isAuthenticated">
    <!-- Layout Toggle Group – only for providers -->
    <div v-if="authStore.authType === 'provider'" class="flex items-center space-x-1 ml-2 border-l border-gray-200 pl-3">
      <!-- General Layout -->
      <button
        @click="setLayout('general')"
        class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border-2"
        :class="selectedLayout === 'general' 
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' 
          : 'bg-transparent text-gray-600 border-gray-300 hover:bg-emerald-50/50 hover:border-emerald-300'"
      >
        General Layout
      </button>

      <!-- Customer Layout -->
      <button
        @click="setLayout('customer')"
        class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border-2"
        :class="selectedLayout === 'customer' 
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' 
          : 'bg-transparent text-gray-600 border-gray-300 hover:bg-emerald-50/50 hover:border-emerald-300'"
      >
        Customer Layout
      </button>

      <!-- Select Customer (visible only when Customer Layout is active) -->
      <div v-if="selectedLayout === 'customer'" class="relative">
        <!-- ... (unchanged) ... -->
      </div>
    </div>

    <!-- Logout Button – always visible for authenticated users -->
    <button 
      @click="handleLogout"
      class="px-4 py-2 font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(220,38,38,0.4)]"
    >
      Logout
    </button>
  </template>

  <!-- Login Link (when not authenticated) -->
  <router-link 
    v-else
    to="/login" 
    class="px-4 py-2 font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(220,38,38,0.4)]"
  >
    Login
  </router-link>
</div>

        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu" 
          class="md:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-red-50/50"
          aria-label="Toggle menu"
        >
          <div class="w-6 h-[18px] flex flex-col justify-between transition-all duration-300" :class="{ 'active': isMobileOpen }">
            <span class="block h-[2.5px] bg-gray-700 rounded transition-all duration-300" :class="{ 'translate-y-[7.5px] rotate-45': isMobileOpen }"></span>
            <span class="block h-[2.5px] bg-gray-700 rounded transition-all duration-300" :class="{ 'opacity-0 scale-x-0': isMobileOpen }"></span>
            <span class="block h-[2.5px] bg-gray-700 rounded transition-all duration-300" :class="{ '-translate-y-[7.5px] -rotate-45': isMobileOpen }"></span>
          </div>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation (placeholder – you can later add layout controls here) -->
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api.js';

const router = useRouter();
const authStore = useAuthStore();

const isMobileOpen = ref(false);
const isMobileDropdownOpen = ref(false);

// Layout state – initialize from store if available
const selectedLayout = ref(authStore.layout || 'general');
const isCustomerDropdownOpen = ref(false);
const customers = ref([]);
const customerLoading = ref(false);

// Toggle mobile
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
  authStore.layout = layout;   // persist to store
  if (layout === 'general') {
    // Clear selected customer when switching to general
    authStore.customerId = null;
    isCustomerDropdownOpen.value = false;
  }
};

// Toggle the Select Customer dropdown
const toggleSelectCustomerDropdown = async () => {
  if (!isCustomerDropdownOpen.value) {
    if (selectedLayout.value !== 'customer') {
      setLayout('customer');
    }
    if (customers.value.length === 0) {
      await fetchCustomers();
    }
  }
  isCustomerDropdownOpen.value = !isCustomerDropdownOpen.value;
};

// Fetch customers
const fetchCustomers = async () => {
  customerLoading.value = true;
  try {
    const response = await api().get('/customer-management/customers-active?with=pools,agreements');
    customers.value = response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch customers:', error);
  } finally {
    customerLoading.value = false;
  }
};

// Select a customer – saves to store
const selectCustomer = (customer) => {
  isCustomerDropdownOpen.value = false;
  authStore.customerId = customer.id;   // persist
  router.push(`/customer/${customer.id}`);
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

// On mount, if there is a stored customerId, we could optionally pre‑fetch the customer name or navigate – not required.
onMounted(() => {
  // The selectedLayout is already set from authStore.layout (or default 'general')
  // If we want to restore dropdown state, we can check if layout === 'customer' and maybe set isCustomerDropdownOpen to false by default.
  // No extra action needed.
});
</script>