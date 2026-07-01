<template>
  <div class="min-h-screen bg-white">
    <!-- ============================================================ -->
    <!-- HERO SECTION                                                  -->
    <!-- ============================================================ -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-sky-900 py-20 lg:py-28">
      <!-- Background image -->
      <div class="absolute inset-0 opacity-30">
        <img
        src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1920&h=800&fit=crop&crop=center&auto=format"
        alt="Luxury swimming pool"
        class="w-full h-full object-cover"
        />
      </div>

      <!-- Decorative blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-20 -right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 container mx-auto px-4">
        <div class="max-w-3xl">
          <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-6 border border-white/10">
            Book Professional Pool Service
          </span>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Let's Make Your Pool <span class="text-sky-300">Crystal Clear</span>
          </h1>
          <p class="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mb-8">
            Whether you need weekly maintenance, water balancing, equipment repairs, or a one-time cleaning, Aqua Clean Pools is here to help.
          </p>
          <div class="flex flex-wrap gap-4">
            <a
            href="#estimate-form"
            class="group inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
            Book Free Inspection
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a
          href="tel:+15551234567"
          class="inline-flex items-center px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
          >
          Call Now
        </a>
      </div>

      <!-- Floating trust badges -->
      <div class="flex flex-wrap gap-3 mt-8">
        <span class="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/90 border border-white/10">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          Licensed & Insured
        </span>
        <span class="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/90 border border-white/10">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          Certified Technicians
        </span>
        <span class="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/90 border border-white/10">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          Same-Day Service Available
        </span>
        <span class="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/90 border border-white/10">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          100% Satisfaction Guaranteed
        </span>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================ -->
<!-- REQUEST A FREE ESTIMATE FORM                                  -->
<!-- ============================================================ -->
<section id="estimate-form" class="py-20 bg-slate-50">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4 shadow-lg shadow-sky-500/25">
          Get Started
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Request a Free Estimate</h2>
        <p class="text-slate-600 text-lg">Fill out the form below and our team will contact you with a customized quote.</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 lg:p-12 border border-slate-100">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800"
            placeholder="Enter your full name"
            required
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800"
            placeholder="Enter your email"
            required
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Phone Number <span class="text-red-500">*</span>
            </label>
            <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800"
            placeholder="Enter your phone number"
            required
            />
          </div>

          <!-- Service Address -->
          <div>
            <label for="address" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Service Address <span class="text-red-500">*</span>
            </label>
            <input
            id="address"
            v-model="form.address"
            type="text"
            class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800"
            placeholder="Enter your service address"
            required
            />
          </div>

          <!-- Property Type -->
          <div>
            <label for="propertyType" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Property Type <span class="text-red-500">*</span>
            </label>
            <select
            id="propertyType"
            v-model="form.propertyType"
            class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 appearance-none text-slate-800"
            required
            >
            <option value="" disabled>Select property type</option>
            <option v-for="type in propertyTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <!-- Service Needed -->
        <div>
          <label for="serviceNeeded" class="block text-sm font-semibold text-slate-700 mb-1.5">
            Service Needed <span class="text-red-500">*</span>
          </label>
          <select
          id="serviceNeeded"
          v-model="form.serviceNeeded"
          class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 appearance-none text-slate-800"
          required
          >
          <option value="" disabled>Select service</option>
          <option v-for="service in services" :key="service" :value="service">{{ service }}</option>
        </select>
      </div>

      <!-- Pool Type -->
      <div>
        <label for="poolType" class="block text-sm font-semibold text-slate-700 mb-1.5">
          Pool Type <span class="text-red-500">*</span>
        </label>
        <select
        id="poolType"
        v-model="form.poolType"
        class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 appearance-none text-slate-800"
        required
        >
        <option value="" disabled>Select pool type</option>
        <option v-for="type in poolTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <!-- Preferred Service Date -->
    <div>
      <label for="serviceDate" class="block text-sm font-semibold text-slate-700 mb-1.5">
        Preferred Service Date
      </label>
      <input
      id="serviceDate"
      v-model="form.serviceDate"
      type="date"
      class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 text-slate-800"
      />
    </div>

    <!-- Preferred Contact Method -->
    <div>
      <label class="block text-sm font-semibold text-slate-700 mb-2">
        Preferred Contact Method <span class="text-red-500">*</span>
      </label>
      <div class="flex flex-wrap gap-4">
        <label v-for="method in contactMethods" :key="method" class="flex items-center gap-2.5 cursor-pointer">
          <input
          type="radio"
          :value="method"
          v-model="form.contactMethod"
          class="w-4 h-4 text-sky-600 border-slate-300 focus:ring-sky-500"
          required
          />
          <span class="text-sm text-slate-700">{{ method }}</span>
        </label>
      </div>
    </div>

    <!-- Message -->
    <div>
      <label for="message" class="block text-sm font-semibold text-slate-700 mb-1.5">
        Message
      </label>
      <textarea
      id="message"
      v-model="form.message"
      class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-800 resize-y min-h-[110px]"
      rows="4"
      placeholder="Tell us about your pool, any issues you're experiencing, or the services you're looking for."
      ></textarea>
    </div>

    <!-- Submit -->
    <button
    type="submit"
    class="w-full py-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300 text-lg"
    >
    Request My Free Estimate
  </button>
