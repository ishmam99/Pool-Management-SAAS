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

    <div class="container mx-auto px-4 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-5 shadow-lg shadow-sky-500/25">
          Our Services
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
          Complete Pool Care, <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">All in One Place</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Whether you need routine maintenance, emergency repairs, or seasonal pool care, Aqua Clean Pools provides dependable, professional services to keep your pool clean, healthy, and ready to enjoy.
        </p>
      </div>

      <!-- Service Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
        <div
          v-for="(service, index) in services"
          :key="index"
          class="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-100/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-sky-200/50"
          :style="{ animationDelay: `${index * 0.08}s` }"
        >
          <!-- Glassmorphism glow on hover -->
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/0 via-sky-500/0 to-cyan-500/0 group-hover:from-sky-500/5 group-hover:via-sky-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>

          <!-- Service Category Label -->
          <span class="inline-block text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full mb-3 relative z-10">
            {{ service.label }}
          </span>

          <!-- Icon -->
          <div class="relative z-10 flex items-start gap-4 mb-4">
            <div class="relative">
              <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/20 to-cyan-400/20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-90 group-hover:scale-110"></div>
              <div
                class="relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                :style="{ background: service.gradient }"
              >
                <i :class="service.icon" class="text-2xl text-white"></i>
              </div>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900">{{ service.title }}</h3>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-slate-600 leading-relaxed mb-4 relative z-10">{{ service.description }}</p>

          <!-- Small checklist -->
          <div class="flex flex-wrap gap-2 mb-4 relative z-10">
            <span v-for="check in service.checks" :key="check" class="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              <svg class="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
              {{ check }}
            </span>
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

      <!-- Bottom Split Section: Why Choose Aqua Clean Pools -->
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
        <!-- Left: Image -->
        <div class="relative h-64 lg:h-[420px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop&crop=center&auto=format"
            alt="Professional pool technician cleaning a luxury swimming pool"
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
          <span class="inline-block text-xs font-bold text-sky-600 uppercase tracking-wider">Why Choose Us</span>
          <h3 class="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            Why Choose <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Aqua Clean Pools</span>?
          </h3>
          <p class="text-slate-600 leading-relaxed">
            We bring years of expertise and a commitment to excellence in every service we provide. Here’s why homeowners and businesses trust us.
          </p>

          <!-- Bullet points -->
          <div class="grid sm:grid-cols-2 gap-3 pt-2">
            <div v-for="point in whyChooseUs" :key="point" class="flex items-center gap-2.5">
              <div class="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-sm text-slate-700">{{ point }}</span>
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
              View Maintenance Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// ─── Service Cards Data ──────────────────────────────────────────
const services = [
  {
    icon: 'ri-water-flash-line',
    gradient: 'linear-gradient(135deg, #0284C7, #0EA5E9)',
    label: 'Cleaning',
    title: 'Weekly Pool Cleaning',
    description: 'Comprehensive weekly service including skimming, vacuuming, brushing, and debris removal to keep your pool sparkling clean.',
    checks: ['Licensed Technicians', 'Quality Equipment', 'Reliable Service'],
  },
  {
    icon: 'ri-flask-line',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    label: 'Water Chemistry',
    title: 'Water Testing & Chemical Balancing',
    description: 'Professional water testing and chemical balancing to ensure safe, healthy, crystal-clear swimming conditions.',
    checks: ['Precise Testing', 'Safe Levels', 'Clear Water'],
  },
  {
    icon: 'ri-tools-line',
    gradient: 'linear-gradient(135deg, #6366F1, #818CF8)',
    label: 'Equipment',
    title: 'Equipment Inspection & Maintenance',
    description: 'Routine inspections of pumps, filters, heaters, and pool systems to maximize performance and prevent costly breakdowns.',
    checks: ['Preventive Care', 'Extended Lifespan', 'Peace of Mind'],
  },
  {
    icon: 'ri-leaf-line',
    gradient: 'linear-gradient(135deg, #14B8A6, #2DD4BF)',
    label: 'Restoration',
    title: 'Green Pool Recovery',
    description: 'Fast algae removal and deep cleaning services that restore green or cloudy pools back to crystal-clear condition.',
    checks: ['Algae Treatment', 'Deep Cleaning', 'Quick Results'],
  },
  {
    icon: 'ri-hammer-line',
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    label: 'Repairs',
    title: 'Pool Repairs',
    description: 'Professional repairs for pumps, filters, plumbing, lighting, leaks, and other pool equipment.',
    checks: ['Expert Technicians', 'Quality Parts', 'Fast Response'],
  },
  {
    icon: 'ri-building-2-line',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    label: 'Commercial',
    title: 'Commercial Pool Maintenance',
    description: 'Customized maintenance programs for hotels, apartment communities, HOAs, fitness centers, schools, and commercial facilities.',
    checks: ['Scheduled Service', 'Regulatory Compliance', 'High Standards'],
  },
]

// ─── Why Choose Us Points ────────────────────────────────────────
const whyChooseUs = [
  'Certified & Insured Professionals',
  'Weekly & One-Time Services',
  'Eco-Friendly Pool Care',
  'Flexible Scheduling',
  'Affordable Maintenance Plans',
  'Residential & Commercial Expertise',
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