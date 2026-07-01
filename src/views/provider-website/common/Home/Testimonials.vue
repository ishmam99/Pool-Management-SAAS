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
          Testimonials
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
          What Our Customers <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Say</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Real reviews from real pool owners who trust Aqua Clean Pools for professional, reliable pool care.
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.id"
          class="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-sky-200/50"
          :style="{ animationDelay: `${index * 0.08}s` }"
        >
          <!-- Glassmorphism glow -->
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/0 via-sky-500/0 to-cyan-500/0 group-hover:from-sky-500/5 group-hover:via-sky-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>

          <!-- Quote icon -->
          <div class="absolute top-6 right-6 text-sky-200/30 group-hover:text-sky-200/50 transition-colors duration-300">
            <i class="ri-double-quotes-r text-4xl"></i>
          </div>

          <!-- Avatar & Info -->
          <div class="flex items-center gap-4 mb-4 relative z-10">
            <div class="relative">
              <div class="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400/20 to-cyan-400/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div
                class="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 group-hover:scale-110"
                :style="{ background: testimonial.gradient }"
              >
                {{ testimonial.name.charAt(0) }}
              </div>
            </div>
            <div>
              <p class="font-bold text-slate-900">{{ testimonial.name }}</p>
              <p class="text-sm text-slate-500">{{ testimonial.role }}</p>
              <div class="flex items-center gap-1.5 mt-0.5">
                <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-xs font-medium text-emerald-600">Verified Customer</span>
              </div>
            </div>
          </div>

          <!-- Star Rating -->
          <div class="flex mb-3 relative z-10">
            <i v-for="i in 5" :key="i" class="ri-star-fill text-amber-400 text-sm"></i>
          </div>

          <!-- Quote -->
          <p class="text-slate-600 leading-relaxed relative z-10 italic">
            "{{ testimonial.quote }}"
          </p>

          <!-- Decorative corner accent -->
          <div class="absolute -top-1 -right-1 w-12 h-12 rounded-tr-2xl bg-gradient-to-br from-sky-500/10 to-cyan-500/10 group-hover:from-sky-500/20 group-hover:to-cyan-500/20 transition-all duration-300 pointer-events-none"></div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-14">
        <p class="text-slate-600 mb-4">Join hundreds of satisfied customers</p>
        <a
          href="#estimate-form"
          class="group inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Book Your Service Today
          <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
// ─── Testimonials Data ──────────────────────────────────────────
const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Homeowner, Luxury Estate',
    gradient: 'linear-gradient(135deg, #0284C7, #22D3EE)',
    quote: 'Aqua Clean Pools has completely transformed our backyard pool experience. The weekly service is flawless, and our water has never been clearer. Highly recommend!',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    role: 'Property Manager, Oceanview Apartments',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    quote: 'Managing a commercial pool used to be a headache. Aqua Clean Pools handles everything—testing, cleaning, repairs—so we can focus on our residents. Exceptional service.',
  },
  {
    id: 3,
    name: 'Lisa Thompson',
    role: 'HOA Board President, Lakeside Community',
    gradient: 'linear-gradient(135deg, #6366F1, #818CF8)',
    quote: 'Our community pool has never looked better. The team is professional, punctual, and truly cares about water quality. A game-changer for our neighborhood.',
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'Hotel General Manager, The Grand Resort',
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    quote: 'Guest satisfaction is our top priority, and Aqua Clean Pools ensures our pool is always pristine. Their responsiveness and attention to detail are unmatched.',
  },
  {
    id: 5,
    name: 'Emily Davis',
    role: 'Homeowner, Vacation Property',
    gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
    quote: 'We only use our pool during summer vacations, but Aqua Clean Pools keeps it perfect year-round. Arriving to a crystal-clear pool is pure luxury.',
  },
  {
    id: 6,
    name: 'Robert Martinez',
    role: 'Facilities Director, City Sports Complex',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    quote: 'We manage multiple pools for public use, and Aqua Clean Pools delivers consistent, reliable service every time. Their expertise gives us total confidence.',
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