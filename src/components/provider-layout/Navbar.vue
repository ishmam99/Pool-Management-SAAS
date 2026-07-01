<template>
  <nav class="bg-cyan-50 backdrop-blur-[20px] border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] sticky top-0 z-50 transition-all duration-300 hover:bg-white/95">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <router-link to="/provider-website" class="flex-shrink-0 group">
          <div class="flex items-center gap-3">
            <div class="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-600 to-red-700 p-[2px] transition-all duration-300 shadow-[0_4px_12px_rgba(220,38,38,0.3)] hover:scale-105 hover:rotate-[-5deg] hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
              <img 
                src="/src/assets/logo.png" 
                alt="Eagle Martial Arts" 
                class="w-full h-full object-cover rounded-full bg-white"
              >
            </div>
            <div class="flex flex-col leading-tight">
              <span class="text-xl font-extrabold text-red-600 tracking-tight">Pool Management </span>
              <span class="text-[0.65rem] font-semibold text-gray-500 tracking-wider uppercase">SaaS</span>
            </div>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link 
            to="/provider-website" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            Home
          </router-link>

          <router-link 
            to="/provider-website/about" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            About Us
          </router-link>

          <router-link 
            to="/provider-website/blogs" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            Blog
          </router-link>

          <router-link 
            to="/provider-website/features" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            Features
          </router-link>

          <router-link 
            to="/provider-website/join-us" 
            class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
            active-class="text-red-600 font-semibold before:w-[60%]"
          >
            Join Us
          </router-link>

          <!-- Conditional Auth Links -->
          <template v-if="authStore.isAuthenticated">
            <!-- Dashboard Link -->
            <router-link 
              :to="authStore.currentDashboard || '/'"
              class="relative px-4 py-2 font-medium text-gray-600 transition-all duration-300 rounded-lg hover:text-red-600 hover:bg-red-50/50 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:transition-all before:duration-300 hover:before:w-[60%]"
              active-class="text-red-600 font-semibold before:w-[60%]"
            >
              Dashboard
            </router-link>

            <!-- Logout Button -->
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
            to="/provider-website/login" 
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

    
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const isMobileOpen = ref(false);
const isMobileDropdownOpen = ref(false);

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

const handleLogout = async () => {
  try {
    // Call logout action from auth store
    authStore.logout();
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Redirect to home page
    await router.push('/');
    
    // Optional: Show a toast notification
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>