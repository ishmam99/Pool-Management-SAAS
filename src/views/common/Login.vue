<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import api from "../../services/api.js";
import { useAuthStore } from "../../store/AuthStore.js";

const router = useRouter();
const authStore = useAuthStore();

// --- Reactive state ---
const password = ref("12345678");
const loading = ref(false);
const showPassword = ref(false);
const isFocused = ref(false);

// Active tab – default: tenant (Service Provider)
const activeTab = ref("tenant");

// --- Role configuration ---
const roleConfig = computed(() => {
  const configs = {
    tenant: {
      title: "Service Provider",
      color: "from-blue-500 to-cyan-500",
      lightColor: "from-blue-400/20 to-cyan-500/20",
      gradient: "from-blue-500/30 to-cyan-500/30",
      icon: "ri-water-flash-fill",
      description: "Manage your pool service business",
      subDescription: "Scheduling, Customers, Routes & Billing",
      emoji: "🏊",
      loginEndpoint: "/user-management/login",
      logoutEndpoint: "/user-management/logout",
      dashboard: "/provider/dashboard",
      userType: "provider",
      email: "parrapools@gmail.com"
    },
    customer: {
      title: "Customer",
      color: "from-emerald-500 to-teal-500",
      lightColor: "from-emerald-400/20 to-teal-500/20",
      gradient: "from-emerald-500/30 to-teal-500/30",
      icon: "ri-user-3-fill",
      description: "Manage your pool services",
      subDescription: "Visits, Invoices & Service History",
      emoji: "👤",
      loginEndpoint: "/customer-portal/login",
      logoutEndpoint: "/customer-portal/logout",
      dashboard: "/customer/dashboard",
      userType: "customer",
      email: "azmainiqbal@gmail.com"
    },
    technician: {
      title: "Technician",
      color: "from-purple-500 to-teal-500",
      lightColor: "from-purple-700/20 to-teal-800/20",
      gradient: "from-purple-700/30 to-teal-700/30",
      icon: "ri-tools-fill",
      description: "Manage your service visits",
      subDescription: "Schedule, Routes & Service History",
      emoji: "🔧",
      loginEndpoint: "/user-management/login",
      logoutEndpoint: "/user-management/logout",
      dashboard: "/technician/dashboard",
      userType: "technician",
      email: "tech1@aquacleanpools.com"
    },
  };
  return configs[activeTab.value] || configs.tenant;
});

// --- Email is now a writable ref (editable) ---
const email = ref(roleConfig.value.email);

// --- Watch activeTab to reset email to the default for that role ---
watch(activeTab, () => {
  email.value = roleConfig.value.email;
}, { immediate: true });

// --- Tabs for UI ---
const tabs = [
  {
    id: "tenant",
    label: "Service Provider",
    icon: "ri-water-flash-fill",
    color: "blue"
  },
  {
    id: "customer",
    label: "Customer",
    icon: "ri-user-3-fill",
    color: "emerald"
  },
  {
    id: "technician",
    label: "Technician",
    icon: "ri-tools-fill",
    color: "purple"
  },
];

// --- Set active tab ---
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

