<template>
  <section class="py-20 bg-gradient-to-b from-amber-50/30 via-white to-rose-50/30">
    <div class="container px-4 mx-auto">
      <div class="max-w-3xl mx-auto mb-16 text-center">
        <span class="inline-block px-4 py-1 mb-4 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">Process</span>
        <h2 class="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
          How It Works
        </h2>
        <p class="text-lg text-slate-600">
          Get started in four simple steps and transform your pool management
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="(step, index) in steps" :key="step.id" class="relative">
          <div class="p-8 text-center transition-all duration-300 bg-white border rounded-2xl hover:shadow-2xl hover:-translate-y-2 group"
               :class="step.borderColor">
            <div class="relative inline-block mb-4">
              <div class="w-16 h-16 mx-auto text-2xl font-bold rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                   :class="step.gradient">
                {{ index + 1 }}
              </div>
            </div>
            <h3 class="mb-2 text-xl font-semibold text-slate-800">{{ step.title }}</h3>
            <p class="text-sm text-slate-600">{{ step.description }}</p>
          </div>
          <!-- Connector Line -->
          <div v-if="index < steps.length - 1" 
               class="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r"
               :class="step.connector"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    id: 1,
    title: 'Create Account',
    description: 'Register your business or pool profile in minutes.',
    gradient: 'from-violet-600 to-fuchsia-600 shadow-violet-500/30',
    borderColor: 'border-violet-100 hover:border-violet-300',
    connector: 'from-violet-400 to-fuchsia-400'
  },
  {
    id: 2,
    title: 'Add Pools',
    description: 'Add pool details, equipment, and customer information.',
    gradient: 'from-sky-600 to-blue-600 shadow-sky-500/30',
    borderColor: 'border-sky-100 hover:border-sky-300',
    connector: 'from-sky-400 to-blue-400'
  },
  {
    id: 3,
    title: 'Schedule Services',
    description: 'Create maintenance schedules and assign tasks to your team.',
    gradient: 'from-emerald-600 to-teal-600 shadow-emerald-500/30',
    borderColor: 'border-emerald-100 hover:border-emerald-300',
    connector: 'from-emerald-400 to-teal-400'
  },
  {
    id: 4,
    title: 'Monitor Everything',
    description: 'Track reports, payments, and pool health from your dashboard.',
    gradient: 'from-amber-600 to-rose-600 shadow-amber-500/30',
    borderColor: 'border-amber-100 hover:border-amber-300',
    connector: 'from-amber-400 to-rose-400'
  },
]
</script>