</form>
</div>
</div>
</div>
</section>

<!-- ============================================================ -->
<!-- WHY HOMEOWNERS CHOOSE AQUA CLEAN POOLS                        -->
<!-- ============================================================ -->
<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-14">
      <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4 shadow-lg shadow-sky-500/25">
        Why Choose Us
      </span>
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Homeowners Choose Aqua Clean Pools</h2>
      <p class="text-slate-600 text-lg">Professional pool care you can trust, delivered with excellence.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="reason in reasons" :key="reason.title"
      class="group bg-slate-50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 hover:border-sky-200/50">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
        <i :class="reason.icon" class="text-2xl text-sky-600"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2">{{ reason.title }}</h3>
      <p class="text-sm text-slate-600 leading-relaxed">{{ reason.description }}</p>
    </div>
  </div>
</div>
</section>

<!-- ============================================================ -->
<!-- OUR COMMITMENT TO QUALITY                                     -->
<!-- ============================================================ -->
<section class="py-20 bg-slate-50">
  <div class="container mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <!-- Image -->
      <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/10">
        <img
        src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop&crop=center&auto=format"
        alt="Professional pool technician cleaning a luxury pool"
        class="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
        <!-- Floating badge -->
        <div class="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-xl border border-white/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500">Satisfaction</p>
              <p class="text-sm font-bold text-slate-900">100% Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-6">
        <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full shadow-lg shadow-sky-500/25">
          Our Commitment
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
          Professional Pool Care You Can <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Rely On</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed">
          Every pool is different, which is why we provide customized maintenance plans, professional water testing, equipment inspections, and dependable service that gives homeowners complete peace of mind.
        </p>

        <!-- Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
            <p class="text-2xl font-extrabold text-sky-600">1000+</p>
            <p class="text-xs text-slate-500 font-medium">Pools Serviced</p>
          </div>
          <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
            <p class="text-2xl font-extrabold text-cyan-600">15+</p>
            <p class="text-xs text-slate-500 font-medium">Years Experience</p>
          </div>
          <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
            <p class="text-2xl font-extrabold text-emerald-600">4.9★</p>
            <p class="text-xs text-slate-500 font-medium">Customer Rating</p>
          </div>
          <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
            <p class="text-2xl font-extrabold text-blue-600">24/7</p>
            <p class="text-xs text-slate-500 font-medium">Emergency Support</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================ -->
<!-- OUR SERVICE AREAS                                             -->
<!-- ============================================================ -->
<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <!-- Left: Map Illustration -->
      <div class="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
        <img
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop&crop=center&auto=format"
        alt="Service area map"
        class="w-full h-[340px] object-cover hover:scale-105 transition-transform duration-700"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent"></div>
        <!-- Map pin -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div class="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/50 animate-pulse">
            <svg class="w-7 h-7 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Right: Content -->
      <div class="space-y-6">
        <span class="inline-block bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full shadow-lg shadow-sky-500/25">
          Service Areas
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
          Proudly Serving Our <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Local Community</span>
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed">
          We proudly serve homeowners and businesses throughout the surrounding communities with professional pool care.
        </p>

        <div class="grid grid-cols-2 gap-3 pt-2">
          <div v-for="area in serviceAreas" :key="area" class="flex items-center gap-2.5">
            <div class="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-sm text-slate-700">{{ area }}</span>
          </div>
        </div>

        <button class="px-8 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 hover:-translate-y-0.5 transition-all duration-300">
          See Service Area
        </button>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================ -->
