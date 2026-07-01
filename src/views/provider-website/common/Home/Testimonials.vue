<template>
  <section class="py-20 bg-gradient-to-b from-violet-50/30 via-white to-fuchsia-50/30">
    <div class="container px-4 mx-auto">
      <div class="max-w-3xl mx-auto mb-16 text-center">
        <span class="inline-block px-4 py-1 mb-4 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">Testimonials</span>
        <h2 class="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
          Trusted by Industry Leaders
        </h2>
        <p class="text-lg text-slate-600">
          Hear what our customers say about their experience with PoolSync
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="testimonial in testimonials" :key="testimonial.id" 
             class="p-8 transition-all duration-300 bg-white border rounded-2xl hover:shadow-2xl hover:-translate-y-2 group"
             :class="testimonial.borderColor">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 group-hover:scale-110"
                 :class="testimonial.gradient">
              {{ testimonial.name.charAt(0) }}
            </div>
            <div>
              <p class="font-semibold text-slate-800">{{ testimonial.name }}</p>
              <p class="text-sm text-slate-600">{{ testimonial.role }}</p>
              <p class="text-sm font-medium" :class="testimonial.companyColor">{{ testimonial.company }}</p>
            </div>
          </div>
          <div class="flex mb-3">
            <span v-for="i in 5" :key="i" class="text-amber-400">★</span>
          </div>
          <p class="text-slate-600">"{{ testimonial.quote }}"</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Operations Manager',
    company: 'AquaGuard Pools',
    companyColor: 'text-violet-600',
    quote: 'PoolSync transformed how we manage hundreds of pools every month. The efficiency gains have been remarkable.',
    gradient: 'from-violet-600 to-fuchsia-600 shadow-violet-500/30',
    borderColor: 'border-violet-100 hover:border-violet-300'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'CEO',
    company: 'Premier Pool Services',
    companyColor: 'text-emerald-600',
    quote: 'The reporting and analytics features have given us insights we never had before. PoolSync is a game-changer.',
    gradient: 'from-emerald-600 to-teal-600 shadow-emerald-500/30',
    borderColor: 'border-emerald-100 hover:border-emerald-300'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Fleet Manager',
    company: 'Coastal Pool Maintenance',
    companyColor: 'text-amber-600',
    quote: 'Scheduling and dispatching technicians has never been easier. Our team productivity increased by 40%.',
    gradient: 'from-amber-600 to-rose-600 shadow-amber-500/30',
    borderColor: 'border-amber-100 hover:border-amber-300'
  },
]
</script>