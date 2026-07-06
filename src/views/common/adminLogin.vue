<template>
  <div class="admin-login-page">
    <!-- Floating Animated Background -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-indigo-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-pink-500/10 rounded-full blur-3xl"></div>
      <!-- Floating particles (CSS only) -->
      <div class="absolute top-[20%] left-[15%] w-2 h-2 bg-purple-300/40 rounded-full blur-sm animate-ping"></div>
      <div class="absolute bottom-[30%] right-[20%] w-3 h-3 bg-indigo-300/40 rounded-full blur-sm animate-ping delay-300"></div>
      <div class="absolute top-[60%] left-[80%] w-1.5 h-1.5 bg-pink-300/30 rounded-full blur-sm animate-ping delay-500"></div>
    </div>

    <!-- Main Card -->
    <div class="min-h-screen flex p-20">
      <div class="w-full min-w-xl">
        <!-- Glassmorphism Card -->
        <div class="relative backdrop-blur-xl bg-white/15 bg-opacity-10 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-400/30">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="flex justify-center mb-4">
              <div class="relative">
                <div class="absolute inset-0 bg-indigo-500/40 blur-2xl rounded-full animate-pulse"></div>
                <i class="ri-shield-star-fill text-6xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 relative z-10"></i>
              </div>
            </div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Pool Management Platform</h1>
            <p class="text-indigo-200/80 text-sm mt-1 font-medium tracking-wide">Administrator Access Portal</p>
            <p class="text-white/40 text-xs mt-3 max-w-xs mx-auto leading-relaxed">
              Manage tenants, subscriptions, billing, support tickets, marketplace providers, and platform settings.
            </p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="ri-mail-line text-indigo-300/60 group-focus-within:text-indigo-200 transition-colors"></i>
              </div>
              <input
                type="email"
                v-model="email"
                placeholder="Admin email"
                class="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-white/30 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 focus:bg-white/10 transition-all duration-300 outline-none"
                :class="{ 'border-red-400/40': validationError }"
                autocomplete="email"
              />
            </div>

            <!-- Password -->
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="ri-lock-line text-indigo-300/60 group-focus-within:text-indigo-200 transition-colors"></i>
              </div>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Password"
                class="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3.5 text-white placeholder-white/30 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 focus:bg-white/10 transition-all duration-300 outline-none"
                :class="{ 'border-red-400/40': validationError }"
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300/60 hover:text-indigo-200 transition-colors"
              >
                <i :class="showPassword ? 'ri-eye-line' : 'ri-eye-off-line'"></i>
              </button>
            </div>

            <!-- Validation hint -->
            <p v-if="validationError" class="text-xs text-red-300/80 flex items-center gap-1.5 mt-1">
              <i class="ri-error-warning-line"></i> Email and password are required.
            </p>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="!loading">Sign In</span>
              <span v-else class="flex items-center gap-2">
                <i class="ri-loader-4-line animate-spin text-lg"></i> Signing In...
              </span>
            </button>
          </form>

          <!-- Security Badge -->
          <div class="mt-6 flex items-center justify-center gap-2 text-xs text-white/30 border-t border-white/5 pt-5">
            <i class="ri-shield-check-line text-indigo-300/50"></i>
            <span>Platform Administrator Access</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/AuthStore.js'
import api from '../../services/api.js'
import Swal from 'sweetalert2'

// --- State ---
const email = ref('superadmin@poolmanagement.com')
const password = ref('12345678')
const showPassword = ref(false)
const loading = ref(false)
const validationError = ref(false)

// --- Store & Router ---
const authStore = useAuthStore()
const router = useRouter()

// --- Login Handler ---
const handleLogin = async () => {
  validationError.value = false

  // Client-side validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value || !password.value || !emailRegex.test(email.value)) {
    validationError.value = true
    await Swal.fire({
      icon: 'warning',
      title: 'Invalid Input',
      text: 'Please enter a valid email and password.',
      background: '#1e1b2e',
      color: '#e2e8f0',
      confirmButtonColor: '#7c3aed',
    })
    return
  }

  loading.value = true
  try {
    const response = await api().post('/platform/admin/login', {
      email: email.value,
      password: password.value,
    })

    // Handle both wrapped and direct responses
    const data = response.data.data || response.data
    const { admin, token } = data

    if (!admin || !token) {
      throw new Error('Invalid response from server')
    }

    // Prepare user object for store
    const user = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '',
      avatar: admin.avatar || null,

      roles: Array.isArray(admin.roles) ? admin.roles : [admin.role || 'admin'],
      permissions: admin.permissions || [],
    }

    // Determine primary role (first in array or default)
    const primaryRole = user.roles[0] || 'admin'

    // Store auth via Pinia (adapt to your store's actual signature)
    // If your store expects (user, token, role), use:
    authStore.login(user, token, primaryRole, 'admin')

    // If your store also stores company info, add it (ensure the store has these properties)
    if (authStore.companyName !== undefined) {
      authStore.companyName = 'Platform Administration'
      authStore.companyId = 'platform'
    }
    
    router.push('/admin/dashboard')
    // Success alert
    await Swal.fire({
      icon: 'success',
      title: 'Welcome Back',
      text: admin.name || 'Admin',
      background: '#1e1b2e',
      color: '#e2e8f0',
      confirmButtonColor: '#7c3aed',
      timer: 2000,
      timerProgressBar: true,
    })

  } catch (error) {
    let message = 'Invalid admin credentials.'
    if (error.response?.data?.message) {
      message = error.response.data.message
    } else if (error.response?.data?.error) {
      message = error.response.data.error
    } else if (error.message) {
      message = error.message
    }
    await Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: message,
      background: '#1e1b2e',
      color: '#e2e8f0',
      confirmButtonColor: '#7c3aed',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b0918; /* deep dark base */
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  /* subtle glass texture overlay */
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
                radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
}

/* smooth transitions for inputs */
input {
  &::placeholder {
    transition: opacity 0.2s;
  }
  &:focus::placeholder {
    opacity: 0.4;
  }
}

/* button hover glow */
button[type="submit"]:not(:disabled):hover {
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
}

/* custom scroll / selection */
::selection {
  background: #7c3aed;
  color: #fff;
}
</style>