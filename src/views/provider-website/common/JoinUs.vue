<template>
  <div class="min-h-screen bg-white">
    <!-- ============================================================ -->
    <!-- HERO SECTION                                                  -->
    <!-- ============================================================ -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-sky-900 py-20 lg:py-28">
      <!-- Background image -->
      <div class="absolute inset-0 opacity-30">
        <img
        src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1920&h=800&fit=crop&crop=center&auto=format"
        alt="Luxury swimming pool"
        class="w-full h-full object-cover"
        />
      </div>

      <!-- Decorative blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-20 -right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 container mx-auto px-4">
        <div class="max-w-3xl">
          <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-6 border border-white/10">
            Book Professional Pool Service
          </span>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Let's Make Your Pool <span class="text-sky-300">Crystal Clear</span>
          </h1>
          <p class="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mb-8">
            Whether you need weekly maintenance, water balancing, equipment repairs, or a one-time cleaning, Aqua Clean Pools is here to help.
          </p>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- REQUEST A FREE ESTIMATE FORM                                  -->
    <!-- ============================================================ -->
    <section id="estimate-form" class="py-20 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-10">
            <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4 shadow-lg shadow-sky-500/25">
              Get Started
            </span>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Request a Free Estimate</h2>
            <p class="text-slate-600 text-lg">Fill out the form below and our team will contact you with a customized quote.</p>
          </div>

          <!-- Form Card -->
          <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 lg:p-12 border border-slate-100">
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Full Name -->
              <div>
                <label for="fullName" class="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800"
                placeholder="Enter your full name"
                required
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800"
                placeholder="Enter your email"
                required
                />
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800"
                placeholder="Enter your phone number"
                required
                />
              </div>

              <!-- Service Address -->
              <div>
                <label for="address" class="block text-sm font-semibold text-slate-700 mb-1.5">
                  Service Address <span class="text-red-500">*</span>
                </label>
                <input
                id="address"
                v-model="form.address"
                type="text"
                class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800"
                placeholder="Enter your service address"
                required
                />
              </div>

              <!-- Property Type -->
              <div>
                <label for="propertyType" class="block text-sm font-semibold text-slate-700 mb-1.5">
                  Property Type <span class="text-red-500">*</span>
                </label>
                <select
                id="propertyType"
                v-model="form.propertyType"
                class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 appearance-none text-slate-800"
                required
                >
                <option value="" disabled>Select property type</option>
                <option v-for="type in propertyTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>

            <!-- Service Needed -->
            <div>
              <label for="serviceNeeded" class="block text-sm font-semibold text-slate-700 mb-1.5">
                Service Needed <span class="text-red-500">*</span>
              </label>
              <select
              id="serviceNeeded"
              v-model="form.serviceNeeded"
              class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 appearance-none text-slate-800"
              required
              >
              <option value="" disabled>Select service</option>
              <option v-for="service in services" :key="service" :value="service">{{ service }}</option>
            </select>
          </div>

          <!-- Pool Type -->
          <div>
            <label for="poolType" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Pool Type <span class="text-red-500">*</span>
            </label>
            <select
            id="poolType"
            v-model="form.poolType"
            class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 appearance-none text-slate-800"
            required
            >
            <option value="" disabled>Select pool type</option>
            <option v-for="type in poolTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <!-- Preferred Service Date -->
        <div>
          <label for="serviceDate" class="block text-sm font-semibold text-slate-700 mb-1.5">
            Preferred Service Date
          </label>
          <input
          id="serviceDate"
          v-model="form.serviceDate"
          type="date"
          class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 text-slate-800"
          />
        </div>

        <!-- Preferred Contact Method -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Preferred Contact Method <span class="text-red-500">*</span>
          </label>
          <div class="flex flex-wrap gap-4">
            <label v-for="method in contactMethods" :key="method" class="flex items-center gap-2.5 cursor-pointer">
              <input
              type="radio"
              :value="method"
              v-model="form.contactMethod"
              class="w-4 h-4 text-sky-600 border-slate-300 focus:ring-sky-500"
              required
              />
              <span class="text-sm text-slate-700">{{ method }}</span>
            </label>
          </div>
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-sm font-semibold text-slate-700 mb-1.5">
            Message
          </label>
          <textarea
          id="message"
          v-model="form.message"
          class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800 resize-y min-h-[110px]"
          rows="4"
          placeholder="Tell us about your pool, any issues you're experiencing, or the services you're looking for."
          ></textarea>
        </div>

        <!-- Submit -->
        <button
        type="submit"
        class="w-full py-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300 text-lg"
        >
        Request My Free Estimate
      </button>
    </form>
  </div>
