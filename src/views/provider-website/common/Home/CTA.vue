<template>
  <section class="relative py-24 overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600"></div>
    
    <!-- Decorative wave pattern overlay -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <svg class="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="white"/>
      </svg>
      <svg class="absolute top-0 left-0 w-full h-24 rotate-180" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="white"/>
      </svg>
    </div>

    <!-- Floating decorative blobs -->
    <div class="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="container relative px-4 mx-auto text-center z-10">
      <!-- Glassmorphism card for content -->
      <div class="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
        <h2 class="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl leading-tight">
          Ready for a Cleaner, <span class="text-sky-200">Healthier Pool?</span>
        </h2>
        <p class="max-w-2xl mx-auto mb-8 text-lg text-white/90 leading-relaxed">
          Our experienced team is ready to keep your swimming pool sparkling clean and worry-free all year long. Schedule your service today.
        </p>
        
        <!-- Trust badges -->
        <div class="flex flex-wrap justify-center gap-4 mb-8">
          <span class="inline-flex items-center gap-2 text-sm text-white/80 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
            <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            Certified Technicians
          </span>
          <span class="inline-flex items-center gap-2 text-sm text-white/80 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
            <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            Licensed & Insured
          </span>
          <span class="inline-flex items-center gap-2 text-sm text-white/80 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
            <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            Satisfaction Guaranteed
          </span>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#estimate-form"
            class="group inline-flex items-center justify-center px-10 py-4 bg-white text-sky-700 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Service
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a
            href="#estimate-form"
            class="group inline-flex items-center justify-center px-10 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Request Free Estimate
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style scoped>

</style>