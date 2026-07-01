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
          Simple Process
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
          How It <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Works</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Getting your pool professionally maintained is easy. Follow these four simple steps and enjoy a crystal clear pool all year long.
        </p>
      </div>

      <!-- Steps Grid -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
        <!-- Connector lines (desktop) -->
        <div class="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 z-0">
          <div class="w-full h-full bg-gradient-to-r from-sky-200 via-cyan-200 to-sky-200 opacity-50"></div>
        </div>

        <div v-for="(step, index) in steps" :key="step.id" class="relative z-10">
          <div
            class="group relative bg-white/80 backdrop-blur-sm p-8 text-center rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-sky-200/50"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <!-- Glassmorphism glow -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/0 via-sky-500/0 to-cyan-500/0 group-hover:from-sky-500/5 group-hover:via-sky-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>

            <!-- Step Number -->
            <div class="relative inline-block mb-5">
              <div class="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400/20 to-cyan-400/20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-90 group-hover:scale-110"></div>
              <div
                class="relative w-16 h-16 mx-auto text-2xl font-bold text-white flex items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                :style="{ background: step.gradient }"
              >
                {{ index + 1 }}
              </div>
            </div>

            <!-- Icon -->
            <div class="flex justify-center mb-3">
              <i :class="step.icon" class="text-2xl text-sky-600/60 group-hover:text-sky-600 transition-colors duration-300"></i>
            </div>

            <!-- Title & Description -->
            <h3 class="text-xl font-bold text-slate-900 mb-2 relative z-10">{{ step.title }}</h3>
            <p class="text-sm text-slate-600 leading-relaxed relative z-10">{{ step.description }}</p>

            <!-- Decorative corner accent -->
            <div class="absolute -top-1 -right-1 w-12 h-12 rounded-tr-2xl bg-gradient-to-br from-sky-500/10 to-cyan-500/10 group-hover:from-sky-500/20 group-hover:to-cyan-500/20 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-14">
        <a
          href="#estimate-form"
          class="group inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Get Started Today
          <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
// ─── Steps Data ──────────────────────────────────────────────────
const steps = [
  {
    id: 1,
    icon: 'ri-calendar-check-line',
    gradient: 'linear-gradient(135deg, #0284C7, #22D3EE)',
    title: 'Request Service',
    description: 'Book online or give us a call. We\'ll find a time that works for your schedule.',
  },
  {
    id: 2,
    icon: 'ri-search-eye-line',
    gradient: 'linear-gradient(135deg, #0EA5E9, #10B981)',
    title: 'Pool Inspection',
    description: 'Our technicians assess your pool\'s condition and identify any underlying issues.',
  },
  {
    id: 3,
    icon: 'ri-tools-line',
    gradient: 'linear-gradient(135deg, #10B981, #22D3EE)',
    title: 'Professional Service',
    description: 'Complete cleaning, water balancing, and equipment maintenance performed with care.',
  },
  {
    id: 4,
    icon: 'ri-emotion-happy-line',
    gradient: 'linear-gradient(135deg, #22D3EE, #0284C7)',
    title: 'Enjoy Your Pool',
    description: 'Relax and swim while we handle the maintenance and keep your pool crystal clear.',
  },
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