</div>
</div>
</section>

<!-- ============================================================ -->
<!-- SERVICE AREAS WE COVER                                        -->
<!-- ============================================================ -->
<section v-if="serviceAreas.length > 0" class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4 shadow-lg shadow-sky-500/25">
          Service Areas
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">We Proudly Serve These Communities</h2>
        <p class="text-slate-600 text-lg">We provide reliable pool maintenance and repair services throughout these locations.</p>
      </div>

      <!-- Info Banner -->
      <div class="mb-8 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/50 rounded-2xl px-6 py-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-slate-700">
          Not sure if you're in our service area? Submit the form above and our team will confirm availability.
        </p>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
          <div class="h-8 bg-slate-200 rounded-lg w-3/4 mb-2"></div>
          <div class="h-5 bg-slate-200 rounded-lg w-1/2 mb-3"></div>
          <div class="h-4 bg-slate-200 rounded-lg w-1/3"></div>
          <div class="mt-4 h-6 bg-slate-200 rounded-full w-1/4"></div>
        </div>
      </div>

      <!-- Service Area Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
        v-for="area in serviceAreas"
        :key="area.id || area.city"
        class="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-sky-200"
        >
        <div class="space-y-2">
          <h3 class="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-300">
            {{ area.city }}
          </h3>
          <p class="text-base text-slate-600 font-medium">{{ area.state }}</p>
          <span class="inline-block bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full border border-slate-200">
            ZIP {{ area.zip_code }}
          </span>
          <div class="flex items-center gap-2 pt-2">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span class="text-xs font-medium text-emerald-600">Available</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</section>


<!-- ============================================================ -->
<!-- SUCCESS MODAL                                                 -->
<!-- ============================================================ -->
<div v-if="showSuccess" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
  <div class="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full text-center shadow-2xl animate-in slide-in-from-bottom-8 duration-400">
    <div class="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
      <i class="ri-check-line text-4xl text-white"></i>
    </div>
    <h3 class="text-2xl font-bold text-slate-900 mb-3">Thank You!</h3>
    <p class="text-slate-600 leading-relaxed mb-6">
      We've received your request. One of our pool care specialists will contact you shortly to discuss your service needs.
    </p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <button
      @click="closeModal"
      class="px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300"
      >
      Return Home
    </button>
    <button
    @click="closeModal"
    class="px-8 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
    >
    Book Another Service
  </button>
</div>
</div>
</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useWebsiteStore } from '../store/websiteStore.js'
import { tenantWebsiteApi, normalizeList, getApiErrorMessage } from '../../../services/tenantWebsiteApi.js'

const websiteStore = useWebsiteStore()
const submitting = ref(false)
const loading = ref(true)

// ─── Form Data ──────────────────────────────────────────────────────
const form = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  propertyType: '',
  serviceNeeded: '',
  poolType: '',
  serviceDate: '',
  contactMethod: '',
  message: '',
})

const showSuccess = ref(false)

// ─── Form Options ──────────────────────────────────────────────────
const propertyTypes = [
  'Residential Home',
  'Apartment Community',
  'Hotel',
  'HOA',
  'Commercial Property',
  'Vacation Rental',
  'Other',
]

