<template>
  <section class="py-20 bg-white">
    <div class="container px-4 mx-auto">
      <div class="max-w-3xl mx-auto mb-16 text-center">
        <span class="inline-block px-4 py-1 mb-4 text-sm font-semibold text-rose-600 bg-rose-100 rounded-full">Benefits</span>
        <h2 class="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
          Why Choose PoolSync
        </h2>
        <p class="text-lg text-slate-600">
          Built by industry experts to solve real challenges in pool management
        </p>
      </div>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="benefit in benefits" :key="benefit.id" 
             class="flex items-start gap-4 p-6 transition-all duration-300 rounded-2xl hover:shadow-xl group"
             :class="benefit.hoverBg">
          <div class="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br transition-all duration-300 group-hover:scale-110"
               :class="benefit.gradient">
            <component :is="benefit.icon" class="w-6 h-6" :class="benefit.iconColor" />
          </div>
          <div>
            <h4 class="font-semibold text-slate-800">{{ benefit.title }}</h4>
            <p class="text-sm text-slate-600">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  ClockIcon,
  StarIcon,
  SparklesIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'

const benefits = [
  {
    id: 1,
    icon: ClockIcon,
    title: 'Save Time',
    description: 'Automate routine tasks and focus on growing your business.',
    gradient: 'from-violet-100 to-violet-200',
    iconColor: 'text-violet-600',
    hoverBg: 'hover:bg-violet-50'
  },
  {
    id: 2,
    icon: StarIcon,
    title: 'Improve Customer Satisfaction',
    description: 'Deliver better service with real-time updates and transparent communication.',
    gradient: 'from-amber-100 to-amber-200',
    iconColor: 'text-amber-600',
    hoverBg: 'hover:bg-amber-50'
  },
  {
    id: 3,
    icon: SparklesIcon,
    title: 'Reduce Manual Work',
    description: 'Eliminate paperwork and spreadsheets with our digital solution.',
    gradient: 'from-fuchsia-100 to-fuchsia-200',
    iconColor: 'text-fuchsia-600',
    hoverBg: 'hover:bg-fuchsia-50'
  },
  {
    id: 4,
    icon: CheckCircleIcon,
    title: 'All-in-One Platform',
    description: 'Manage everything from a single, unified dashboard.',
    gradient: 'from-emerald-100 to-emerald-200',
    iconColor: 'text-emerald-600',
    hoverBg: 'hover:bg-emerald-50'
  },
  {
    id: 5,
    icon: DevicePhoneMobileIcon,
    title: 'Real-time Visibility',
    description: 'Access critical data anytime, anywhere with mobile-responsive design.',
    gradient: 'from-sky-100 to-sky-200',
    iconColor: 'text-sky-600',
    hoverBg: 'hover:bg-sky-50'
  },
  {
    id: 6,
    icon: ArrowPathIcon,
    title: 'Scalable Solution',
    description: 'Grow your business with a platform that scales with your needs.',
    gradient: 'from-rose-100 to-rose-200',
    iconColor: 'text-rose-600',
    hoverBg: 'hover:bg-rose-50'
  },
]
</script>