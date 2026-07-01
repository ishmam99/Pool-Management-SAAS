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
          Who We Serve
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
          Professional Pool Care for <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Every Property</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Whether you own a backyard pool, manage a luxury community, or oversee a commercial facility, Aqua Clean Pools delivers dependable maintenance solutions tailored to your needs.
        </p>
      </div>

      <!-- Three Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
        <div
          v-for="(item, index) in serveCards"
          :key="index"
          class="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-100/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-sky-200/50"
          :style="{ animationDelay: `${index * 0.08}s` }"
        >
          <!-- Glassmorphism glow -->
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/0 via-sky-500/0 to-cyan-500/0 group-hover:from-sky-500/5 group-hover:via-sky-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>

          <!-- Best For Badge -->
          <span
            class="inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 relative z-10"
            :style="{ background: item.badgeBg, color: item.badgeColor }"
          >
            {{ item.badge }}
          </span>

          <!-- Icon -->
          <div class="relative z-10 mb-5">
            <div class="relative inline-block">
              <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/20 to-cyan-400/20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-90 group-hover:scale-110"></div>
              <div
                class="relative w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                :style="{ background: item.gradient }"
              >
                <i :class="item.icon" class="text-2xl text-white"></i>
              </div>
            </div>
          </div>

          <!-- Title & Description -->
          <h3 class="text-xl font-bold text-slate-900 mb-2 relative z-10">{{ item.title }}</h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-4 relative z-10">{{ item.description }}</p>

          <!-- Feature Checklist -->
          <div class="space-y-1.5 mb-5 relative z-10">
            <div v-for="feature in item.features" :key="feature" class="flex items-center gap-2.5">
              <div class="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" :style="{ background: item.checkBg }">
                <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-sm text-slate-700">{{ feature }}</span>
            </div>
          </div>

          <!-- Learn More -->
          <a
            href="#"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-blue-600 transition-colors duration-300 group/link relative z-10"
          >
            Learn More
            <i class="ri-arrow-right-line text-base transition-transform duration-300 group-hover/link:translate-x-1"></i>
          </a>

          <!-- Decorative corner accent -->
          <div class="absolute -top-1 -right-1 w-12 h-12 rounded-tr-2xl bg-gradient-to-br from-sky-500/10 to-cyan-500/10 group-hover:from-sky-500/20 group-hover:to-cyan-500/20 transition-all duration-300 pointer-events-none"></div>
        </div>
      </div>

      <!-- Split Section: No Matter Your Pool -->
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
        <!-- Left: Image -->
        <div class="relative h-64 lg:h-[420px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop&crop=center&auto=format"
            alt="Professional pool technician servicing a luxury swimming pool"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent"></div>
          <!-- Floating badge -->
          <div class="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-xl border border-white/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-slate-500">Satisfaction</p>
                <p class="text-sm font-bold text-slate-900">100% Guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Content -->
        <div class="p-6 md:p-10 lg:p-12 space-y-6">
          <span class="inline-block text-xs font-bold text-sky-600 uppercase tracking-wider">No Matter Your Pool</span>
          <h3 class="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            We've Got You <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Covered</span>
          </h3>
          <p class="text-slate-600 leading-relaxed">
            Our experienced technicians provide customized pool care plans based on your property's size, equipment, usage, and maintenance requirements.
          </p>

          <!-- Pool type checklist -->
          <div class="grid grid-cols-2 gap-2 pt-2">
            <div v-for="type in poolTypes" :key="type" class="flex items-center gap-2.5">
              <div class="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-sm text-slate-700">{{ type }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button class="group px-8 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Book Free Inspection
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
            <button class="px-8 py-3.5 border-2 border-sky-200 text-sky-700 font-semibold rounded-xl hover:bg-sky-50 hover:border-sky-300 transition-all duration-300">
              Request Free Estimate
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// ─── "Who We Serve" Cards ────────────────────────────────────────
const serveCards = [
  {
    icon: 'ri-home-4-line',
    gradient: 'linear-gradient(135deg, #0284C7, #22D3EE)',
    badge: 'Ideal for homeowners',
    badgeBg: '#E0F2FE',
    badgeColor: '#0284C7',
    title: 'Residential Pool Owners',
    description: 'Keep your backyard pool sparkling clean and swim-ready with dependable weekly maintenance, water balancing, and equipment inspections.',
    features: [
      'Weekly Pool Cleaning',
      'Chemical Balancing',
      'Equipment Checks',
      'Seasonal Maintenance',
      'Green Pool Recovery',
    ],
    checkBg: '#0284C7',
  },
  {
    icon: 'ri-building-2-line',
    gradient: 'linear-gradient(135deg, #1E3A5F, #0EA5E9)',
    badge: 'Ideal for businesses',
    badgeBg: '#DBEAFE',
    badgeColor: '#1E3A5F',
    title: 'Commercial Properties',
    description: 'Reliable maintenance programs designed for hotels, apartment communities, HOAs, fitness centers, schools, and commercial swimming pools.',
    features: [
      'Scheduled Maintenance',
      'Health & Safety Compliance',
      'Water Quality Testing',
      'Equipment Maintenance',
      'Emergency Repairs',
    ],
    checkBg: '#1E3A5F',
  },
  {
    icon: 'ri-sparkle-fill',
    gradient: 'linear-gradient(135deg, #10B981, #22D3EE)',
    badge: 'Ideal for luxury properties',
    badgeBg: '#D1FAE5',
    badgeColor: '#065F46',
    title: 'Luxury Estates & Vacation Homes',
    description: 'Premium concierge-style pool care for luxury homes and vacation properties, ensuring your pool is always pristine when you arrive.',
    features: [
      'Premium Weekly Service',
      'Vacation Property Care',
      'Priority Scheduling',
      'Detailed Pool Inspections',
      'Personalized Maintenance Plans',
    ],
    checkBg: '#10B981',
  },
]

// ─── Pool Types ──────────────────────────────────────────────────
const poolTypes = [
  'Residential Pools',
  'Commercial Pools',
  'Saltwater Pools',
  'Chlorine Pools',
  'Heated Pools',
  'Indoor Pools',
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
</style>