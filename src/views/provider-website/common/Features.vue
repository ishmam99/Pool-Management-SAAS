<template>
  <section class="py-20 bg-slate-50">
    <div class="container mx-auto px-4 md:px-6">
      <!-- ============================================================ -->
      <!-- SECTION HEADER                                                -->
      <!-- ============================================================ -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full mb-5 shadow-lg shadow-sky-500/25">
          Why Choose Aqua Clean Pools
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
          Professional Pool Care <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">You Can Count On</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          From routine cleaning and water balancing to equipment inspections and emergency repairs, Aqua Clean Pools provides complete swimming pool care that keeps your pool beautiful, healthy, and ready to enjoy every day.
        </p>
      </div>

      <!-- ============================================================ -->
      <!-- SERVICE CARDS GRID                                            -->
      <!-- ============================================================ -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div
        v-for="(service, index) in services"
        :key="index"
        class="group bg-white rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 hover:border-sky-200/50"
        >
        <!-- Icon Container -->
        <div
        class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
        :style="{ backgroundColor: service.color }"
        >
        <i :class="service.icon" class="text-2xl text-white"></i>
      </div>

      <!-- Service Label -->
      <span class="inline-block text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full mb-2.5">
        {{ service.label }}
      </span>

      <!-- Title & Description -->
      <h3 class="text-lg font-bold text-slate-900 mb-2">{{ service.title }}</h3>
      <p class="text-sm text-slate-600 leading-relaxed mb-4">{{ service.description }}</p>

      <!-- Checkmarks -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span v-for="check in service.checks" :key="check" class="inline-flex items-center gap-1 text-xs text-slate-600">
          <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          {{ check }}
        </span>
      </div>

      <!-- Learn More -->
      <a
      href="#"
      class="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-blue-600 transition-colors duration-300 group/link"
      >
      Learn More
      <i class="ri-arrow-right-line text-base transition-transform duration-300 group-hover/link:translate-x-1"></i>
    </a>
  </div>
</div>

<!-- ============================================================ -->
<!-- SPLIT LAYOUT: MAINTENANCE PACKAGES                            -->
<!-- ============================================================ -->
<div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 mb-16">
  <!-- Left: Image -->
  <div class="relative h-72 lg:h-[420px] overflow-hidden">
    <img
    src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop&crop=center&auto=format"
    alt="Luxury swimming pool with crystal clear water"
    class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
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
    <span class="inline-block text-xs font-bold text-sky-600 uppercase tracking-wider">Maintenance Plans</span>
    <h3 class="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
      Complete Pool Maintenance <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Packages</span>
    </h3>
    <p class="text-slate-600 leading-relaxed">
      Whether you need weekly cleaning, seasonal maintenance, equipment inspections, or emergency repairs, Aqua Clean Pools offers customized maintenance plans designed around your pool and your schedule.
    </p>

    <!-- Checklist -->
    <div class="grid grid-cols-2 gap-2 pt-2">
      <div v-for="item in packageChecks" :key="item" class="flex items-center gap-2.5">
        <div class="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <span class="text-sm text-slate-700">{{ item }}</span>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 pt-4">
      <button class="group px-8 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
        View Maintenance Plans
        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </button>
      <button class="px-8 py-3.5 border-2 border-sky-200 text-sky-700 font-semibold rounded-xl hover:bg-sky-50 hover:border-sky-300 transition-all duration-300">
        Book Free Inspection
      </button>
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- BOTTOM CTA BANNER                                             -->
<!-- ============================================================ -->
<div class="relative bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600 rounded-3xl py-16 px-6 md:py-20 md:px-12 text-center overflow-hidden shadow-2xl shadow-sky-500/20">
  <!-- Decorative elements -->
  <div class="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

  <!-- Wave decorations -->
  <div class="absolute bottom-0 left-0 w-full h-24 opacity-10 pointer-events-none">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" class="w-full h-full">
      <path d="M0,60 C360,120 720,0 1080,60 L1440,0 L1440,120 L0,120 Z" fill="white"/>
    </svg>
  </div>
  <div class="absolute top-0 left-0 w-full h-24 rotate-180 opacity-10 pointer-events-none">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" class="w-full h-full">
      <path d="M0,60 C360,120 720,0 1080,60 L1440,0 L1440,120 L0,120 Z" fill="white"/>
    </svg>
  </div>

  <div class="relative z-10 max-w-2xl mx-auto">
    <!-- Glassmorphism inner card -->
    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20">
      <h3 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
        Ready To Enjoy A Cleaner, <span class="text-sky-200">Healthier Pool?</span>
      </h3>
      <p class="text-white/90 text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
        Let Aqua Clean Pools handle the maintenance while you spend more time enjoying your swimming pool.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button class="group inline-flex items-center px-8 py-3.5 bg-white text-sky-700 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
          Schedule Service
          <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
        <button class="inline-flex items-center px-8 py-3.5 bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/30 hover:-translate-y-0.5 transition-all duration-300">
          Get Free Estimate
        </button>
      </div>
      <div class="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-white/20">
        <span class="inline-flex items-center gap-2 text-sm text-white/80">
          <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          Certified Technicians
        </span>
        <span class="inline-flex items-center gap-2 text-sm text-white/80">
          <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          Licensed & Insured
        </span>
        <span class="inline-flex items-center gap-2 text-sm text-white/80">
          <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          Satisfaction Guaranteed
        </span>
      </div>
    </div>
  </div>