<!-- WHAT HAPPENS NEXT?                                            -->
<!-- ============================================================ -->
<section class="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-14">
      <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4 border border-white/10">
        Simple Process
      </span>
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">What Happens Next?</h2>
      <p class="text-slate-300 text-lg">Four simple steps to a crystal clear pool.</p>
    </div>

    <div class="grid md:grid-cols-4 gap-6 relative">
      <!-- Connector lines (desktop) -->
      <div class="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-sky-500/30 via-cyan-500/30 to-sky-500/30 -translate-y-1/2"></div>

      <div v-for="(step, index) in steps" :key="index"
      class="relative group z-10">
      <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
        <div class="text-4xl font-extrabold text-white/10 mb-4 group-hover:text-white/20 transition-colors">{{ step.number }}</div>
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-cyan-500/30 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
          <i :class="step.icon" class="text-2xl text-white"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">{{ step.title }}</h3>
        <p class="text-slate-300 text-sm leading-relaxed">{{ step.description }}</p>
      </div>
      <!-- Arrow -->
      <div v-if="index < steps.length - 1"
      class="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-sky-500/30 to-cyan-500/30 group-hover:from-sky-400 group-hover:to-cyan-400 transition-all duration-300">
    </div>
  </div>
</div>
</div>
</section>

<!-- ============================================================ -->
<!-- EMERGENCY POOL SERVICE                                        -->
<!-- ============================================================ -->
<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <div class="relative bg-gradient-to-r from-rose-600 to-rose-500 rounded-3xl overflow-hidden shadow-2xl shadow-rose-500/20">
      <div class="absolute inset-0 opacity-10">
        <svg class="absolute top-0 right-0 w-64 h-64" viewBox="0 0 200 200" fill="white">
          <circle cx="100" cy="100" r="80"/>
        </svg>
        <svg class="absolute bottom-0 left-0 w-48 h-48" viewBox="0 0 200 200" fill="white">
          <circle cx="100" cy="100" r="80"/>
        </svg>
      </div>

      <div class="relative z-10 p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <i class="ri-alarm-warning-line text-3xl text-white"></i>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-white">Emergency Pool Service</h3>
            <p class="text-rose-100">Need urgent pool repairs or algae treatment? Call our emergency response team today.</p>
          </div>
        </div>
        <a
        href="tel:+15551234567"
        class="flex-shrink-0 px-8 py-3.5 bg-white text-rose-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
        Call Now
      </a>
    </div>
  </div>
</div>
</section>

<!-- ============================================================ -->
<!-- BOTTOM CTA                                                    -->
<!-- ============================================================ -->
<section class="py-20 relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600">
  <!-- Wave decorations -->
  <div class="absolute inset-0 opacity-10 pointer-events-none">
    <svg class="absolute bottom-0 left-0 w-full h-40" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="white"/>
    </svg>
    <svg class="absolute top-0 left-0 w-full h-32 rotate-180" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="white"/>
    </svg>
  </div>

  <!-- Floating blobs -->
  <div class="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

  <div class="relative z-10 container mx-auto px-4 text-center max-w-3xl">
    <!-- Glassmorphism card -->
    <div class="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
        Ready To Enjoy A Cleaner, <span class="text-sky-200">Healthier Pool?</span>
      </h2>
      <p class="text-slate-100 text-lg leading-relaxed mb-8">
        Our experienced team is ready to keep your swimming pool sparkling clean and worry-free all year long.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
        href="#estimate-form"
        class="group inline-flex items-center px-10 py-4 bg-white text-sky-700 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
        >
        Book Service
        <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
      <a
      href="#estimate-form"
      class="px-10 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 hover:-translate-y-0.5 transition-all duration-300"
      >
      Request Free Estimate
    </a>
  </div>
  <div class="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-white/20">
    <span class="inline-flex items-center gap-2 text-sm text-white/80">
      <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
      Certified Technicians
    </span>
    <span class="inline-flex items-center gap-2 text-sm text-white/80">
      <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
      Licensed & Insured
    </span>
    <span class="inline-flex items-center gap-2 text-sm text-white/80">
      <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
      Satisfaction Guaranteed
    </span>
  </div>