// --- Login handler ---
const handleLogin = async () => {
  // Validation
  if (!email.value || !password.value) {
    Swal.fire({
      icon: "warning",
      title: "Missing Information",
      text: "Please enter email and password.",
      confirmButtonColor: "#6366f1",
      background: "#1e1b4b",
      color: "#e2e8f0",
      iconColor: "#f59e0b",
    });
    return;
  }

  loading.value = true;

  try {
    const config = roleConfig.value;
    const response = await api().post(config.loginEndpoint, {
      email: email.value,
      password: password.value,
    });

    const data = response.data;

    // Handle Service Provider Login
    if (activeTab.value === "tenant") {
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        avatar: '',
        roles: [data.user.role],
        user_type: 'provider'
      };

      authStore.login(
        userData,
        data.token,
        data.user.role,
        "provider"
      );

      // Store tenant information
      authStore.companyId = data.tenant.id;
      authStore.companyName = data.tenant.company_name;
      
      router.push("/provider/dashboard");
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${data.user.name}!`,
        confirmButtonColor: "#16a34a",
        background: "#1e1b4b",
        color: "#e2e8f0",
        timer: 2000,
        timerProgressBar: true,
      });

    }

    // Handle Customer Login
    else if (activeTab.value === "customer") {
      const userData = {
        id: data.customer.id,
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone || '',
        avatar: '',
        roles: [],
        user_type: 'customer'
      };

      authStore.login(
        userData,
        data.token,
        "customer",
        "customer"
      );

      // Store tenant information
      authStore.companyId = data.tenant.id;
      authStore.companyName = data.tenant.company_name;

      router.push("/customer/dashboard");
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${data.customer.name}!`,
        confirmButtonColor: "#16a34a",
        background: "#1e1b4b",
        color: "#e2e8f0",
        timer: 2000,
        timerProgressBar: true,
      });

    }

    // Handle Technician Login (NEW)
    else if (activeTab.value === "technician") {
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        avatar: '',
        roles: [data.user.role],
        user_type: 'technician',
        tenant_id: data.user.tenant_id,
        tenant: data.tenant,
        last_login_at: data.user.last_login_at
      };

      // Check if the user has technician role
      if (data.user.role !== 'technician') {
        throw new Error('Invalid technician credentials');
      }

      authStore.login(
        userData,
        data.token,
        data.user.role,
        "technician"
      );

      // Store tenant information
      authStore.companyId = data.tenant.id;
      authStore.companyName = data.tenant.company_name;
      authStore.currentDashboard = "/technician/dashboard"
      
      router.push("/technician/dashboard");
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${data.user.name}!`,
        confirmButtonColor: "#16a34a",
        background: "#1e1b4b",
        color: "#e2e8f0",
        timer: 2000,
        timerProgressBar: true,
      });

    }

  } catch (error) {
    let message = "Invalid credentials. Please try again.";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: message,
      confirmButtonColor: "#dc2626",
      background: "#1e1b4b",
      color: "#e2e8f0",
    });
  } finally {
    loading.value = false;
  }
};

// --- Logout handler (can be used elsewhere) ---
const handleLogout = async () => {
  try {
    const config = roleConfig.value;
    await api.post(config.logoutEndpoint);
    authStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
    authStore.logout();
    router.push("/login");
  }
};
</script>

<template>
  <div
    class="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">

    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse">
      </div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000">
      </div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-teal-500/10 rounded-full blur-3xl animate-spin-slow">
      </div>

      <!-- Floating Particles -->
      <div class="absolute top-1/4 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-float"></div>
      <div class="absolute top-3/4 right-1/3 w-2 h-2 bg-white/10 rounded-full animate-float-delayed"></div>
      <div class="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/15 rounded-full animate-float-delayed-2"></div>
    </div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-xl mx-4">
      <div
        class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">

        <!-- Header with Gradient -->
        <div class="relative p-8 text-center overflow-hidden">
          <div :class="`absolute inset-0 bg-gradient-to-br ${roleConfig.color}`"></div>
          <div :class="`absolute inset-0 bg-gradient-to-t ${roleConfig.lightColor}`"></div>

          <div class="relative z-10">
            <!-- Animated Logo -->
            <div class="relative inline-block">
              <div
                class="w-20 h-20 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3">
                <span class="text-4xl">{{ roleConfig.emoji }}</span>
              </div>
              <div
                class="absolute -inset-2 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse">
              </div>
            </div>

            <h1 class="mt-4 text-2xl font-bold text-white tracking-tight">
              {{ roleConfig.title }}
            </h1>
            <p class="mt-1 text-white text-sm font-light tracking-wide">
              {{ roleConfig.description }}
            </p>
            <p class="mt-1 text-white text-xs font-light">
              {{ roleConfig.subDescription }}
            </p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="px-6 pt-6">
          <div class="grid grid-cols-3 gap-2 bg-white/5 rounded-2xl p-1 border border-white/5">
            <button v-for="tab in tabs" :key="tab.id" @click="setActiveTab(tab.id)"
              class="relative py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
              :class="activeTab === tab.id
                ? `bg-gradient-to-r ${activeTab === 'tenant' ? 'from-blue-500 to-cyan-500' : activeTab === 'customer' ? 'from-emerald-500 to-teal-500' : 'from-purple-500 to-teal-500'} text-white shadow-lg scale-105`
                : 'text-gray-800 hover:text-white hover:bg-white/5'
                ">
              <i :class="tab.icon" class="text-base"></i>
              <span class="hidden sm:inline">{{ tab.label }}</span>
              <span class="sm:hidden">{{ tab.label.charAt(0) }}</span>

              <!-- Active Indicator -->
              <div v-if="activeTab === tab.id"
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white/50 rounded-full">
              </div>
            </button>
          </div>
        </div>

        <!-- Form -->
        <div class="p-6 pt-4">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Email Field -->
            <div class="relative group">
              <label class="block text-gray-800 mb-1.5 text-sm font-medium tracking-wide">
                <i class="ri-mail-line mr-2"></i>Email Address
              </label>
              <div class="relative">
                <div
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                  <i class="ri-mail-line"></i>
                </div>
                <input v-model="email"  type="email"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email" @focus="isFocused = true" @blur="isFocused = false" />
                <div
                  class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                </div>
              </div>
            </div>

            <!-- Password Field -->
            <div class="relative group">
              <label class="block text-gray-800 mb-1.5 text-sm font-medium tracking-wide">
                <i class="ri-lock-line mr-2"></i>Password
              </label>
              <div class="relative">
                <div
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                  <i class="ri-lock-line"></i>
                </div>
                <input v-model="password" :type="showPassword ? 'text' : 'password'"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 pr-12"
                  placeholder="Enter your password" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-white transition-colors">
                  <i :class="showPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'" class="text-lg"></i>
                </button>
                <div
                  class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                </div>
              </div>
            </div>

            <!-- Forgot Password -->
            <div class="text-right">
              <a href="#" class="text-xs text-gray-400 hover:text-blue-400 transition-colors">
                Forgot password?
              </a>
            </div>

            <!-- Login Button -->
            <button :disabled="loading" type="submit" class="relative w-full overflow-hidden group">
              <div
                :class="`absolute inset-0 bg-gradient-to-r ${roleConfig.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`">
              </div>
              <div :class="`absolute inset-0 bg-gradient-to-r ${roleConfig.color}`"></div>
              <div
                class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              </div>

              <span class="relative flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-semibold">
                <span v-if="!loading">
                  <i class="ri-login-box-line mr-2"></i>Login
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <i class="ri-loader-4-line animate-spin"></i>
                  Signing In...
                </span>
              </span>
            </button>
          </form>

          <!-- Register Links -->
          <div class="mt-5 text-center border-t border-white/5 pt-4">
            <p class="text-gray-900 text-sm">
              Don't have an account?
              <router-link
                :to="activeTab === 'tenant' ? '/poolServiceProviderRegister' : activeTab === 'technician' ? '/technicianRegister' : '/customerRegister'"
                class="text-blue-800 hover:text-blue-300 font-medium transition-colors group">
                Register as
                <span class="underline underline-offset-2 group-hover:underline-offset-4 transition-all">
                  {{ activeTab === 'tenant' ? 'Service Provider' : activeTab === 'technician' ? 'Technician' :
                  'Customer' }}
                </span>
                <i class="ri-arrow-right-line inline-block group-hover:translate-x-1 transition-transform"></i>
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-gray-500/50 text-xs tracking-wider">
          <i class="ri-shield-check-line mr-1"></i>Secure Login • Powered by Pool Management System
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes float-delayed {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-15px) rotate(-180deg);
  }
}

@keyframes float-delayed-2 {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-25px) rotate(90deg);
  }
}

@keyframes spin-slow {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-float-delayed-2 {
  animation: float-delayed-2 7s ease-in-out infinite;
  animation-delay: 4s;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

/* Smooth hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:rotate-3 {
  transform: rotate(3deg);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}
</style>