</div>
</div>
</section>
</template>

<script setup>
// ─── Service Cards Data ─────────────────────────────────────────────
const services = [
{
  title: 'Weekly Pool Cleaning',
  label: 'Cleaning',
  icon: 'ri-water-flash-line',
  color: '#0284C7',
  description: 'Regular cleaning that includes skimming, vacuuming, brushing walls, and removing debris to keep your pool sparkling clean.',
  checks: ['Skimming', 'Vacuuming', 'Brushing', 'Debris removal'],
},
{
  title: 'Water Testing & Chemical Balancing',
  label: 'Water Chemistry',
  icon: 'ri-flask-line',
  color: '#06B6D4',
  description: 'Professional testing and precise chemical balancing to ensure safe, crystal-clear water for your family and guests.',
  checks: ['pH balancing', 'Alkalinity', 'Sanitizer levels', 'Water clarity'],
},
{
  title: 'Pool Equipment Inspection',
  label: 'Equipment',
  icon: 'ri-tools-line',
  color: '#2563EB',
  description: 'Routine inspections of pumps, filters, heaters, and other equipment to prevent costly repairs and extend lifespan.',
  checks: ['Pumps', 'Filters', 'Heaters', 'Automation'],
},
{
  title: 'Filter Cleaning & Maintenance',
  label: 'Maintenance',
  icon: 'ri-filter-line',
  color: '#10B981',
  description: 'Improve water circulation and efficiency with professional filter cleaning and maintenance for all filter types.',
  checks: ['Sand filters', 'Cartridge', 'DE filters', 'Backwashing'],
},
{
  title: 'Green Pool Recovery',
  label: 'Restoration',
  icon: 'ri-leaf-line',
  color: '#8B5CF6',
  description: 'Fast algae treatment and water restoration to transform cloudy green pools into crystal-clear, swimmable water.',
  checks: ['Algae treatment', 'Shocking', 'Clarifying', 'Restoration'],
},
{
  title: 'Pool Repairs',
  label: 'Repairs',
  icon: 'ri-hammer-line',
  color: '#F59E0B',
  description: 'Reliable repair services for pumps, plumbing, leaks, lighting, and all pool equipment components.',
  checks: ['Pump repair', 'Leak detection', 'Plumbing', 'Lighting'],
},
{
  title: 'Commercial Pool Maintenance',
  label: 'Commercial',
  icon: 'ri-building-2-line',
  color: '#EC4899',
  description: 'Professional maintenance programs for hotels, apartments, HOAs, gyms, and commercial facilities.',
  checks: ['Hotels', 'Apartments', 'HOAs', 'Fitness centers'],
},
{
  title: 'Emergency Pool Service',
  label: 'Emergency',
  icon: 'ri-alarm-warning-line',
  color: '#F97316',
  description: 'Need urgent pool service? Our experienced technicians respond quickly to restore your pool to perfect condition.',
  checks: ['24/7 response', 'Quick diagnosis', 'Fast repair', 'Peace of mind'],
},
]

// ─── Package Checklist ─────────────────────────────────────────────
const packageChecks = [
'Weekly Pool Cleaning',
'Water Testing',
'Chemical Balancing',
'Equipment Inspection',
'Filter Cleaning',
'Priority Support',
]
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
</style>