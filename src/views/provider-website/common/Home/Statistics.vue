<template>
  <section class="py-16 bg-gradient-to-b from-white to-violet-50/50">
    <div class="container px-4 mx-auto">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="stat in statistics" :key="stat.id" 
             class="p-6 text-center transition-all duration-300 border rounded-2xl hover:shadow-xl hover:-translate-y-1 group"
             :class="stat.border">
          <div class="flex justify-center mb-4">
            <div class="p-3 rounded-xl bg-gradient-to-br group-hover:scale-110 transition-all duration-300"
                 :class="stat.iconBg">
              <component :is="stat.icon" class="w-8 h-8" :class="stat.iconColor" />
            </div>
          </div>
          <p class="text-3xl font-bold" :class="stat.textColor">{{ stat.number }}</p>
          <p class="text-sm text-slate-600">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { HomeIcon, UserGroupIcon, StarIcon, ClockIcon } from '@heroicons/vue/24/outline'

const statistics = [
  { 
    id: 1, 
    icon: HomeIcon, 
    number: '10,000+', 
    label: 'Pools Managed',
    border: 'border-violet-200 hover:border-violet-400',
    iconBg: 'from-violet-100 to-violet-200',
    iconColor: 'text-violet-600',
    textColor: 'text-violet-700'
  },
  { 
    id: 2, 
    icon: UserGroupIcon, 
    number: '5,000+', 
    label: 'Happy Customers',
    border: 'border-fuchsia-200 hover:border-fuchsia-400',
    iconBg: 'from-fuchsia-100 to-fuchsia-200',
    iconColor: 'text-fuchsia-600',
    textColor: 'text-fuchsia-700'
  },
  { 
    id: 3, 
    icon: StarIcon, 
    number: '99%', 
    label: 'Service Satisfaction',
    border: 'border-amber-200 hover:border-amber-400',
    iconBg: 'from-amber-100 to-amber-200',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-700'
  },
  { 
    id: 4, 
    icon: ClockIcon, 
    number: '24/7', 
    label: 'Support',
    border: 'border-emerald-200 hover:border-emerald-400',
    iconBg: 'from-emerald-100 to-emerald-200',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-700'
  },
]
</script>