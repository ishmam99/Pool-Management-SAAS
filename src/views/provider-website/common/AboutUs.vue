<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 py-20 lg:py-28">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 h-64 w-64 rounded-full bg-cyan-400 blur-3xl"></div>
        <div class="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-400 blur-3xl"></div>
      </div>
      
      <div class="container mx-auto px-4 relative">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <!-- Left Content -->
          <div class="lg:w-1/2 space-y-8">
            <div class="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-sm font-medium text-blue-700">Trusted by 500+ businesses</span>
            </div>
            
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span class="text-slate-900">Transforming The Way</span>
              <br />
              <span class="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Pools Are Managed</span>
            </h1>
            
            <p class="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              PoolSync provides powerful pool management technology that helps service providers and pool owners manage maintenance, operations, and customer relationships from one simple platform.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <button class="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
                Get Started
              </button>
              <button class="px-8 py-3.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>
          
          <!-- Right Content - Illustration -->
          <div class="lg:w-1/2 relative">
            <div class="relative">
              <!-- Main Card -->
              <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/50 p-6">
                <!-- Pool Icon -->
                <div class="flex justify-center mb-6">
                  <div class="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-xl">
                    <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p class="text-2xl font-bold text-blue-600">500+</p>
                    <p class="text-xs text-slate-500">Providers</p>
                  </div>
                  <div class="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p class="text-2xl font-bold text-cyan-600">2K+</p>
                    <p class="text-xs text-slate-500">Pools</p>
                  </div>
                  <div class="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p class="text-2xl font-bold text-emerald-600">98%</p>
                    <p class="text-xs text-slate-500">Satisfaction</p>
                  </div>
                </div>
              </div>
              
              <!-- Floating Elements -->
              <div class="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-300 rounded-2xl rotate-12 shadow-xl opacity-20"></div>
              <div class="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full shadow-xl opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Who We Are Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="lg:w-1/2 space-y-6">
            <span class="text-blue-600 font-semibold text-sm tracking-wider uppercase">About Us</span>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900">Who We Are</h2>
            <div class="space-y-4 text-slate-600 leading-relaxed">
              <p>
                PoolSync is a technology-driven platform built to modernize the swimming pool industry. We believe that managing pools should be simple, efficient, and transparent.
              </p>
              <p>
                The platform replaces manual processes with digital tools that make pool management easier, faster, and more transparent. From scheduling maintenance to tracking water quality, we provide everything needed in one place.
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 pt-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Fast & Efficient</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Reliable</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Technology First</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Customer Focus</span>
              </div>
            </div>
          </div>
          
          <div class="lg:w-1/2">
            <div class="relative">
              <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100">
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div class="text-3xl mb-2">🏊</div>
                    <p class="text-sm font-medium text-slate-700">Pool Management</p>
                  </div>
                  <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow mt-6">
                    <div class="text-3xl mb-2">📊</div>
                    <p class="text-sm font-medium text-slate-700">Analytics</p>
                  </div>
                  <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div class="text-3xl mb-2">🤝</div>
                    <p class="text-sm font-medium text-slate-700">Customer Relations</p>
                  </div>
                  <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow mt-6">
                    <div class="text-3xl mb-2">📱</div>
                    <p class="text-sm font-medium text-slate-700">Mobile Ready</p>
                  </div>
                </div>
              </div>
              <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision Section -->
    <section class="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-10 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Our Mission</h3>
            <p class="text-blue-50 text-lg leading-relaxed">
              Our mission is to empower pool businesses and owners with smart technology that improves efficiency, reduces operational complexity, and creates better pool experiences.
            </p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-10 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Our Vision</h3>
            <p class="text-blue-50 text-lg leading-relaxed">
              To become the leading digital platform for swimming pool management worldwide by connecting service providers, customers, and technology.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose PoolSync -->
    <section class="py-20 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="text-blue-600 font-semibold text-sm tracking-wider uppercase">Why PoolSync</span>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Why Choose PoolSync?</h2>
          <p class="text-slate-600">Everything you need to manage pools efficiently in one powerful platform.</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feature in features" :key="feature.title" 
               class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div class="w-12 h-12 rounded-xl" :style="{ backgroundColor: feature.color + '20' }">
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-2xl">{{ feature.icon }}</span>
              </div>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mt-4 mb-2">{{ feature.title }}</h3>
            <p class="text-slate-600 text-sm leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How PoolSync Works -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="text-blue-600 font-semibold text-sm tracking-wider uppercase">Process</span>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">How We Help Businesses Grow</h2>
          <p class="text-slate-600">Simple steps to transform your pool management operations.</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(step, index) in processSteps" :key="index" 
               class="relative group">
            <div class="bg-slate-50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div class="text-5xl font-bold text-blue-100 mb-4">{{ step.number }}</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">{{ step.title }}</h3>
              <p class="text-slate-600 text-sm">{{ step.description }}</p>
            </div>
            <div v-if="index < processSteps.length - 1" 
                 class="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200 group-hover:bg-blue-400 transition-colors"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- User Types Section -->
    <section class="py-20 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="text-blue-600 font-semibold text-sm tracking-wider uppercase">For Everyone</span>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Built for Every Role</h2>
          <p class="text-slate-600">Whether you're a service provider, pool owner, or organization, PoolSync has you covered.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="type in userTypes" :key="type.title" 
               class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mx-auto">
              <span class="text-3xl">{{ type.icon }}</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 text-center mt-4 mb-3">{{ type.title }}</h3>
            <ul class="space-y-2">
              <li v-for="feature in type.features" :key="feature" 
                  class="flex items-center gap-2 text-sm text-slate-600">
                <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="text-blue-600 font-semibold text-sm tracking-wider uppercase">Values</span>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Our Core Values</h2>
          <p class="text-slate-600">The principles that guide everything we do at PoolSync.</p>
        </div>
        
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="value in values" :key="value.title" 
               class="text-center group">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl">{{ value.icon }}</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mt-4">{{ value.title }}</h3>
            <p class="text-slate-600 text-sm mt-1">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready To Experience Smarter Pool Management?
          </h2>
          <p class="text-slate-300 text-lg mb-8">
            Join PoolSync and simplify the way you manage pools, services, and customers.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
              Start Now
            </button>
            <button class="px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const features = ref([
  {
    icon: '🎯',
    title: 'Smart Management',
    description: 'Manage pools, customers, and services from one centralized platform.',
    color: '#0284C7'
  },
  {
    icon: '💎',
    title: 'Better Customer Experience',
    description: 'Provide customers with transparency, updates, and easy communication.',
    color: '#06B6D4'
  },
  {
    icon: '⚡',
    title: 'Automated Operations',
    description: 'Reduce manual work with scheduling, reminders, and digital workflows.',
    color: '#10B981'
  },
  {
    icon: '📊',
    title: 'Data Driven Decisions',
    description: 'Use analytics and reports to improve business performance.',
    color: '#8B5CF6'
  },
  {
    icon: '🌟',
    title: 'Reliable Service',
    description: 'Maintain better service quality through organized workflows.',
    color: '#F59E0B'
  },
  {
    icon: '🚀',
    title: 'Scalable Platform',
    description: 'Designed for small providers and large organizations.',
    color: '#EC4899'
  }
])

