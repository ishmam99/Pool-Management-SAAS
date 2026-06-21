<template>
  <main class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-50 to-rose-100/50">
      <div class="container px-4 mx-auto">
        <div class="flex flex-col items-center gap-12 lg:flex-row">
          <!-- Hero Content -->
          <div class="flex-1 space-y-8 text-center lg:text-left">
            <h1 class="text-4xl font-bold leading-tight text-slate-800 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              Smart Pool Management
              <span class="block text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 bg-clip-text">
                Made Simple
              </span>
            </h1>
            <p class="max-w-xl mx-auto text-lg text-slate-700 lg:mx-0 lg:text-xl">
              Manage pools, customers, maintenance schedules, and services from one powerful platform designed for modern pool businesses.
            </p>
            <div class="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <button class="px-8 py-4 text-base font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 hover:shadow-xl hover:scale-105 hover:shadow-violet-500/40">
                Start Managing Pools
              </button>
              <button class="px-8 py-4 text-base font-semibold transition-all duration-300 border-2 rounded-xl text-violet-600 border-violet-600 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-500/30">
                Request a Demo
              </button>
            </div>
          </div>

          <!-- Hero Dashboard Mockup -->
          <div class="relative flex-1">
            <div class="relative w-full max-w-2xl mx-auto">
              <!-- Main Dashboard Card -->
              <div class="relative p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-violet-200/50">
                <!-- Dashboard Header -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 bg-rose-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    <span class="ml-2 text-sm font-medium text-slate-700">PoolSync Dashboard</span>
                  </div>
                  <div class="flex gap-2">
                    <div class="w-8 h-8 rounded-lg bg-violet-100"></div>
                    <div class="w-8 h-8 rounded-lg bg-fuchsia-100"></div>
                  </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="p-4 transition-all duration-300 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 hover:shadow-lg hover:scale-105 hover:from-violet-500/30 hover:to-fuchsia-500/30">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-slate-700">Total Pools</span>
                      <span class="text-xl">🏊</span>
                    </div>
                    <p class="text-2xl font-bold text-violet-700">247</p>
                    <span class="text-xs text-emerald-600">↑ 12% this month</span>
                  </div>
                  <div class="p-4 transition-all duration-300 rounded-xl bg-gradient-to-br from-amber-200 to-orange-200 hover:shadow-lg hover:scale-105 hover:from-amber-300 hover:to-orange-300">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-slate-700">Upcoming</span>
                      <span class="text-xl">📋</span>
                    </div>
                    <p class="text-2xl font-bold text-amber-700">18</p>
                    <span class="text-xs text-amber-600">3 new today</span>
                  </div>
                  <div class="p-4 transition-all duration-300 rounded-xl bg-gradient-to-br from-emerald-200 to-teal-200 hover:shadow-lg hover:scale-105 hover:from-emerald-300 hover:to-teal-300">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-slate-700">Revenue</span>
                      <span class="text-xl">💰</span>
                    </div>
                    <p class="text-2xl font-bold text-emerald-700">$42.8k</p>
                    <span class="text-xs text-emerald-600">↑ 8.2%</span>
                  </div>
                  <div class="p-4 transition-all duration-300 rounded-xl bg-gradient-to-br from-sky-200 to-blue-200 hover:shadow-lg hover:scale-105 hover:from-sky-300 hover:to-blue-300">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-slate-700">Water Quality</span>
                      <span class="text-xl">💧</span>
                    </div>
                    <p class="text-2xl font-bold text-sky-700">96%</p>
                    <span class="text-xs text-emerald-600">↑ Excellent</span>
                  </div>
                </div>

                <!-- Activity & Schedule -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 rounded-xl bg-gradient-to-br from-violet-100/80 to-rose-100/80 backdrop-blur-sm">
                    <h4 class="mb-3 text-sm font-semibold text-violet-800">Recent Activity</h4>
                    <div class="space-y-3">
                      <div class="flex items-center gap-3 text-sm">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span class="text-slate-700">Pool #124 cleaned</span>
                      </div>
                      <div class="flex items-center gap-3 text-sm">
                        <div class="w-2 h-2 bg-sky-500 rounded-full"></div>
                        <span class="text-slate-700">Chemical treatment done</span>
                      </div>
                      <div class="flex items-center gap-3 text-sm">
                        <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span class="text-slate-700">New service request</span>
                      </div>
                    </div>
                  </div>
                  <div class="p-4 rounded-xl bg-gradient-to-br from-amber-100/80 to-rose-100/80 backdrop-blur-sm">
                    <h4 class="mb-3 text-sm font-semibold text-amber-800">Today's Schedule</h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-600">9:00 AM</span>
                        <span class="font-medium text-violet-600">Pool #56</span>
                      </div>
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-600">10:30 AM</span>
                        <span class="font-medium text-fuchsia-600">Pool #89</span>
                      </div>
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-600">2:00 PM</span>
                        <span class="font-medium text-emerald-600">Pool #12</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Floating Elements -->
                <div class="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-violet-500 to-rose-500 rounded-2xl rotate-12 opacity-20 blur-2xl"></div>
                <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-amber-400 to-emerald-400 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl"></div>
      <div class="absolute top-40 right-20 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl"></div>
    </section>

    <!-- Statistics Section -->
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

    <!-- Features Section -->
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
          <div v-for="(feature, idx) in features" :key="feature.id" 
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

    <!-- Solutions Section -->
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

    <!-- How It Works Section -->
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

    <!-- Dashboard Preview Section -->
    <section class="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-sky-50/30">
      <div class="container px-4 mx-auto">
        <div class="max-w-3xl mx-auto mb-16 text-center">
          <span class="inline-block px-4 py-1 mb-4 text-sm font-semibold text-emerald-600 bg-emerald-100 rounded-full">Dashboard</span>
          <h2 class="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
            Powerful Dashboard at Your Fingertips
          </h2>
          <p class="text-lg text-slate-600">
            Get complete visibility and control over your pool management operations
          </p>
        </div>
        <div class="max-w-6xl mx-auto">
          <div class="overflow-hidden bg-white rounded-2xl shadow-2xl border border-violet-200">
            <div class="flex flex-col md:flex-row">
              <!-- Sidebar -->
              <div class="w-full p-4 bg-gradient-to-br from-violet-100 via-fuchsia-100 to-rose-100 md:w-64 md:min-h-[500px]">
                <div class="mb-6 text-xl font-bold text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 bg-clip-text">PoolSync</div>
                <nav class="space-y-1">
                  <a v-for="item in ['Dashboard', 'Pools', 'Customers', 'Maintenance', 'Reports', 'Invoices', 'Settings']" 
                     :key="item" 
                     class="flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 rounded-lg text-slate-700 hover:bg-white hover:text-violet-600 hover:shadow-md"
                     :class="{'bg-white text-violet-600 shadow-md': item === 'Dashboard'}">
                    <div class="w-2 h-2 rounded-full transition-all duration-200"
                         :class="item === 'Dashboard' ? 'bg-violet-600 scale-125' : 'bg-violet-300'"></div>
                    {{ item }}
                  </a>
                </nav>
              </div>
              <!-- Main Content -->
              <div class="flex-1 p-6">
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="p-4 rounded-xl bg-gradient-to-br from-violet-200 to-fuchsia-200">
                    <p class="text-sm text-slate-700">Total Pools</p>
                    <p class="text-2xl font-bold text-violet-700">247</p>
                  </div>
                  <div class="p-4 rounded-xl bg-gradient-to-br from-amber-200 to-orange-200">
                    <p class="text-sm text-slate-700">Upcoming Services</p>
                    <p class="text-2xl font-bold text-amber-700">18</p>
                  </div>
                  <div class="p-4 rounded-xl bg-gradient-to-br from-emerald-200 to-teal-200">
                    <p class="text-sm text-slate-700">Revenue</p>
                    <p class="text-2xl font-bold text-emerald-700">$42.8k</p>
                  </div>
                  <div class="p-4 rounded-xl bg-gradient-to-br from-sky-200 to-blue-200">
                    <p class="text-sm text-slate-700">Water Quality</p>
                    <p class="text-2xl font-bold text-sky-700">96%</p>
                  </div>
                </div>
                <!-- Activity Table -->
                <div class="p-4 rounded-xl bg-gradient-to-br from-violet-50/80 to-rose-50/80">
                  <h4 class="mb-3 text-sm font-semibold text-violet-800">Recent Maintenance Activities</h4>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between p-2 bg-white rounded-lg border border-violet-200">
                      <span class="text-sm text-slate-700">Pool #124 - Cleaning</span>
                      <span class="text-xs font-medium text-emerald-600">✓ Completed</span>
                    </div>
                    <div class="flex items-center justify-between p-2 bg-white rounded-lg border border-sky-200">
                      <span class="text-sm text-slate-700">Pool #89 - Chemical Treatment</span>
                      <span class="text-xs font-medium text-sky-600">⟳ In Progress</span>
                    </div>
                    <div class="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-200">
                      <span class="text-sm text-slate-700">Pool #56 - Equipment Check</span>
                      <span class="text-xs font-medium text-amber-600">⏰ Scheduled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose PoolSync -->
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

    <!-- Testimonials Section -->
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

    <!-- Final CTA Section -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-600"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      <!-- Floating colored blobs -->
      <div class="absolute top-10 left-10 w-32 h-32 bg-amber-400 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute bottom-10 right-10 w-40 h-40 bg-emerald-400 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div class="container relative px-4 mx-auto text-center">
        <h2 class="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          Ready to simplify your pool management?
        </h2>
        <p class="max-w-2xl mx-auto mb-8 text-lg text-white/90">
          Join modern pool service companies using PoolSync to manage their operations efficiently.
        </p>
        <button class="px-10 py-4 text-base font-semibold transition-all duration-300 bg-white rounded-xl text-violet-600 hover:shadow-2xl hover:scale-105 hover:shadow-white/40 hover:bg-gradient-to-r hover:from-violet-100 hover:to-rose-100">
          Get Started Today →
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import {
  ChartBarIcon,
  CalendarIcon,
  BeakerIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  BuildingOfficeIcon,
  HomeIcon,
  ClockIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  StarIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'

// Statistics data
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

// Features data
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

// Solutions data
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

// Steps data
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

// Benefits data
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

// Testimonials data
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