</div>
</div>
</section>

<!-- ============================================================ -->
<!-- SUCCESS MODAL                                                 -->
<!-- ============================================================ -->
<div v-if="showSuccess" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
  <div class="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full text-center shadow-2xl animate-in slide-in-from-bottom-8 duration-400">
    <div class="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
      <i class="ri-check-line text-4xl text-white"></i>
    </div>
    <h3 class="text-2xl font-bold text-slate-900 mb-3">Thank You!</h3>
    <p class="text-slate-600 leading-relaxed mb-6">
      We've received your request. One of our pool care specialists will contact you shortly to discuss your service needs.
    </p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <button
      @click="closeModal"
      class="px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300"
      >
      Return Home
    </button>
    <button
    @click="closeModal"
    class="px-8 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
    >
    Book Another Service
  </button>
</div>
</div>
</div>
</div>
</template>

<script setup>
import { ref } from 'vue'

// ─── Form Data ──────────────────────────────────────────────────────
const form = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  propertyType: '',
  serviceNeeded: '',
  poolType: '',
  serviceDate: '',
  contactMethod: '',
  message: '',
})

const showSuccess = ref(false)

// ─── Form Options ──────────────────────────────────────────────────
const propertyTypes = [
  'Residential Home',
  'Apartment Community',
  'Hotel',
  'HOA',
  'Commercial Property',
  'Vacation Rental',
  'Other',
]

const services = [
  'Weekly Pool Cleaning',
  'One-Time Cleaning',
  'Chemical Balancing',
  'Pool Inspection',
  'Equipment Repair',
  'Green Pool Recovery',
  'Commercial Maintenance',
  'Emergency Service',
]

const poolTypes = [
  'In-Ground',
  'Above Ground',
  'Saltwater',
  'Chlorine',
  'Not Sure',
]

const contactMethods = ['Phone', 'Email', 'Text Message']

// ─── Why Choose Us Reasons ──────────────────────────────────────
const reasons = [
{
  icon: 'ri-shield-check-line',
  title: 'Licensed & Insured',
  description: 'Professional technicians you can trust with full licensing and insurance coverage.',
},
{
  icon: 'ri-calendar-check-line',
  title: 'Weekly Maintenance',
  description: 'Reliable recurring service that keeps your pool clean and healthy year-round.',
},
{
  icon: 'ri-flashlight-line',
  title: 'Fast Response',
  description: 'Quick scheduling and prompt arrival for all your pool service needs.',
},
{
  icon: 'ri-emotion-happy-line',
  title: 'Satisfaction Guaranteed',
  description: 'We\'re committed to exceptional service and complete customer satisfaction.',
},
]

// ─── Service Areas ─────────────────────────────────────────────────
const serviceAreas = [
  'Residential Pools',
  'Hotels',
  'HOAs',
  'Apartments',
  'Commercial Pools',
  'Luxury Homes',
]

// ─── Steps ─────────────────────────────────────────────────────────
const steps = [
{
  number: '01',
  icon: 'ri-file-list-3-line',
  title: 'Submit Request',
  description: 'Fill out our quick form and tell us about your pool.',
},
{
  number: '02',
  icon: 'ri-phone-line',
  title: 'We Contact You',
  description: 'Our team will reach out to schedule a convenient time.',
},
{
  number: '03',
  icon: 'ri-search-eye-line',
  title: 'Free Pool Inspection',
  description: 'We assess your pool and provide a customized quote.',
},
{
  number: '04',
  icon: 'ri-water-flash-line',
  title: 'Enjoy Your Pool',
  description: 'Relax while we keep your pool crystal clear and worry-free.',
},
]

// ─── Form Submission ─────────────────────────────────────────────
const submitForm = () => {
  console.log('Form submitted:', form.value)
  showSuccess.value = true
  // Reset form
  // form.value = { fullName: '', email: '', phone: '', address: '', propertyType: '', serviceNeeded: '', poolType: '', serviceDate: '', contactMethod: '', message: '' }
}

const closeModal = () => {
  showSuccess.value = false
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* Import Remix Icon CDN */
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css');

.container {
  max-width: 1280px;
}

html {
  scroll-behavior: smooth;
}

/* Animations for modal */
.animate-in {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.slide-in-from-bottom-8 {
  animation-name: slideInUp;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Floating animation for map pin */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
</style>