const processSteps = ref([
  {
    number: '01',
    title: 'Connect',
    description: 'Register your business and add your pools.'
  },
  {
    number: '02',
    title: 'Manage',
    description: 'Schedule maintenance and manage customer services.'
  },
  {
    number: '03',
    title: 'Monitor',
    description: 'Track pool health, reports, and performance.'
  },
  {
    number: '04',
    title: 'Grow',
    description: 'Improve efficiency and scale your operations.'
  }
])

const userTypes = ref([
  {
    icon: '💼',
    title: 'For Service Providers',
    features: ['Customer management', 'Service scheduling', 'Technician management', 'Revenue tracking']
  },
  {
    icon: '🏠',
    title: 'For Pool Owners',
    features: ['Pool monitoring', 'Service requests', 'Maintenance history', 'Payments']
  },
  {
    icon: '🏢',
    title: 'For Organizations',
    features: ['Multiple pools', 'Team management', 'Advanced reporting']
  }
])

const values = ref([
  {
    icon: '💡',
    title: 'Innovation',
    description: 'Always improving pool management through technology.'
  },
  {
    icon: '🤝',
    title: 'Trust',
    description: 'Building reliable relationships with customers.'
  },
  {
    icon: '🎯',
    title: 'Simplicity',
    description: 'Making complex operations easy.'
  },
  {
    icon: '⭐',
    title: 'Excellence',
    description: 'Delivering high-quality solutions.'
  }
])
</script>

<style scoped>
.container {
  max-width: 1280px;
}
</style>