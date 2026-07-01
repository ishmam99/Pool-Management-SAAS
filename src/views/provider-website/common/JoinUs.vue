<template>
  <main class="join-us-page">
    <!-- Hero Section -->
    <section class="py-20 md:py-24 bg-gradient-to-br from-slate-50 to-sky-50 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-sky-500/5 to-cyan-500/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div class="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div class="max-w-3xl">
          <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
            Join Pool Management SaaS
          </span>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4">
            Grow Your Pool Business With Smart Management Tools
          </h1>
          <p class="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
            Whether you manage multiple swimming pools or own a private pool, our platform helps
            you simplify maintenance, scheduling, communication, and service management.
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="#join-form" class="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300">
              Request To Join
            </a>
            <a href="#why-join" class="inline-flex items-center px-8 py-3.5 bg-white text-sky-600 font-semibold rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Join Request Form Section -->
    <section id="join-form" class="py-16 md:py-20 bg-slate-50">
      <div class="container mx-auto px-4 md:px-6 max-w-7xl">
        <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-10 lg:p-12">
          <div class="text-center mb-8">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Request Access</h2>
            <p class="text-slate-600">Tell us about yourself and we will contact you shortly.</p>
          </div>

          <form @submit.prevent="submitForm" class="space-y-5">
            <!-- Account Type -->
            <div>
              <label for="accountType" class="block text-sm font-medium text-slate-700 mb-1.5">
                Account Type <span class="text-red-500">*</span>
              </label>
              <select
                id="accountType"
                v-model="form.accountType"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 appearance-none"
                required
              >
                <option value="" disabled>Select account type</option>
                <option
                  v-for="type in accountTypes"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </option>
              </select>
            </div>

            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                placeholder="Enter your full name"
                required
              />
            </div>

            <!-- Business / Company Name (Provider only) -->
            <div v-if="form.accountType === 'provider'">
              <label for="companyName" class="block text-sm font-medium text-slate-700 mb-1.5">
                Business / Company Name <span class="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                v-model="form.companyName"
                type="text"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                placeholder="Enter company name"
                required
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number <span class="text-red-500">*</span>
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <!-- Location -->
            <div>
              <label for="location" class="block text-sm font-medium text-slate-700 mb-1.5">
                Location <span class="text-red-500">*</span>
              </label>
              <input
                id="location"
                v-model="form.location"
                type="text"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                placeholder="Enter your service location"
                required
              />
            </div>

            <!-- Number of Pools (Provider only) -->
            <div v-if="form.accountType === 'provider'">
              <label for="poolCount" class="block text-sm font-medium text-slate-700 mb-1.5">
                Number of Pools <span class="text-red-500">*</span>
              </label>
              <input
                id="poolCount"
                v-model="form.poolCount"
                type="number"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                placeholder="How many pools do you manage?"
                min="0"
                required
              />
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-slate-700 mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                v-model="form.message"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 resize-y min-h-[100px]"
                rows="4"
                placeholder="Tell us more about your requirements"
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Why Join Us Section -->
    <section id="why-join" class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4 md:px-6 max-w-7xl">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            Why Join Us
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900">Designed For Pool Professionals &amp; Owners</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6 md:gap-8">
          <div class="group text-center p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-xl group-hover:shadow-sky-500/30 transition-all duration-300">
              <i class="ri-building-line text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">For Pool Service Providers</h3>
            <p class="text-slate-600 leading-relaxed">
              Manage customers, technicians, maintenance schedules, invoices, and daily
              operations from one dashboard.
            </p>
          </div>

          <div class="group text-center p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-xl group-hover:shadow-sky-500/30 transition-all duration-300">
              <i class="ri-home-heart-line text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">For Pool Owners</h3>
            <p class="text-slate-600 leading-relaxed">
              Find trusted pool professionals and easily manage your pool services and
              maintenance needs.
            </p>
          </div>

          <div class="group text-center p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-xl group-hover:shadow-sky-500/30 transition-all duration-300">
              <i class="ri-bar-chart-line text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">Grow Your Business</h3>
            <p class="text-slate-600 leading-relaxed">
              Use analytics and smart tools to improve efficiency, customer satisfaction, and
              business performance.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- David Image / Trust Section -->
    <section class="py-16 md:py-20 bg-slate-50">
      <div class="container mx-auto px-4 md:px-6 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-10 lg:p-12">
          <!-- Image -->
          <div class="flex justify-center lg:justify-start">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-full opacity-20 blur-2xl scale-110"></div>
              <img
                src="/src/assets/david.jpg"
                alt="David - Pool Management Expert"
                class="relative w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-sky-100 shadow-xl"
              />
            </div>
          </div>

          <!-- Content -->
          <div class="text-center lg:text-left">
            <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              Trusted Pool Management Platform
            </span>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Meet David</h2>
            <p class="text-slate-600 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
              David helps pool professionals transform their operations using modern technology
              and efficient management solutions.
            </p>
            <div class="flex flex-wrap gap-8 justify-center lg:justify-start">
              <div>
                <div class="text-2xl font-bold text-sky-600">500+</div>
                <div class="text-sm text-slate-600">Pool Professionals</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-sky-600">98%</div>
                <div class="text-sm text-slate-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="py-16 md:py-20">
      <div class="container mx-auto px-4 md:px-6 max-w-7xl">
        <div class="bg-gradient-to-r from-sky-600 to-cyan-500 rounded-2xl shadow-2xl shadow-sky-500/20 p-8 md:p-12 lg:p-16 text-center">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Ready To Transform Your Pool Management?
          </h2>
          <p class="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join our growing community of pool professionals and customers today.
          </p>
          <a
            href="#join-form"
            class="inline-flex items-center px-8 py-3.5 bg-white text-sky-600 font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
      <div class="bg-white rounded-2xl p-8 md:p-10 max-w-md w-full text-center shadow-2xl animate-in slide-in-from-bottom-8 duration-400">
        <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <i class="ri-check-line text-4xl text-white"></i>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 mb-2">Request Submitted Successfully!</h3>
        <p class="text-slate-600 mb-6">Thank you for your interest. Our team will contact you soon.</p>
        <button
          @click="closeModal"
          class="px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue'

const accountTypes = [
  { label: 'Pool Service Provider', value: 'provider' },
  { label: 'Pool Owner', value: 'customer' },
]

const form = ref({
  accountType: '',
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  location: '',
  poolCount: '',
  message: '',
})

const showSuccess = ref(false)

// Reset company name and pool count when account type changes
watch(
  () => form.value.accountType,
  () => {
    if (form.value.accountType === 'customer') {
      form.value.companyName = ''
      form.value.poolCount = ''
    }
  }
)

const submitForm = () => {
  // Here you would typically send the data to your API
  // POST /join-request
  console.log('Form submitted:', form.value)

  // Show success modal
  showSuccess.value = true

  // Reset form (optional - uncomment if needed)
  // form.value = {
  //   accountType: '',
  //   fullName: '',
  //   companyName: '',
  //   email: '',
  //   phone: '',
  //   location: '',
  //   poolCount: '',
  //   message: '',
  // }
}

const closeModal = () => {
  showSuccess.value = false
}
</script>

<style scoped>
/* Import Remix Icon CDN (if not already imported globally) */
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css');

/* Tailwind CSS animations are used via Tailwind classes */
/* Additional smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom animation classes for modal (fallback if Tailwind animations not configured) */
.animate-in {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.slide-in-from-bottom-8 {
  animation-name: slideInUp;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>