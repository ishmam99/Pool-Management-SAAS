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
      <div class="absolute inset-0 bg-gradient-to-r from-violet-900/60 via-indigo-900/40 to-transparent"></div>
    </div>

    <div class="container relative px-4 mx-auto">
      <div class="flex flex-col items-center gap-12 lg:flex-row">
        <!-- Hero Content -->
        <div class="flex-1 space-y-8 text-center lg:text-left text-white">
          <h1 class="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            Smart Pool Management
            <span class="block text-transparent bg-gradient-to-r from-amber-300 via-rose-300 to-pink-300 bg-clip-text">
              Made Simple
            </span>
          </h1>
          <p class="max-w-xl mx-auto text-lg text-white/90 lg:mx-0 lg:text-xl">
            Manage pools, customers, maintenance schedules, and services from one powerful platform designed for modern pool businesses.
          </p>
          <div class="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <button class="px-10 py-4 text-base font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:shadow-xl hover:scale-105 hover:shadow-amber-500/40">
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
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ─── Import images ──────────────────────────────────────────
import img1 from '../../../../assets/provider/img1.jpg'
import img2 from '../../../../assets/provider/img2.jpg'
import img3 from '../../../../assets/provider/img3.jpg'
import img4 from '../../../../assets/provider/img4.jpg'
import img5 from '../../../../assets/provider/img5.jpg'
import img6 from '../../../../assets/provider/img6.jpg'
import img7 from '../../../../assets/provider/img7.jpg'

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

onMounted(() => {
  interval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>