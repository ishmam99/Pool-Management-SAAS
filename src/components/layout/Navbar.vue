<template>
  <nav class="bg-cyan-50 backdrop-blur-[20px] border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] sticky top-0 z-50 transition-all duration-300 hover:bg-white/95">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
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

    <!-- Mobile Menu -->
    <div 
      v-show="isMobileOpen"
      class="md:hidden bg-white/98 backdrop-blur-[20px] border-b border-gray-200/30 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="{ 'max-h-[600px]': isMobileOpen, 'max-h-0': !isMobileOpen }"
    >
      <div class="p-4 flex flex-col gap-1">
        <router-link to="/" class="px-4 py-3 rounded-lg font-medium text-gray-700 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600" @click="closeMobileMenu">
          Home
        </router-link>
        <router-link to="/about" class="px-4 py-3 rounded-lg font-medium text-gray-700 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600" @click="closeMobileMenu">
          About Us
        </router-link>
        <router-link to="/blog" class="px-4 py-3 rounded-lg font-medium text-gray-700 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600" @click="closeMobileMenu">
          Blog
        </router-link>
        
        <div class="mt-1">
          <button 
            @click="toggleMobileDropdown" 
            class="w-full px-4 py-3 rounded-lg font-medium text-gray-700 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 flex justify-between items-center"
          >
            Programs
            <svg 
              class="w-5 h-5 transition-transform duration-300"
              :class="{ 'rotate-180': isMobileDropdownOpen }"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"/>
            </svg>
          </button>
          <div v-show="isMobileDropdownOpen" class="pl-4 flex flex-col gap-1">
            <div class="py-2">
              <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">Adult Programs</div>
              <router-link to="/programs/adult/mma" class="block px-3 py-2 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 hover:pl-4" @click="closeMobileMenu">
                Men's MMA Class
              </router-link>
              <router-link to="/programs/adult/kickboxing" class="block px-3 py-2 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 hover:pl-4" @click="closeMobileMenu">
                Ladies Only Kickboxing
              </router-link>
            </div>
            <div class="py-2 border-t border-gray-200/30">
              <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">Kids Programs</div>
              <router-link to="/programs/kids/pre-mma" class="block px-3 py-2 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 hover:pl-4" @click="closeMobileMenu">
                Preschool MMA
              </router-link>
              <router-link to="/programs/kids/mma" class="block px-3 py-2 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 hover:pl-4" @click="closeMobileMenu">
                Kids MMA Classes
              </router-link>
              <router-link to="/programs/kids/teen-mma" class="block px-3 py-2 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 hover:pl-4" @click="closeMobileMenu">
                Teen MMA Classes
              </router-link>
            </div>
            <div class="py-2 border-t border-gray-200/30">
              <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">Next Level Sports &amp; Camps</div>
              <router-link to="/programs/next/summer-camp" class="block px-3 py-2 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 hover:pl-4" @click="closeMobileMenu">
                Summer Camp
              </router-link>
              <router-link to="/programs/next/after-school" class="block px-3 py-2 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 hover:pl-4" @click="closeMobileMenu">
                After School Program
              </router-link>
            </div>
            <div class="py-2 border-t border-gray-200/30">
              <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">Birthday Party</div>
              <router-link to="/programs/birthday/learn-more" class="block px-3 py-2 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 hover:pl-4" @click="closeMobileMenu">
                Learn More
              </router-link>
              <router-link to="/programs/birthday/rsvp" class="block px-3 py-2 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600 hover:pl-4" @click="closeMobileMenu">
                Party RSVP
              </router-link>
            </div>
          </div>
        </div>

        <!-- Mobile Auth Links -->
        <template v-if="authStore.isAuthenticated">
          <router-link 
            :to="authStore.currentDashboard || '/'"
            class="px-4 py-3 rounded-lg font-medium text-gray-700 transition-all duration-200 hover:bg-red-50/50 hover:text-red-600" 
            @click="closeMobileMenu"
          >
            Dashboard
          </router-link>
          <button 
            @click="handleLogout"
            class="px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-red-600 to-red-700 transition-all duration-200 hover:scale-105"
          >
            Logout
          </button>
        </template>
        <router-link 
          v-else
          to="/login" 
          class="px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-red-600 to-red-700 transition-all duration-200 hover:scale-105"
          @click="closeMobileMenu"
        >
          Login
        </router-link>
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