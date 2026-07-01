<template>
  <section class="py-20 bg-gradient-to-b from-white via-violet-50/30 to-fuchsia-50/30">
    <div class="container px-4 mx-auto">
      <div class="max-w-3xl mx-auto mb-16 text-center">
        <span class="inline-block px-4 py-1 mb-4 text-sm font-semibold text-violet-600 bg-violet-100 rounded-full">Features</span>
        <h2 class="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
          Everything You Need To Manage Pools Efficiently
        </h2>
        <p class="text-lg text-slate-600">
          Comprehensive tools designed specifically for modern pool service businesses
        </p>
      </div>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="feature in features" :key="feature.id" 
             class="p-8 transition-all duration-300 bg-white border rounded-2xl hover:shadow-2xl hover:-translate-y-2 group"
             :class="feature.borderColor">
          <div class="p-3 mb-4 rounded-xl w-fit bg-gradient-to-br transition-all duration-300 group-hover:scale-110"
               :class="feature.gradient">
            <component :is="feature.icon" class="w-8 h-8" :class="feature.iconColor" />
          </div>
          <h3 class="mb-2 text-xl font-semibold text-slate-800">{{ feature.title }}</h3>
          <p class="text-slate-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  HomeIcon,
  CalendarIcon,
  BeakerIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
} from '@heroicons/vue/24/outline'

const features = [
  {
    id: 1,
    icon: HomeIcon,
    title: 'Pool Management',
    description: 'Manage multiple pools, pool information, equipment details, and maintenance records.',
    gradient: 'from-violet-100 to-violet-200',
    iconColor: 'text-violet-600',
    borderColor: 'border-violet-100 hover:border-violet-300'
  },
  {
    id: 2,
    icon: CalendarIcon,
    title: 'Maintenance Scheduling',
    description: 'Schedule recurring services, assign technicians, and track completed work.',
    gradient: 'from-sky-100 to-blue-200',
    iconColor: 'text-sky-600',
    borderColor: 'border-sky-100 hover:border-sky-300'
  },
  {
    id: 3,
    icon: BeakerIcon,
    title: 'Water Quality Monitoring',
    description: 'Track pH, chlorine, alkalinity, and pool health reports in real-time.',
    gradient: 'from-emerald-100 to-teal-200',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-100 hover:border-emerald-300'
  },
  {
    id: 4,
    icon: UserGroupIcon,
    title: 'Customer Management',
    description: 'Manage customer profiles, communication, and service history efficiently.',
    gradient: 'from-fuchsia-100 to-rose-200',
    iconColor: 'text-fuchsia-600',
    borderColor: 'border-fuchsia-100 hover:border-fuchsia-300'
  },
  {
    id: 5,
    icon: CurrencyDollarIcon,
    title: 'Billing & Payments',
    description: 'Create invoices, track payments, and manage subscriptions seamlessly.',
    gradient: 'from-amber-100 to-orange-200',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-100 hover:border-amber-300'
  },
  {
    id: 6,
    icon: DocumentChartBarIcon,
    title: 'Reports & Analytics',
    description: 'Understand business performance with detailed reports and insights.',
    gradient: 'from-indigo-100 to-purple-200',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-100 hover:border-indigo-300'
  },
]
</script>