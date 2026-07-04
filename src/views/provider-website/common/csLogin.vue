<template>
  <div class="p-20 mx-auto flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 ">
    <!-- Decorative background shapes -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-64 h-64 bg-blue-200/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl"></div>
    </div>

    <!-- Login Card -->
    <div class="relative w-full max-w-xl bg-emerald-50/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 transition-all duration-300 hover:shadow-3xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4">
          <i class="ri-user-3-fill text-4xl text-white"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back</h1>
        <p class="mt-2 text-gray-500 text-sm">Sign in to access your pool service dashboard</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <i class="ri-mail-line"></i>
            </span>
            <input
              v-model="email"
              type="email"
              required
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <i class="ri-lock-line"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'" class="text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Forgot password link -->
        <div class="text-right">
          <a href="#" class="text-sm text-blue-600 hover:text-blue-800 hover:underline transition">Forgot password?</a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">
            <i class="ri-login-box-line mr-2"></i>Login
          </span>
          <span v-else class="flex items-center gap-2">
            <i class="ri-loader-4-line animate-spin"></i>Signing In...
          </span>
        </button>
      </form>

      <!-- Register link -->
      <!-- <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link
          to="/customerRegister"
          class="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
        >
          Register as Customer
          <i class="ri-arrow-right-line inline-block ml-1 group-hover:translate-x-1 transition-transform"></i>
        </router-link>
      </p> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import api from "../../../services/api.js";
import { useAuthStore } from "../../../store/AuthStore.js";

const router = useRouter();
const authStore = useAuthStore();

// Form fields
const email = ref("patricia.brown23@example.com"); // default for demo
const password = ref("12345678");
const loading = ref(false);
const showPassword = ref(false);

// Login handler (customer only)
const handleLogin = async () => {
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
    const response = await api().post("/customer-portal/login", {
      email: email.value,
      password: password.value,
    });

    const data = response.data;

    const userData = {
      id: data.customer.id,
      name: data.customer.name,
      email: data.customer.email,
      phone: data.customer.phone || "",
      avatar: "",
      roles: [],
      user_type: "customer",
    };

    authStore.login(
      userData,
      data.token,
      "customer",
      "customer"
    );

    // Store tenant info if provided
    if (data.tenant) {
      authStore.companyId = data.tenant.id;
      authStore.companyName = data.tenant.company_name;
    }

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
</script>

<style scoped>
/* Optional custom animations or transitions */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>