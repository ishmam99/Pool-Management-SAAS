<template>
  <section class="py-20 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-5">
          Powerful Features
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
          Everything You Need To Manage Swimming Pools Efficiently
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed">
          A complete pool management solution that helps service providers manage customers,
          maintenance schedules, technicians, payments, and daily operations from one powerful platform.
        </p>
      </div>

      <!-- Feature Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="group bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
            :style="{ backgroundColor: feature.color }"
          >
            <i :class="feature.icon" class="text-2xl text-white"></i>
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ feature.title }}</h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-4">{{ feature.description }}</p>
          <a
            href="#"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-blue-600 transition-colors duration-300 group/link"
          >
            Learn More
            <i class="ri-arrow-right-line text-base transition-transform duration-300 group-hover/link:translate-x-1"></i>
          </a>
        </div>
      </div>

      <!-- Bottom CTA Banner -->
      <div class="relative bg-gradient-to-r from-sky-600 to-cyan-500 rounded-2xl py-14 px-6 md:py-16 md:px-12 text-center overflow-hidden shadow-2xl shadow-sky-500/20">
        <!-- Decorative circles -->
        <div class="absolute -top-1/2 -right-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none"></div>
        <div class="absolute -bottom-1/2 -left-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none"></div>

        <div class="relative z-10 max-w-2xl mx-auto">
          <h3 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            Ready To Simplify Your Pool Management?
          </h3>
          <p class="text-white/90 text-base md:text-lg mb-8 max-w-lg mx-auto">
            Join hundreds of pool professionals managing their business smarter with our platform.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#"
              class="inline-flex items-center px-8 py-3.5 bg-white text-sky-600 font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </a>
            <a
              href="#"
              class="inline-flex items-center px-8 py-3.5 bg-white/20 text-white font-semibold rounded-full border border-white/30 backdrop-blur-sm hover:bg-white/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    title: 'Pool Management',
    description:
      'Manage unlimited swimming pools, track pool details, maintenance history, and service requirements easily.',
    icon: 'ri-water-flash-line',
    color: '#0284C7',
  },
  {
    title: 'Customer Management',
    description:
      'Keep all customer information, pool details, service history, and communication organized in one place.',
    icon: 'ri-user-community-line',
    color: '#06B6D4',
  },
  {
    title: 'Maintenance Scheduling',
    description:
      'Create, schedule, and track recurring pool maintenance tasks with automated reminders.',
    icon: 'ri-calendar-check-line',
    color: '#2563EB',
  },
  {
    title: 'Technician Management',
    description:
      'Assign technicians, monitor workloads, and track service completion efficiently.',
    icon: 'ri-team-line',
    color: '#10B981',
  },
  {
    title: 'Service Request Management',
    description:
      'Receive customer requests, assign tasks, and manage service workflows from one dashboard.',
    icon: 'ri-service-line',
    color: '#F59E0B',
  },
  {
    title: 'Water Quality Monitoring',
    description:
      'Track chemical levels, water quality reports, and pool health information.',
    icon: 'ri-test-tube-line',
    color: '#8B5CF6',
  },
  {
    title: 'Invoices & Payments',
    description:
      'Generate invoices, track payments, and manage your pool service business finances.',
    icon: 'ri-file-list-3-line',
    color: '#EC4899',
  },
  {
    title: 'Reports & Analytics',
    description:
      'Get valuable insights about revenue, customers, services, and business performance.',
    icon: 'ri-bar-chart-line',
    color: '#F97316',
  },
]
</script>

<style scoped>
/* Import Remix Icon CDN (if not already imported globally) */
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css');
</style>