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
            <!-- Provider Layout Controls -->
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
              <div v-if="selectedLayout === 'customer'" class="relative customer-dropdown-wrapper">
                <button @click="toggleSelectCustomerDropdown"
                  class="px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 bg-white border-2 shadow-sm hover:shadow-md"
                  :class="[
                    selectedCustomer || authStore.customerId
                      ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50'
                      : 'border-gray-300 text-gray-600 hover:border-emerald-400 hover:text-emerald-600'
                  ]">
                  <UserIcon class="w-4 h-4" />
                  <span>{{ displayCustomerName }}</span>
                  <ChevronDownIcon class="w-4 h-4 transition-transform duration-200 ml-1"
                    :class="{ 'rotate-180': isCustomerDropdownOpen }" />
                </button>

                <!-- Customer Dropdown -->
                <div v-if="isCustomerDropdownOpen"
                  class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden z-50 backdrop-blur-sm animate-slideDown">
                  <!-- Search Input -->
                  <div class="p-3 border-b border-gray-100">
                    <div class="relative">
                      <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input v-model="customerSearch" type="text" placeholder="Search customers..."
                        class="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200" />
                    </div>
                  </div>

                  <!-- Customer List -->
                  <div class="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                    <div v-if="customerLoading" class="text-center py-6">
                      <div
                        class="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin">
                      </div>
                      <p class="mt-2 text-sm text-gray-500">Loading customers...</p>
                    </div>

                    <div v-else-if="filteredCustomers.length === 0" class="text-center py-8">
                      <UsersIcon class="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p class="text-sm text-gray-500">No customers found</p>
                    </div>

                    <button v-for="customer in filteredCustomers" :key="customer.id" @click="selectCustomer(customer)"
                      class="w-full text-left px-4 py-3 rounded-xl transition-all duration-150 flex items-center gap-3 group"
                      :class="[
                        authStore.customerId === customer.id
                          ? 'bg-emerald-50/80 ring-2 ring-emerald-500/30 shadow-sm'
                          : 'hover:bg-gray-50/80'
                      ]">
                      <!-- Avatar -->
                      <div
                        class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                        :class="[
                          authStore.customerId === customer.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                        ]">
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
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="[
                          customer.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        ]">
                          <span class="w-1.5 h-1.5 rounded-full mr-1" :class="[
                            customer.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                          ]"></span>
                          {{ customer.status || 'Active' }}
                        </span>
                      </div>
                    </button>
                  </div>

                  <!-- Footer -->
                  <div class="p-2 border-t border-gray-100 bg-gray-50/50">
                    <button @click="clearCustomerSelection"
                      class="w-full text-center text-xs text-gray-500 hover:text-red-600 transition-colors duration-200 py-1.5 rounded-lg hover:bg-red-50"
                      v-if="authStore.customerId">
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Layout Controls -->
            <div v-if="authStore.authType === 'admin'"
              class="flex items-center space-x-1 ml-2 border-l border-gray-200 pl-3">
              <!-- General Layout -->
              <button @click="setAdminLayout('general')"
                class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border-2" :class="selectedAdminLayout === 'general'
                  ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                  : 'bg-transparent text-gray-600 border-gray-300 hover:bg-purple-50/50 hover:border-purple-300'">
                General Layout
              </button>

              <!-- Tenant Layout -->
              <button @click="setAdminLayout('tenant')"
                class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border-2" :class="selectedAdminLayout === 'tenant'
                  ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                  : 'bg-transparent text-gray-600 border-gray-300 hover:bg-purple-50/50 hover:border-purple-300'">
                Tenant Layout
              </button>

              <!-- Select Tenant (visible only when Tenant Layout is active) -->
              <div v-if="selectedAdminLayout === 'tenant'" class="relative tenant-dropdown-wrapper">
                <button @click="toggleSelectTenantDropdown"
                  class="px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 bg-white border-2 shadow-sm hover:shadow-md"
                  :class="[
                    selectedTenant || authStore.tenantId
                      ? 'border-purple-500 text-purple-700 bg-purple-50/50 hover:bg-purple-50'
                      : 'border-gray-300 text-gray-600 hover:border-purple-400 hover:text-purple-600'
                  ]">
                  <UserIcon class="w-4 h-4" />
                  <span>{{ displayTenantName }}</span>
                  <ChevronDownIcon class="w-4 h-4 transition-transform duration-200 ml-1"
                    :class="{ 'rotate-180': isTenantDropdownOpen }" />
                </button>

                <!-- Tenant Dropdown -->
                <div v-if="isTenantDropdownOpen"
                  class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden z-50 backdrop-blur-sm animate-slideDown">
                  <!-- Search Input -->
                  <div class="p-3 border-b border-gray-100">
                    <div class="relative">
                      <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input v-model="tenantSearch" type="text" placeholder="Search tenants..."
                        class="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200" />
                    </div>
                  </div>

                  <!-- Tenant List -->
                  <div class="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                    <div v-if="tenantLoading" class="text-center py-6">
                      <div
                        class="inline-block w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin">
                      </div>
                      <p class="mt-2 text-sm text-gray-500">Loading tenants...</p>
                    </div>

                    <div v-else-if="filteredTenants.length === 0" class="text-center py-8">
                      <UsersIcon class="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p class="text-sm text-gray-500">No tenants found</p>
                    </div>

                    <button v-for="tenant in filteredTenants" :key="tenant.id" @click="selectTenant(tenant)"
                      class="w-full text-left px-4 py-3 rounded-xl transition-all duration-150 flex items-center gap-3 group"
                      :class="[
                        authStore.tenantId === tenant.id
                          ? 'bg-purple-50/80 ring-2 ring-purple-500/30 shadow-sm'
                          : 'hover:bg-gray-50/80'
                      ]">
                      <!-- Avatar -->
                      <div
                        class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                        :class="[
                          authStore.tenantId === tenant.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-700'
                        ]">
                        {{ getInitials(tenant.company_name) }}
                      </div>

                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-800 truncate flex items-center gap-2">
                          {{ tenant.company_name }}
                          <span v-if="authStore.tenantId === tenant.id" class="flex-shrink-0">
                            <CheckIcon class="w-4 h-4 text-purple-600" />
                          </span>
                        </div>
                        <div class="text-xs text-gray-500 truncate flex items-center gap-1">
                          <BuildingIcon class="w-3 h-3" />
                          {{ tenant.email || 'No email' }}
                        </div>
                      </div>

                      <!-- Status Badge -->
                      <div class="flex-shrink-0">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="[
                          tenant.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : tenant.status === 'trial'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-500'
                        ]">
                          <span class="w-1.5 h-1.5 rounded-full mr-1" :class="[
                            tenant.status === 'active' ? 'bg-emerald-500' : 
                            tenant.status === 'trial' ? 'bg-blue-500' : 'bg-gray-400'
                          ]"></span>
                          {{ tenant.status || 'Active' }}
                        </span>
                      </div>
                    </button>
                  </div>

                  <!-- Footer -->
                  <div class="p-2 border-t border-gray-100 bg-gray-50/50">
                    <button @click="clearTenantSelection"
                      class="w-full text-center text-xs text-gray-500 hover:text-red-600 transition-colors duration-200 py-1.5 rounded-lg hover:bg-red-50"
                      v-if="authStore.tenantId">
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
import {
  UserIcon,
  ChevronDownIcon,
  SearchIcon,
  UsersIcon,
  BuildingIcon,
  CheckIcon
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const dropdownWrapper = ref(null);

// Mobile menu states
const isMobileOpen = ref(false);
const isMobileDropdownOpen = ref(false);

// Provider Layout state
const selectedLayout = ref(authStore.layout || 'general');

// Customer dropdown states (Provider)
const isCustomerDropdownOpen = ref(false);
const customers = ref([]);
const customerLoading = ref(false);
const customerSearch = ref('');
const selectedCustomer = ref(null);
const isLoadingCustomers = ref(false);
const isDataLoaded = ref(false);

// Admin Layout state
const selectedAdminLayout = ref(authStore.adminLayout || 'general');

// Tenant dropdown states (Admin)
const tenants = ref([]);
const tenantLoading = ref(false);
const tenantSearch = ref('');
const selectedTenant = ref(null);
const isTenantDropdownOpen = ref(false);
const isLoadingTenants = ref(false);
const isTenantDataLoaded = ref(false);

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

// ============ PROVIDER FUNCTIONS ============

// Provider Layout toggle – saves to store
const setLayout = (layout) => {
  console.log('🔄 Provider setLayout called with:', layout);
  selectedLayout.value = layout;
  authStore.layout = layout;
  // If switching to general, clear customer selection
  if (layout === 'general') {
    isCustomerDropdownOpen.value = false;
    router.push("/provider/dashboard");
  } else {
    if (authStore.customerId) {
      // Try to find customer by ID
      const found = customers.value.find(c => String(c.id) === String(authStore.customerId));
      if (found) {
        selectedCustomer.value = found;
      } else if (customers.value.length > 0) {
        selectedCustomer.value = customers.value[0];
        authStore.customerId = customers.value[0].id;
      }
    } else if (customers.value.length > 0) {
      selectedCustomer.value = customers.value[0];
      authStore.customerId = customers.value[0].id;
    }
    router.push("/customer/dashboard");
  }
};

// Toggle the Select Customer dropdown
const toggleSelectCustomerDropdown = async () => {
  console.log('🔄 toggleSelectCustomerDropdown called');
  if (!isCustomerDropdownOpen.value) {
    if (selectedLayout.value !== 'customer') {
      setLayout('customer');
    }
    if (customers.value.length === 0) {
      await fetchCustomers();
    }
  }
  isCustomerDropdownOpen.value = !isCustomerDropdownOpen.value;
  if (isCustomerDropdownOpen.value) {
    customerSearch.value = '';
  }
};

// Fetch customers (Provider)
const fetchCustomers = async () => {
  console.log('🔄 fetchCustomers called');
  console.log('📊 authStore.userType:', authStore.userType);
  console.log('📊 authStore.isAuthenticated:', authStore.isAuthenticated);

  isLoadingCustomers.value = true;
  customerLoading.value = true;
  try {
    const response = await api().get('/customer-management/customers-active');
    customers.value = response.data.data || [];
    console.log('✅ Customers fetched:', customers.value.length);
    console.log('📋 First customer:', customers.value[0]);

    if (customers.value.length > 0) {
      const storedId = authStore.customerId;
      console.log('📌 storedId from authStore:', storedId);

      if (storedId) {
        // Try to find the stored customer
        const found = customers.value.find(c => String(c.id) === String(storedId));
        console.log('🔎 Looking for storedId:', storedId, 'Found:', found ? found.contact_name : 'Not found');

        if (found) {
          selectedCustomer.value = found;
          // Make sure authStore has the correct ID
          authStore.customerId = found.id;
          console.log('✅ Selected customer from storedId:', found.contact_name);
        } else {
          // If stored ID not found, select first customer
          selectedCustomer.value = customers.value[0];
          authStore.customerId = customers.value[0].id;
          console.log('⚠️ storedId not found, selected first customer:', customers.value[0].contact_name);
        }
      } else {
        // No stored ID, select first customer
        selectedCustomer.value = customers.value[0];
        authStore.customerId = customers.value[0].id;
        console.log('ℹ️ No storedId, selected first customer:', customers.value[0].contact_name);
      }
    } else {
      selectedCustomer.value = null;
      authStore.customerId = null;
      console.log('⚠️ No customers available');
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error('❌ Failed to fetch customers:', error);
  } finally {
    customerLoading.value = false;
    isLoadingCustomers.value = false;
    console.log('📊 Final state - selectedCustomer:', selectedCustomer.value?.contact_name);
    console.log('📊 Final state - authStore.customerId:', authStore.customerId);

    // Force update after data is loaded
    await nextTick();
    console.log('📊 After nextTick - selectedCustomer:', selectedCustomer.value?.contact_name);
  }
};

// Select a customer – saves to store and navigates
const selectCustomer = (customer) => {
  console.log('🔄 selectCustomer called with:', customer.contact_name);
  selectedCustomer.value = customer;
  authStore.customerId = customer.id;
  // Ensure layout is customer
  if (selectedLayout.value !== 'customer') {
    setLayout('customer');
  }
  isCustomerDropdownOpen.value = false;
  customerSearch.value = '';
};

// Clear customer selection – resets to general layout
const clearCustomerSelection = () => {
  console.log('🔄 clearCustomerSelection called');
  selectedCustomer.value = null;
  authStore.customerId = null;
  isCustomerDropdownOpen.value = false;
  customerSearch.value = '';
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

// Display customer name computed
const displayCustomerName = computed(() => {
  console.log('🔍 displayCustomerName computed called');
  console.log('📊 selectedCustomer.value:', selectedCustomer.value);
  console.log('🆔 authStore.customerId:', authStore.customerId);
  console.log('📋 customers.value.length:', customers.value.length);
  console.log('📌 isDataLoaded:', isDataLoaded.value);
  console.log('📌 isLoadingCustomers:', isLoadingCustomers.value);

  // If customers are still loading, show loading text
  if (isLoadingCustomers.value && customers.value.length === 0) {
    console.log('⏳ Customers are loading...');
    return 'Loading...';
  }

  // If data is loaded and we have no customers
  if (isDataLoaded.value && customers.value.length === 0) {
    console.log('ℹ️ No customers available');
    return 'No Customers';
  }

  if (selectedCustomer.value) {
    console.log('✅ selectedCustomer found:', selectedCustomer.value.contact_name);
    return selectedCustomer.value.contact_name;
  }

  // Try to find by ID if selectedCustomer is null but authStore has ID
  if (authStore.customerId && customers.value.length > 0) {
    console.log('🔎 Searching for customer with ID:', authStore.customerId);
    const found = customers.value.find(c => {
      const match = String(c.id) === String(authStore.customerId);
      console.log(`   Comparing c.id: ${c.id} (${typeof c.id}) with authStore.customerId: ${authStore.customerId} (${typeof authStore.customerId}) => ${match}`);
      return match;
    });

    if (found) {
      console.log('✅ Found customer by ID:', found.contact_name);
      selectedCustomer.value = found; // Update selectedCustomer
      return found.contact_name;
    } else {
      console.log('❌ No customer found with ID:', authStore.customerId);
    }
  } else {
    console.log('⚠️ No authStore.customerId or no customers available');
  }

  console.log('❌ Returning "Select Customer"');
  return 'Select Customer';
});

// ============ ADMIN FUNCTIONS ============

// Admin Layout toggle – saves to store
const setAdminLayout = (layout) => {
  console.log('🔄 Admin setAdminLayout called with:', layout);
  selectedAdminLayout.value = layout;
  authStore.adminLayout = layout;
  
  if (layout === 'general') {
    isTenantDropdownOpen.value = false;
    router.push("/admin/dashboard");
  } else {
    // Tenant layout - navigate to provider dashboard
    if (authStore.tenantId) {
      // Try to find tenant by ID
      const found = tenants.value.find(t => String(t.id) === String(authStore.tenantId));
      if (found) {
        selectedTenant.value = found;
      } else if (tenants.value.length > 0) {
        selectedTenant.value = tenants.value[0];
        authStore.tenantId = tenants.value[0].id;
      }
    } else if (tenants.value.length > 0) {
      selectedTenant.value = tenants.value[0];
      authStore.tenantId = tenants.value[0].id;
    }
    router.push("/provider/dashboard");
  }
};

// Toggle the Select Tenant dropdown
const toggleSelectTenantDropdown = async () => {
  console.log('🔄 toggleSelectTenantDropdown called');
  if (!isTenantDropdownOpen.value) {
    if (selectedAdminLayout.value !== 'tenant') {
      setAdminLayout('tenant');
    }
    if (tenants.value.length === 0) {
      await fetchTenants();
    }
  }
  isTenantDropdownOpen.value = !isTenantDropdownOpen.value;
  if (isTenantDropdownOpen.value) {
    tenantSearch.value = '';
  }
};

// Fetch tenants (Admin)
const fetchTenants = async () => {
  console.log('🔄 fetchTenants called');
  console.log('📊 authStore.authType:', authStore.authType);
  console.log('📊 authStore.isAuthenticated:', authStore.isAuthenticated);

  isLoadingTenants.value = true;
  tenantLoading.value = true;
  try {
    const response = await api().get('/tenant/tenants');
    tenants.value = response.data.data || [];
    console.log('✅ Tenants fetched:', tenants.value.length);
    console.log('📋 First tenant:', tenants.value[0]);

    if (tenants.value.length > 0) {
      const storedId = authStore.tenantId;
      console.log('📌 storedId from authStore:', storedId);

      if (storedId) {
        // Try to find the stored tenant
        const found = tenants.value.find(t => String(t.id) === String(storedId));
        console.log('🔎 Looking for storedId:', storedId, 'Found:', found ? found.company_name : 'Not found');

        if (found) {
          selectedTenant.value = found;
          // Make sure authStore has the correct ID
          authStore.tenantId = found.id;
          console.log('✅ Selected tenant from storedId:', found.company_name);
        } else {
          // If stored ID not found, select first tenant
          selectedTenant.value = tenants.value[0];
          authStore.tenantId = tenants.value[0].id;
          console.log('⚠️ storedId not found, selected first tenant:', tenants.value[0].company_name);
        }
      } else {
        // No stored ID, select first tenant
        selectedTenant.value = tenants.value[0];
        authStore.tenantId = tenants.value[0].id;
        console.log('ℹ️ No storedId, selected first tenant:', tenants.value[0].company_name);
      }
    } else {
      selectedTenant.value = null;
      authStore.tenantId = null;
      console.log('⚠️ No tenants available');
    }

    isTenantDataLoaded.value = true;
  } catch (error) {
    console.error('❌ Failed to fetch tenants:', error);
  } finally {
    tenantLoading.value = false;
    isLoadingTenants.value = false;
    console.log('📊 Final state - selectedTenant:', selectedTenant.value?.company_name);
    console.log('📊 Final state - authStore.tenantId:', authStore.tenantId);

    // Force update after data is loaded
    await nextTick();
    console.log('📊 After nextTick - selectedTenant:', selectedTenant.value?.company_name);
  }
};

// Select a tenant – saves to store and navigates
const selectTenant = (tenant) => {
  console.log('🔄 selectTenant called with:', tenant.company_name);
  selectedTenant.value = tenant;
  authStore.tenantId = tenant.id;
  // Ensure layout is tenant
  if (selectedAdminLayout.value !== 'tenant') {
    setAdminLayout('tenant');
  }
  isTenantDropdownOpen.value = false;
  tenantSearch.value = '';
};

// Clear tenant selection – resets to general layout
const clearTenantSelection = () => {
  console.log('🔄 clearTenantSelection called');
  selectedTenant.value = null;
  authStore.tenantId = null;
  isTenantDropdownOpen.value = false;
  tenantSearch.value = '';
};

// Filtered tenants based on search
const filteredTenants = computed(() => {
  if (!tenantSearch.value.trim()) return tenants.value;
  const search = tenantSearch.value.toLowerCase().trim();
  return tenants.value.filter(tenant =>
    tenant.company_name?.toLowerCase().includes(search) ||
    tenant.email?.toLowerCase().includes(search) ||
    tenant.phone?.toLowerCase().includes(search)
  );
});

// Display tenant name computed
const displayTenantName = computed(() => {
  console.log('🔍 displayTenantName computed called');
  console.log('📊 selectedTenant.value:', selectedTenant.value);
  console.log('🆔 authStore.tenantId:', authStore.tenantId);
  console.log('📋 tenants.value.length:', tenants.value.length);
  console.log('📌 isTenantDataLoaded:', isTenantDataLoaded.value);
  console.log('📌 isLoadingTenants:', isLoadingTenants.value);

  // If tenants are still loading, show loading text
  if (isLoadingTenants.value && tenants.value.length === 0) {
    console.log('⏳ Tenants are loading...');
    return 'Loading...';
  }

  // If data is loaded and we have no tenants
  if (isTenantDataLoaded.value && tenants.value.length === 0) {
    console.log('ℹ️ No tenants available');
    return 'No Tenants';
  }

  if (selectedTenant.value) {
    console.log('✅ selectedTenant found:', selectedTenant.value.company_name);
    return selectedTenant.value.company_name;
  }

  // Try to find by ID if selectedTenant is null but authStore has ID
  if (authStore.tenantId && tenants.value.length > 0) {
    console.log('🔎 Searching for tenant with ID:', authStore.tenantId);
    const found = tenants.value.find(t => {
      const match = String(t.id) === String(authStore.tenantId);
      console.log(`   Comparing t.id: ${t.id} (${typeof t.id}) with authStore.tenantId: ${authStore.tenantId} (${typeof authStore.tenantId}) => ${match}`);
      return match;
    });

    if (found) {
      console.log('✅ Found tenant by ID:', found.company_name);
      selectedTenant.value = found; // Update selectedTenant
      return found.company_name;
    } else {
      console.log('❌ No tenant found with ID:', authStore.tenantId);
    }
  } else {
    console.log('⚠️ No authStore.tenantId or no tenants available');
  }

  console.log('❌ Returning "Select Tenant"');
  return 'Select Tenant';
});

// ============ COMMON FUNCTIONS ============

// Close dropdown on escape key
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    if (isCustomerDropdownOpen.value) {
      isCustomerDropdownOpen.value = false;
    }
    if (isTenantDropdownOpen.value) {
      isTenantDropdownOpen.value = false;
    }
  }
};

// Close dropdown on click outside
const handleClickOutside = (event) => {
  // Close customer dropdown if clicked outside
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(event.target)) {
    isCustomerDropdownOpen.value = false;
  }
  // Close tenant dropdown if clicked outside
  const tenantDropdownWrapper = document.querySelector('.tenant-dropdown-wrapper');
  if (tenantDropdownWrapper && !tenantDropdownWrapper.contains(event.target)) {
    isTenantDropdownOpen.value = false;
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

// ============ WATCHES ============

// Watch for customers changes and set selected customer (Provider)
watch(() => customers.value, (newCustomers, oldCustomers) => {
  console.log('🔄 customers.value changed');
  console.log('   Old length:', oldCustomers?.length || 0);
  console.log('   New length:', newCustomers.length);

  if (newCustomers.length > 0 && authStore.customerId) {
    const found = newCustomers.find(c => String(c.id) === String(authStore.customerId));
    if (found) {
      console.log('✅ Setting selectedCustomer from watch:', found.contact_name);
      selectedCustomer.value = found;
    } else if (!selectedCustomer.value) {
      // If no selected customer and we have customers, select the first one
      console.log('ℹ️ No matching customer found, selecting first');
      selectedCustomer.value = newCustomers[0];
      authStore.customerId = newCustomers[0].id;
    }
  } else if (newCustomers.length > 0 && !selectedCustomer.value) {
    // If we have customers but no selectedCustomer, select first
    console.log('ℹ️ No authStore.customerId but we have customers, selecting first');
    selectedCustomer.value = newCustomers[0];
    authStore.customerId = newCustomers[0].id;
  }
}, { immediate: true, deep: true });

// Watch for authStore.customerId changes (Provider)
watch(() => authStore.customerId, (newId, oldId) => {
  console.log('🔄 watch: authStore.customerId changed');
  console.log('   Old ID:', oldId);
  console.log('   New ID:', newId);
  console.log('   customers.value.length:', customers.value.length);

  if (newId && customers.value.length > 0) {
    // Use strict equality with type conversion
    const found = customers.value.find(c => {
      const match = String(c.id) === String(newId);
      console.log(`   Comparing c.id: ${c.id} (${typeof c.id}) with newId: ${newId} (${typeof newId}) => ${match}`);
      return match;
    });

    if (found) {
      console.log('✅ Found customer in watch:', found.contact_name);
      selectedCustomer.value = found;
    } else {
      console.log('❌ Customer not found in watch, selecting first available');
      selectedCustomer.value = customers.value[0] || null;
      if (selectedCustomer.value) {
        authStore.customerId = selectedCustomer.value.id;
      }
    }
  } else if (!newId) {
    console.log('⚠️ newId is null/undefined, setting selectedCustomer to null');
    selectedCustomer.value = null;
  }
}, { immediate: true });

// Watch for tenants changes and set selected tenant (Admin)
watch(() => tenants.value, (newTenants, oldTenants) => {
  console.log('🔄 tenants.value changed');
  console.log('   Old length:', oldTenants?.length || 0);
  console.log('   New length:', newTenants.length);

  if (newTenants.length > 0 && authStore.tenantId) {
    const found = newTenants.find(t => String(t.id) === String(authStore.tenantId));
    if (found) {
      console.log('✅ Setting selectedTenant from watch:', found.company_name);
      selectedTenant.value = found;
    } else if (!selectedTenant.value) {
      // If no selected tenant and we have tenants, select the first one
      console.log('ℹ️ No matching tenant found, selecting first');
      selectedTenant.value = newTenants[0];
      authStore.tenantId = newTenants[0].id;
    }
  } else if (newTenants.length > 0 && !selectedTenant.value) {
    // If we have tenants but no selectedTenant, select first
    console.log('ℹ️ No authStore.tenantId but we have tenants, selecting first');
    selectedTenant.value = newTenants[0];
    authStore.tenantId = newTenants[0].id;
  }
}, { immediate: true, deep: true });

// Watch for authStore.tenantId changes (Admin)
watch(() => authStore.tenantId, (newId, oldId) => {
  console.log('🔄 watch: authStore.tenantId changed');
  console.log('   Old ID:', oldId);
  console.log('   New ID:', newId);
  console.log('   tenants.value.length:', tenants.value.length);

  if (newId && tenants.value.length > 0) {
    // Use strict equality with type conversion
    const found = tenants.value.find(t => {
      const match = String(t.id) === String(newId);
      console.log(`   Comparing t.id: ${t.id} (${typeof t.id}) with newId: ${newId} (${typeof newId}) => ${match}`);
      return match;
    });

    if (found) {
      console.log('✅ Found tenant in watch:', found.company_name);
      selectedTenant.value = found;
    } else {
      console.log('❌ Tenant not found in watch, selecting first available');
      selectedTenant.value = tenants.value[0] || null;
      if (selectedTenant.value) {
        authStore.tenantId = selectedTenant.value.id;
      }
    }
  } else if (!newId) {
    console.log('⚠️ newId is null/undefined, setting selectedTenant to null');
    selectedTenant.value = null;
  }
}, { immediate: true });

// Watch for authStore.adminLayout changes
watch(() => authStore.adminLayout, (newLayout) => {
  console.log('🔄 authStore.adminLayout changed:', newLayout);
  selectedAdminLayout.value = newLayout;
});

// ============ MOUNTED ============

onMounted(async () => {
  console.log('🔧 Navbar mounted');
  console.log('📊 authStore.authType:', authStore.authType);
  console.log('📊 authStore.isAuthenticated:', authStore.isAuthenticated);
  console.log('📊 authStore.customerId:', authStore.customerId);
  console.log('📊 authStore.tenantId:', authStore.tenantId);

  // Set provider layout
  authStore.layout = authStore.layout ?? 'general';
  selectedLayout.value = authStore.layout;

  // Set admin layout
  authStore.adminLayout = authStore.adminLayout ?? 'general';
  selectedAdminLayout.value = authStore.adminLayout;

  // Fetch data based on auth type
  if (authStore.isAuthenticated) {
    if (authStore.authType === 'provider') {
      console.log('✅ User is provider, fetching customers...');
      await fetchCustomers();
    } else if (authStore.authType === 'admin') {
      console.log('✅ User is admin, fetching tenants...');
      await fetchTenants();
    }
  } else {
    console.log('⚠️ User is not authenticated, skipping data fetch');
  }

  document.addEventListener('keydown', handleEscape);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch for authType changes
watch(() => authStore.authType, (newType) => {
  console.log('🔄 authStore.authType changed:', newType);
  if (newType === 'provider') {
    fetchCustomers();
  } else if (newType === 'admin') {
    fetchTenants();
  }
});

// Watch for changes in authStore.layout (Provider)
watch(() => authStore.layout, (newLayout) => {
  console.log('🔄 authStore.layout changed:', newLayout);
  selectedLayout.value = newLayout;
});

// Also watch layout changes from other components (Provider)
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

  0%,
  100% {
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