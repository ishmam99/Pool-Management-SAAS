<template>
  <section class="relative pt-20 pb-32 overflow-hidden">
    <!-- Slider Background -->
    <div
      class="absolute inset-0 transition-all duration-700 ease-in-out"
      :style="{
        backgroundImage: `url(${slides[currentSlide].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-sky-900/60 via-blue-900/40 to-transparent"></div>
    </div>

    <div class="container relative px-4 mx-auto">
      <div class="flex flex-col items-center gap-12 lg:flex-row">
        <!-- Hero Content -->
        <div class="flex-1 space-y-8 text-center lg:text-left text-white">
          <h1 class="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span class="block text-transparent bg-gradient-to-r from-amber-300 via-rose-300 to-pink-300 bg-clip-text">
              {{ websiteStore.siteName }}
            </span>
          </h1>
          <p v-if="websiteStore.tagline" class="max-w-xl mx-auto text-lg text-white/90 lg:mx-0 lg:text-xl">
            {{ websiteStore.tagline }}
          </p>
          <div class="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <a
              v-if="websiteStore.phone"
              :href="websiteStore.phoneHref"
              class="px-10 py-4 text-base font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:shadow-xl hover:scale-105 hover:shadow-sky-500/40"
            >
              Call Now
            </a>
            <router-link
              v-if="websiteStore.showContact"
              to="/provider-website/join-us"
              class="px-10 py-4 text-base font-semibold text-white transition-all duration-300 rounded-xl border-2 border-white/60 hover:bg-white/10"
            >
              Contact Us
            </router-link>
            <button
              v-else
              @click="handleQuoteRequest"
              class="px-10 py-4 text-base font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:shadow-xl hover:scale-105 hover:shadow-sky-500/40"
            >
              Request Quote
            </button>
          </div>
        </div>

        <!-- You can uncomment the dashboard preview if needed -->
      </div>

      <!-- Slider Controls -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <button
          @click="prevSlide"
          class="p-2 text-white/80 hover:text-white transition-colors rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            @click="currentSlide = index"
            class="h-2 rounded-full transition-all duration-300"
            :class="currentSlide === index ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'"
          ></button>
        </div>
        <button
          @click="nextSlide"
          class="p-2 text-white/80 hover:text-white transition-colors rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>z`
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useWebsiteStore } from '../../store/websiteStore.js'
// ─── Import images ──────────────────────────────────────────
import img1 from '../../../../assets/provider/img1.jpg'
import img2 from '../../../../assets/provider/img2.jpg'
import img3 from '../../../../assets/provider/img3.jpg'
import img4 from '../../../../assets/provider/img4.jpg'
import img5 from '../../../../assets/provider/img5.jpg'
import img6 from '../../../../assets/provider/img6.jpg'
import img7 from '../../../../assets/provider/img7.jpg'
const router = useRouter()
const websiteStore = useWebsiteStore()
const slides = [
  { image: img1 },
  { image: img2 },
  { image: img3 },
  { image: img4 },
  { image: img5 },
  { image: img6 },
  { image: img7 },
]

const currentSlide = ref(0)
let interval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

// ─── Handle Quote Request with SweetAlert2 ──────────────────
const handleQuoteRequest = async () => {
  const result = await Swal.fire({
    title: 'Request a Quote',
    icon: 'question',
    iconColor: '#0EA5E9',
    showCancelButton: true,
    confirmButtonColor: '#0EA5E9',
    cancelButtonColor: '#10B981',
    confirmButtonText: 'Create an Account',
    cancelButtonText: 'Login Now',
    reverseButtons: true,
    background: '#ffffff',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    customClass: {
      popup: 'rounded-2xl shadow-2xl',
      confirmButton: 'px-6 py-3 text-base font-semibold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300',
      cancelButton: 'px-6 py-3 text-base font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-300',
    },
    buttonsStyling: true,
  })

  if (result.isConfirmed) {
    // Create Account → go to registration
    await Swal.fire({
      icon: 'success',
      title: 'Great!',
      text: 'Redirecting you to our registration form...',
      timer: 1200,
      timerProgressBar: true,
      showConfirmButton: false,
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
      },
    })
    router.push('/provider-website/quote')  // or your registration route
  } 
  // 👇 Handle "Login Now" (cancel button)
  else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
    router.push('/provider-website/login')
  }
}

onMounted(() => {
  interval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>