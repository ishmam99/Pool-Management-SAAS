<template>
  <section class="py-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/50">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.04]">
      <svg class="absolute bottom-0 left-0 w-full h-48" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="#0284C7"/>
      </svg>
    </div>
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-5 shadow-lg shadow-sky-500/25">
          Why Choose Us
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
          The Aqua Clean Pools <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Difference</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Our commitment to excellence, experienced technicians, and customer-first approach set us apart as the trusted choice for pool care.
        </p>
      </div>

      <!-- Benefits Grid -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(benefit, index) in benefits"
          :key="benefit.id"
          class="group flex items-start gap-5 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 hover:border-sky-200/50"
          :style="{ animationDelay: `${index * 0.06}s` }"
        >
          <!-- Glassmorphism glow -->
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/0 via-sky-500/0 to-cyan-500/0 group-hover:from-sky-500/5 group-hover:via-sky-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>

          <!-- Icon -->
          <div class="relative flex-shrink-0 mt-1">
            <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/20 to-cyan-400/20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-90 group-hover:scale-110"></div>
            <div
              class="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              :style="{ background: benefit.gradient }"
            >
              <i :class="benefit.icon" class="text-xl text-white"></i>
            </div>
          </div>

          <!-- Content -->
          <div class="relative z-10">
            <h4 class="text-base font-bold text-slate-900 mb-1">{{ benefit.title }}</h4>
            <p class="text-sm text-slate-600 leading-relaxed">{{ benefit.description }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom Trust Bar -->
      <div class="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mt-12 pt-6 border-t border-slate-200/50">
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
// ─── Benefits Data ──────────────────────────────────────────────
const benefits = [
  {
    id: 1,
    icon: 'ri-user-star-line',
    gradient: 'linear-gradient(135deg, #0284C7, #22D3EE)',
    title: 'Certified Technicians',
    description: 'Our team is trained, licensed, and experienced in all aspects of professional pool care and maintenance.',
  },
  {
    id: 2,
    icon: 'ri-leaf-line',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    title: 'Eco-Friendly Approach',
    description: 'We use environmentally responsible products and methods that are safe for your family, pets, and the planet.',
  },
  {
    id: 3,
    icon: 'ri-calendar-check-line',
    gradient: 'linear-gradient(135deg, #0EA5E9, #10B981)',
    title: 'Reliable Scheduling',
    description: 'Consistent, dependable weekly service with no missed visits or surprises, so you can plan with confidence.',
  },
  {
    id: 4,
    icon: 'ri-emotion-happy-line',
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    title: '100% Satisfaction',
    description: 'We stand behind every service with a satisfaction guarantee, ensuring your pool is exactly how you want it.',
  },
  {
    id: 5,
    icon: 'ri-shield-check-line',
    gradient: 'linear-gradient(135deg, #6366F1, #818CF8)',
    title: 'Licensed & Insured',
    description: 'Full licensing, bonding, and insurance coverage for your peace of mind and protection.',
  },
  {
    id: 6,
    icon: 'ri-water-flash-line',
    gradient: 'linear-gradient(135deg, #22D3EE, #0284C7)',
    title: 'Crystal Clear Results',
    description: 'Our proven process delivers consistently clear, healthy, and safe swimming water you can enjoy with confidence.',
  },
]

// ─── Trust Badges ──────────────────────────────────────────────
const trustBadges = [
  'Certified Technicians',
  'Licensed & Insured',
  'Eco-Friendly Care',
  'Satisfaction Guaranteed',
  'Dependable Service',
]
</script>

<style scoped>
/* Import Remix Icon CDN */
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css');

.container {
  max-width: 1280px;
}

/* Card entrance animation */
.group {
  animation: fadeInUp 0.5s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>