const services = [
  'Weekly Pool Cleaning',
  'One-Time Cleaning',
  'Chemical Balancing',
  'Pool Inspection',
  'Equipment Repair',
  'Green Pool Recovery',
  'Commercial Maintenance',
  'Emergency Service',
]

const poolTypes = [
  'In-Ground',
  'Above Ground',
  'Saltwater',
  'Chlorine',
  'Not Sure',
]

const contactMethods = ['Phone', 'Email', 'Text Message']

// ─── Why Choose Us Reasons ──────────────────────────────────────
const reasons = [
{
  icon: 'ri-shield-check-line',
  title: 'Licensed & Insured',
  description: 'Professional technicians you can trust with full licensing and insurance coverage.',
},
{
  icon: 'ri-calendar-check-line',
  title: 'Weekly Maintenance',
  description: 'Reliable recurring service that keeps your pool clean and healthy year-round.',
},
{
  icon: 'ri-flashlight-line',
  title: 'Fast Response',
  description: 'Quick scheduling and prompt arrival for all your pool service needs.',
},
{
  icon: 'ri-emotion-happy-line',
  title: 'Satisfaction Guaranteed',
  description: 'We\'re committed to exceptional service and complete customer satisfaction.',
},
]

// ─── Service Areas ─────────────────────────────────────────────────
const serviceAreas = ref([])
const serviceAreasLegacy = ref([
  'Residential Pools',
  'Hotels',
  'HOAs',
  'Apartments',
  'Commercial Pools',
  'Luxury Homes',
])

// Fetch service areas from API
const fetchServiceAreas = async () => {
  loading.value = true
  try {
    const data = await tenantWebsiteApi.getServiceAreas()
    
    // Filter active areas and sort by order_index
    const activeAreas = data
      .filter(area => area.is_active === true)
      .sort((a, b) => {
        const orderA = parseInt(a.order_index) || 0
        const orderB = parseInt(b.order_index) || 0
        return orderA - orderB
      })
    
    serviceAreas.value = activeAreas
  } catch (error) {
    console.error('Failed to fetch service areas:', error)
    // Gracefully handle error - leave serviceAreas as empty array
    serviceAreas.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchServiceAreas()
})

// ─── Steps ─────────────────────────────────────────────────────────
const steps = [
{
  number: '01',
  icon: 'ri-file-list-3-line',
  title: 'Submit Request',
  description: 'Fill out our quick form and tell us about your pool.',
},
{
  number: '02',
  icon: 'ri-phone-line',
  title: 'We Contact You',
  description: 'Our team will reach out to schedule a convenient time.',
},
{
  number: '03',
  icon: 'ri-search-eye-line',
  title: 'Free Pool Inspection',
  description: 'We assess your pool and provide a customized quote.',
},
{
  number: '04',
  icon: 'ri-water-flash-line',
  title: 'Enjoy Your Pool',
  description: 'Relax while we keep your pool crystal clear and worry-free.',
},
]

// ─── Form Submission ─────────────────────────────────────────────
const submitForm = async () => {
  submitting.value = true
  try {
    const res = await tenantWebsiteApi.submitContact({
      name: form.value.fullName,
      email: form.value.email,
      phone: form.value.phone,
      message: form.value.message || `Property: ${form.value.propertyType}. Pool: ${form.value.poolType}. Service: ${form.value.serviceNeeded}. Preferred contact: ${form.value.contactMethod}. Address: ${form.value.address}.`,
      service_interest: form.value.serviceNeeded,
    })
    showSuccess.value = true
    await Swal.fire({
      icon: 'success',
      title: 'Message Sent',
      text: res?.message || 'Your message has been sent.',
    })
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Error', text: getApiErrorMessage(e, 'Failed to send message.') })
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showSuccess.value = false
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* Import Remix Icon CDN */
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css');

.container {
  max-width: 1280px;
}

html {
  scroll-behavior: smooth;
}

/* Animations for modal */
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

/* Floating animation for map pin */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
</style>