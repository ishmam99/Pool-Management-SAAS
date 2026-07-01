<template>
  <section class="py-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/50">
    <!-- ============================================================ -->
    <!-- BACKGROUND DECORATIVE ELEMENTS                               -->
    <!-- ============================================================ -->
    <!-- Water wave pattern -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.04]">
      <svg class="absolute bottom-0 left-0 w-full h-48" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="#0284C7"/>
      </svg>
      <svg class="absolute top-0 left-0 w-full h-32 rotate-180" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="#06B6D4"/>
      </svg>
    </div>

    <!-- Floating blurred circles -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- ============================================================ -->
      <!-- SECTION HEADER                                               -->
      <!-- ============================================================ -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-5 shadow-lg shadow-sky-500/25">
          Trusted By Homeowners &amp; Businesses
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
          Delivering Crystal Clear Results <br class="hidden sm:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Every Day</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Our commitment to reliable service, experienced technicians, and exceptional customer care has made Aqua Clean Pools a trusted choice for residential and commercial pool maintenance.
        </p>
      </div>

      <!-- ============================================================ -->
      <!-- STATISTICS CARDS                                             -->
      <!-- ============================================================ -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
        <div
        v-for="(stat, index) in statistics"
        :key="stat.id"
        ref="statCards"
        class="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-100/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-sky-200/50"
        :style="{ animationDelay: `${index * 0.1}s` }"
        >
        <!-- Glassmorphism glow on hover -->
        <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/0 via-sky-500/0 to-cyan-500/0 group-hover:from-sky-500/5 group-hover:via-sky-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>

        <!-- Icon -->
        <div class="flex justify-center mb-4">
          <div class="relative">
            <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/20 to-cyan-400/20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-90 group-hover:scale-110"></div>
            <div
            class="relative w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            :style="{ background: stat.gradient }"
            >
            <i :class="stat.icon" class="text-2xl text-white"></i>
          </div>
        </div>
      </div>

      <!-- Number -->
      <p
      class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
      :style="{ color: stat.color }"
      >
      <span ref="counters">{{ stat.displayNumber }}</span>
    </p>

    <!-- Label -->
    <p class="text-sm font-semibold text-slate-700 mt-1.5">{{ stat.label }}</p>

    <!-- Supporting text -->
    <p class="text-xs text-slate-400 mt-0.5">{{ stat.subLabel }}</p>

    <!-- Decorative corner accent -->
    <div class="absolute -top-1 -right-1 w-12 h-12 rounded-tr-2xl bg-gradient-to-br from-sky-500/10 to-cyan-500/10 group-hover:from-sky-500/20 group-hover:to-cyan-500/20 transition-all duration-300 pointer-events-none"></div>
  </div>
</div>

<!-- ============================================================ -->
<!-- BOTTOM TRUST BAR                                             -->
<!-- ============================================================ -->
<div class="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto pt-4 border-t border-slate-200/50">
  <span
  v-for="badge in trustBadges"
  :key="badge"
  class="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300"
  >
  <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
  </svg>
  {{ badge }}
</span>
</div>
</div>
</section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// ─── Statistics Data ──────────────────────────────────────────────
const statistics = ref([
{
  id: 1,
  icon: 'ri-home-4-line',
  color: '#0284C7', // Sky Blue
  gradient: 'linear-gradient(135deg, #0284C7, #0EA5E9)',
  label: 'Pools Serviced',
  subLabel: 'Residential & Commercial',
  rawNumber: 2500,
  displayNumber: '0',
},
{
  id: 2,
  icon: 'ri-user-3-line',
  color: '#06B6D4', // Cyan
  gradient: 'linear-gradient(135deg, #06B6D4, #22D3EE)',
  label: 'Satisfied Customers',
  subLabel: '5-Star Service Experience',
  rawNumber: 1200,
  displayNumber: '0',
},
{
  id: 3,
  icon: 'ri-star-fill',
  color: '#F59E0B', // Amber
  gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
  label: 'Average Customer Rating',
  subLabel: 'Based on Verified Reviews',
  rawNumber: 4.9,
  displayNumber: '0.0',
  isStar: true,
},
{
  id: 4,
  icon: 'ri-time-line',
  color: '#10B981', // Emerald
  gradient: 'linear-gradient(135deg, #10B981, #34D399)',
  label: 'Years of Experience',
  subLabel: 'Professional Pool Care',
  rawNumber: 15,
  displayNumber: '0',
},
])

// ─── Trust Badges ─────────────────────────────────────────────────
const trustBadges = [
'Licensed & Insured',
'Certified Pool Technicians',
'Eco-Friendly Pool Care',
'Satisfaction Guaranteed',
]

// ─── Count-Up Animation ──────────────────────────────────────────
const counters = ref([])
const statCards = ref([])

let animationFrame = null
let hasAnimated = false

const animateNumber = (element, target, isStar = false) => {
  const duration = 2000
  const startTime = performance.now()
  const startValue = 0

  const update = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)

    if (isStar) {
      // For star rating, show with one decimal
      const current = startValue + (target - startValue) * eased
      element.textContent = current.toFixed(1) + '★'
    } else {
      const current = Math.floor(startValue + (target - startValue) * eased)
      element.textContent = current.toLocaleString() + '+'
    }

    if (progress < 1) {
      animationFrame = requestAnimationFrame(update)
    } else {
      // Final value
      if (isStar) {
        element.textContent = target.toFixed(1) + '★'
      } else {
        element.textContent = target.toLocaleString() + '+'
      }
    }
  }

  animationFrame = requestAnimationFrame(update)
}

const startCountUp = () => {
  if (hasAnimated) return
  hasAnimated = true

  const elements = document.querySelectorAll('[ref="counters"]')
  const stats = statistics.value

  elements.forEach((el, index) => {
    if (index < stats.length) {
      const stat = stats[index]
      const isStar = stat.isStar || false
      animateNumber(el, stat.rawNumber, isStar)
    }
  })
}

// ─── Intersection Observer ──────────────────────────────────────
let observer = null

onMounted(() => {
  // Use the statCards refs to detect visibility
  const cards = document.querySelectorAll('.group.relative')
  if (cards.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          startCountUp()
        }
      })
    },
    {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px',
    }
  )

  cards.forEach((card) => observer.observe(card))
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* Import Remix Icon CDN */
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css');

.container {
  max-width: 1280px;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Subtle floating animation for decorative elements */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Card hover animation delay for staggered effect */
.group {
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Number emphasis */
.text-4xl.md\:text-5xl {
  font-variant-numeric: tabular-nums;
}
</style>