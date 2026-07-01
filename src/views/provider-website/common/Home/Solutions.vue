<template>
  <section class="py-20 bg-white">
    <div class="container px-4 mx-auto">
      <div class="max-w-3xl mx-auto mb-16 text-center">
        <span class="inline-block px-4 py-1 mb-4 text-sm font-semibold text-fuchsia-600 bg-fuchsia-100 rounded-full">Solutions</span>
        <h2 class="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
          Solutions For Every Role
        </h2>
        <p class="text-lg text-slate-600">
          Tailored experiences for all stakeholders in the pool management ecosystem
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="solution in solutions" :key="solution.id" 
             class="p-8 transition-all duration-300 border rounded-2xl hover:shadow-2xl hover:-translate-y-2 group"
             :class="solution.borderColor">
          <div class="mb-4">
            <div class="p-3 rounded-xl w-fit bg-gradient-to-br transition-all duration-300 group-hover:scale-110"
                 :class="solution.gradient">
              <component :is="solution.icon" class="w-8 h-8" :class="solution.iconColor" />
            </div>
          </div>
          <h3 class="mb-3 text-xl font-semibold text-slate-800">{{ solution.title }}</h3>
          <p class="mb-4 text-slate-600">{{ solution.description }}</p>
          <ul class="space-y-2">
            <li v-for="item in solution.features" :key="item" class="flex items-center gap-2 text-sm text-slate-600">
              <svg class="w-4 h-4" :class="solution.checkColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { BuildingOfficeIcon, UserIcon } from '@heroicons/vue/24/outline'

const solutions = [
  {
    id: 1,
    icon: BuildingOfficeIcon,
    title: 'For Pool Service Providers',
    description: 'Manage customers, technicians, maintenance schedules, and business operations from one place.',
    features: ['Customer Management', 'Work Orders', 'Scheduling', 'Revenue Tracking'],
    gradient: 'from-violet-100 to-fuchsia-200',
    iconColor: 'text-violet-600',
    borderColor: 'border-violet-100 hover:border-violet-300',
    checkColor: 'text-violet-500'
  },
  {
    id: 2,
    icon: UserIcon,
    title: 'For Pool Owners',
    description: 'Stay connected with your pool service provider and monitor your pool health easily.',
    features: ['Pool Information', 'Service Requests', 'Water Reports', 'Invoice Tracking'],
    gradient: 'from-emerald-100 to-sky-200',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-100 hover:border-emerald-300',
    checkColor: 'text-emerald-500'
  },
  {
    id: 3,
    icon: BuildingOfficeIcon,
    title: 'For Organizations',
    description: 'Perfect for hotels, resorts, gyms, and apartment communities managing multiple pools.',
    features: ['Multiple Pool Management', 'Detailed Reports', 'Team Access Control'],
    gradient: 'from-amber-100 to-rose-200',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-100 hover:border-amber-300',
    checkColor: 'text-amber-500'
  },
]
</script>