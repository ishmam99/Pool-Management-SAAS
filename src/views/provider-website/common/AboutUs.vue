<template>
  <div class="min-h-screen bg-white">
    <!-- ============================================================ -->
    <!-- HERO SECTION                                                  -->
    <!-- ============================================================ -->
    <section class="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 py-16 lg:py-24">
      <!-- Background decorative blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"></div>
        <div class="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-400/10 blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-sky-300/5 blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <!-- Left Content -->
          <div class="lg:w-1/2 space-y-7">
            <!-- Trust badge -->
            <div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-100 shadow-sm">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span class="text-sm font-medium text-slate-700">Trusted by 1,000+ property owners</span>
            </div>

            <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
              <span class="text-slate-900">Crystal Clear Pools,</span>
              <br />
              <span class="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">Every Single Day.</span>
            </h1>

            <p class="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              Professional swimming pool cleaning, maintenance, repairs, and water treatment for residential and commercial properties.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-2">
              <button class="group px-8 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Book Free Inspection
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </button>
              <button class="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm">
                Get Instant Quote
              </button>
            </div>

            <!-- Floating trust cards -->
            <div class="flex flex-wrap gap-3 pt-2">
              <span class="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-sm text-slate-700 border border-slate-100/80 shadow-sm">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                Certified Technicians
              </span>
              <span class="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-sm text-slate-700 border border-slate-100/80 shadow-sm">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                Weekly Service
              </span>
              <span class="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-sm text-slate-700 border border-slate-100/80 shadow-sm">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                100% Satisfaction
              </span>
              <span class="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-sm text-slate-700 border border-slate-100/80 shadow-sm">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                Fully Insured
              </span>
            </div>
          </div>

          <!-- Right Content - Hero Image & Stats -->
          <div class="lg:w-1/2 relative">
            <div class="relative">
              <!-- Main image card -->
              <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/20 border border-white/50">
                <img
                src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop&crop=center&auto=format"
                alt="Crystal clear luxury swimming pool"
                class="w-full h-[380px] lg:h-[420px] object-cover"
                />
                <!-- Gradient overlay for text readability -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>

                <!-- Floating stats overlay on image -->
                <div class="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
                  <div class="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 text-center shadow-lg border border-white/50">
                    <p class="text-2xl font-extrabold text-sky-600">1000+</p>
                    <p class="text-[11px] font-medium text-slate-600 uppercase tracking-wider">Pools Serviced</p>
                  </div>
                  <div class="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 text-center shadow-lg border border-white/50">
                    <p class="text-2xl font-extrabold text-cyan-600">15+</p>
                    <p class="text-[11px] font-medium text-slate-600 uppercase tracking-wider">Years Experience</p>
                  </div>
                  <div class="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 text-center shadow-lg border border-white/50">
                    <p class="text-2xl font-extrabold text-emerald-600">4.9★</p>
                    <p class="text-[11px] font-medium text-slate-600 uppercase tracking-wider">Customer Rating</p>
                  </div>
                </div>
              </div>

              <!-- Floating decorative elements -->
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-cyan-300/30 rounded-2xl rotate-12 backdrop-blur-sm border border-white/30 shadow-xl pointer-events-none"></div>
              <div class="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-sky-400/20 to-blue-400/20 rounded-full backdrop-blur-sm border border-white/30 shadow-xl pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- ABOUT AQUA CLEAN POOLS                                        -->
    <!-- ============================================================ -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="lg:w-1/2 space-y-6">
            <span class="text-sky-600 font-semibold text-sm tracking-widest uppercase">About Us</span>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900">About Aqua Clean Pools</h2>
            <div class="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Aqua Clean Pools is a locally trusted pool maintenance company dedicated to keeping your swimming pool crystal clear, healthy, and worry-free. With over 15 years of experience, our certified technicians provide dependable weekly service that you can count on.
              </p>
              <p>
                We take a customer-first approach to every job — from routine cleaning and water testing to equipment repair and full inspections. Our reliable scheduling ensures your pool is always pristine, so you can spend more time enjoying it and less time maintaining it.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Locally Trusted</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Experienced Techs</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Dependable Service</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Customer First</span>
              </div>
            </div>
          </div>

          <div class="lg:w-1/2">
            <div class="relative">
              <div class="grid grid-cols-2 gap-4">
                <div class="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                  src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=300&fit=crop&crop=center&auto=format"
                  alt="Pool cleaning service"
                  class="w-full h-48 object-cover"
                  />
                </div>
                <div class="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mt-8">
                  <img
                  src="https://images.unsplash.com/photo-1589739900243-4b52cd9dd6df?w=400&h=300&fit=crop&crop=center&auto=format"
                  alt="Water testing"
                  class="w-full h-48 object-cover"
                  />
                </div>
                <div class="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop&crop=center&auto=format"
                  alt="Pool equipment"
                  class="w-full h-48 object-cover"
                  />
                </div>
                <div class="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mt-8">
                  <img
                  src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=300&fit=crop&crop=center&auto=format"
                  alt="Pool inspection"
                  class="w-full h-48 object-cover"
                  />
                </div>
              </div>
              <!-- Floating label -->
              <div class="absolute -bottom-3 -right-3 bg-white rounded-2xl px-5 py-3 shadow-xl border border-slate-100/50 backdrop-blur-sm">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500">Satisfaction</p>
                    <p class="text-sm font-bold text-slate-900">100% Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- WHY HOMEOWNERS TRUST US                                       -->
    <!-- ============================================================ -->
    <section class="py-20 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-14">
          <span class="text-sky-600 font-semibold text-sm tracking-widest uppercase">Trust & Quality</span>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Why Homeowners Trust Us</h2>
          <p class="text-slate-600">We deliver peace of mind with every visit.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Card 1 -->
          <div class="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border border-slate-100/50 hover:border-sky-200/50">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">Reliable Weekly Maintenance</h3>
            <p class="text-slate-600 leading-relaxed">
              Consistency is key to a healthy pool. Our scheduled weekly service ensures your pool is always clean, balanced, and ready to swim. No surprises, no missed visits — just crystal clear water every time.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border border-slate-100/50 hover:border-cyan-200/50">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">Healthy & Safe Water</h3>
            <p class="text-slate-600 leading-relaxed">
              We use precise chemical balancing and advanced sanitation methods to keep your water safe for swimmers of all ages. Our technicians test and adjust levels to maintain optimal pH, alkalinity, and sanitizer readings.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- OUR POOL SERVICES                                             -->
    <!-- ============================================================ -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-14">
          <span class="text-sky-600 font-semibold text-sm tracking-widest uppercase">Services</span>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Our Pool Services</h2>
          <p class="text-slate-600">Comprehensive care for every aspect of your pool.</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="service in services" :key="service.title"
          class="group bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-400 hover:-translate-y-1.5 border border-slate-100 hover:border-sky-200/50">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span class="text-2xl">{{ service.icon }}</span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">{{ service.title }}</h3>
          <p class="text-slate-600 text-sm leading-relaxed">{{ service.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================================ -->
  <!-- HOW OUR SERVICE WORKS                                        -->
  <!-- ============================================================ -->
  <section class="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-sky-300 font-semibold text-sm tracking-widest uppercase">Process</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">How Our Service Works</h2>
        <p class="text-slate-300">Four simple steps to a crystal clear pool.</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div v-for="(step, index) in processSteps" :key="index"
        class="relative group">
        <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
          <div class="text-5xl font-extrabold text-white/10 mb-4 group-hover:text-white/20 transition-colors">{{ step.number }}</div>
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-cyan-500/30 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
            <span class="text-3xl">{{ step.icon }}</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">{{ step.title }}</h3>
          <p class="text-slate-300 text-sm leading-relaxed">{{ step.description }}</p>
        </div>
        <!-- Arrow connector (desktop) -->
        <div v-if="index < processSteps.length - 1"
        class="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-sky-500/30 to-cyan-500/30 group-hover:from-sky-400 group-hover:to-cyan-400 transition-all duration-300"></div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================ -->
<!-- RESIDENTIAL & COMMERCIAL SERVICES                            -->
<!-- ============================================================ -->
<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-14">
      <span class="text-sky-600 font-semibold text-sm tracking-widest uppercase">Serving All Properties</span>
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Residential & Commercial Services</h2>
      <p class="text-slate-600">Expert care for pools of every size and type.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Residential -->
      <div class="group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5">
        <div class="relative h-64 overflow-hidden">
          <img
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=500&fit=crop&crop=center&auto=format"
          alt="Residential luxury pool"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"></div>
          <div class="absolute bottom-6 left-6">
            <h3 class="text-2xl font-bold text-white">Residential Pools</h3>
          </div>
        </div>
        <div class="bg-white p-8 border border-slate-100 border-t-0 rounded-b-3xl">
          <ul class="grid grid-cols-2 gap-2">
            <li v-for="item in residentialFeatures" :key="item"
            class="flex items-center gap-2 text-sm text-slate-600">
            <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Commercial -->
    <div class="group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5">
      <div class="relative h-64 overflow-hidden">
        <img
        src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=500&fit=crop&crop=center&auto=format"
        alt="Commercial pool"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"></div>
        <div class="absolute bottom-6 left-6">
          <h3 class="text-2xl font-bold text-white">Commercial Pools</h3>
        </div>
      </div>
      <div class="bg-white p-8 border border-slate-100 border-t-0 rounded-b-3xl">
        <ul class="grid grid-cols-2 gap-2">
          <li v-for="item in commercialFeatures" :key="item"
          class="flex items-center gap-2 text-sm text-slate-600">
          <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</div>
</div>
</section>

<!-- ============================================================ -->
<!-- WHY CHOOSE AQUA CLEAN POOLS                                  -->
<!-- ============================================================ -->
<section class="py-20 bg-slate-50">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-14">
      <span class="text-sky-600 font-semibold text-sm tracking-widest uppercase">Why Us</span>
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Why Choose Aqua Clean Pools</h2>
      <p class="text-slate-600">The clear choice for pool care excellence.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="reason in reasons" :key="reason.title"
      class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-100 group">
      <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
        <span class="text-2xl">{{ reason.icon }}</span>
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2">{{ reason.title }}</h3>
      <p class="text-slate-600 text-sm leading-relaxed">{{ reason.description }}</p>
    </div>
  </div>
</div>
</section>

<!-- ============================================================ -->
<!-- POOL MAINTENANCE PLANS                                       -->
<!-- ============================================================ -->
<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-14">
      <span class="text-sky-600 font-semibold text-sm tracking-widest uppercase">Pricing</span>
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Pool Maintenance Plans</h2>
      <p class="text-slate-600">Choose the plan that fits your needs and budget.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div v-for="(plan, index) in pricingPlans" :key="plan.name"
      class="rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2"
      :class="[
        index === 1
        ? 'bg-gradient-to-br from-sky-600 to-cyan-600 text-white shadow-2xl shadow-sky-500/30 scale-105 border-0'
        : 'bg-white text-slate-900 shadow-md hover:shadow-xl border border-slate-100'
      ]">
      <!-- Popular badge -->
      <div v-if="index === 1" class="text-center mb-4">
        <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</span>
      </div>
      <div v-else class="h-8"></div>

      <h3 class="text-2xl font-bold" :class="index === 1 ? 'text-white' : 'text-slate-900'">{{ plan.name }}</h3>
      <div class="mt-2 mb-5">
        <span class="text-4xl font-extrabold" :class="index === 1 ? 'text-white' : 'text-slate-900'">${{ plan.price }}</span>
        <span class="text-sm" :class="index === 1 ? 'text-sky-100' : 'text-slate-500'">/mo</span>
      </div>

      <ul class="space-y-3 mb-8">
        <li v-for="feature in plan.features" :key="feature"
        class="flex items-start gap-3 text-sm"
        :class="index === 1 ? 'text-sky-50' : 'text-slate-600'">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" :class="index === 1 ? 'text-white' : 'text-emerald-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        {{ feature }}
      </li>
    </ul>

    <button
    class="w-full py-3.5 rounded-xl font-semibold transition-all duration-300"
    :class="index === 1
    ? 'bg-white text-sky-700 hover:bg-sky-50 shadow-lg hover:shadow-xl'
    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg'
    "
    >
    Get Started
  </button>
</div>
</div>
</div>
</section>

<!-- ============================================================ -->
<!-- CUSTOMER TESTIMONIALS                                        -->
<!-- ============================================================ -->
<section class="py-20 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-14">
      <span class="text-sky-600 font-semibold text-sm tracking-widest uppercase">Testimonials</span>
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">What Our Customers Say</h2>
      <p class="text-slate-600">Real reviews from real pool owners.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div v-for="testimonial in testimonials" :key="testimonial.name"
      class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1.5 border border-slate-100/50">
      <div class="flex gap-1 mb-4">
        <svg v-for="i in 5" :key="i" class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </div>
      <p class="text-slate-700 leading-relaxed mb-5 italic">"{{ testimonial.quote }}"</p>
      <div class="flex items-center gap-4">
        <img
        :src="testimonial.avatar"
        :alt="testimonial.name"
        class="w-12 h-12 rounded-full object-cover border-2 border-sky-100"
        />
        <div>
          <p class="font-bold text-slate-900">{{ testimonial.name }}</p>
          <p class="text-sm text-slate-500">{{ testimonial.role }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</section>

<!-- ============================================================ -->
<!-- SERVICE AREA                                                 -->
<!-- ============================================================ -->
<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="flex flex-col lg:flex-row items-center gap-16">
      <div class="lg:w-1/2">
        <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/10 border border-slate-100">
          <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop&crop=center&auto=format"
          alt="Service area map"
          class="w-full h-[340px] object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
          <!-- Map pin overlay -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div class="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/50 animate-pulse">
              <svg class="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:w-1/2 space-y-7">
        <span class="text-sky-600 font-semibold text-sm tracking-widest uppercase">Service Area</span>
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900">Proudly Serving Our Local Community</h2>
        <p class="text-slate-600 text-lg leading-relaxed">
          We provide professional pool maintenance and cleaning services for residential and commercial pools throughout our local area. No pool is too big or too small.
        </p>

        <div class="grid sm:grid-cols-3 gap-4 pt-2">
          <div class="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span class="text-sm font-medium text-slate-700">Fast Response</span>
          </div>
          <div class="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="text-sm font-medium text-slate-700">Flexible Scheduling</span>
          </div>
          <div class="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span class="text-sm font-medium text-slate-700">Licensed & Insured</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================ -->
<!-- FINAL CTA SECTION                                            -->
<!-- ============================================================ -->
<section class="py-20 relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-700">
  <!-- Wave pattern overlay -->
  <div class="absolute inset-0 opacity-10 pointer-events-none">
    <svg class="absolute bottom-0 left-0 w-full h-48" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="white"/>
    </svg>
    <svg class="absolute top-0 left-0 w-full h-32 rotate-180" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path d="M0,100 C360,200 720,0 1080,100 L1440,0 L1440,200 L0,200 Z" fill="white"/>
    </svg>
  </div>

  <div class="container mx-auto px-4 text-center relative z-10">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
        Ready for a Cleaner, Healthier Pool?
      </h2>
      <p class="text-sky-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
        Leave the maintenance to us while you enjoy your pool. Schedule your first service today.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="group px-10 py-4 bg-white text-sky-700 font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
          Book Your Service
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
        <button class="px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
          Request Free Estimate
        </button>
      </div>
    </div>
  </div>
</section>
</div>
</template>

<script setup>
import { ref } from 'vue'

// ─── Services ──────────────────────────────────────────────────────
const services = ref([
{
  icon: '🧹',
  title: 'Weekly Pool Cleaning',
  description: 'Comprehensive cleaning including skimming, vacuuming, and brushing to keep your pool spotless.'
},
{
  icon: '💧',
  title: 'Chemical Balancing',
  description: 'Precise water testing and chemical adjustments for safe, clear, and comfortable swimming conditions.'
},
{
  icon: '🔧',
  title: 'Equipment Inspection',
  description: 'Thorough checks of pumps, filters, heaters, and automation systems to ensure optimal performance.'
},
{
  icon: '🧽',
  title: 'Vacuuming & Brushing',
  description: 'Remove debris and algae from floors and walls with professional-grade equipment.'
},
{
  icon: '🕸️',
  title: 'Skimming Debris',
  description: 'Regular surface skimming to remove leaves, bugs, and floating contaminants before they sink.'
},
{
  icon: '📋',
  title: 'Pool Inspection',
  description: 'Detailed evaluation of your pool\'s overall health, identifying issues before they become problems.'
}
])

// ─── Process Steps ────────────────────────────────────────────────
const processSteps = ref([
{
  number: '01',
  icon: '📅',
  title: 'Schedule Service',
  description: 'Book online or give us a call. We\'ll find a time that works for you.'
},
{
  number: '02',
  icon: '🔍',
  title: 'Pool Inspection',
  description: 'We inspect water chemistry and equipment to identify any underlying issues.'
},
{
  number: '03',
  icon: '🧼',
  title: 'Professional Cleaning',
  description: 'Complete maintenance, brushing, vacuuming, and chemical balancing.'
},
{
  number: '04',
  icon: '🏊',
  title: 'Enjoy Your Pool',
  description: 'Relax and swim while we handle everything behind the scenes.'
}
])

// ─── Residential Features ────────────────────────────────────────
const residentialFeatures = ref([
'Weekly maintenance',
'Vacation homes',
'Luxury homes',
'Private pools'
])

// ─── Commercial Features ─────────────────────────────────────────
const commercialFeatures = ref([
'Hotels & resorts',
'Apartments',
'HOAs & communities',
'Fitness centers',
'Country clubs'
])

// ─── Reasons ──────────────────────────────────────────────────────
const reasons = ref([
{
  icon: '👨‍🔧',
  title: 'Certified Professionals',
  description: 'Our technicians are trained, licensed, and experienced in all aspects of pool care.'
},
{
  icon: '🌿',
  title: 'Eco-Friendly Chemicals',
  description: 'We use environmentally responsible products that are safe for swimmers and the planet.'
},
{
  icon: '💰',
  title: 'Affordable Pricing',
  description: 'Competitive rates with no hidden fees. Quality service at a fair price.'
},
{
  icon: '📅',
  title: 'Reliable Scheduling',
  description: 'We show up on time, every time. Consistent service you can depend on.'
},
{
  icon: '💬',
  title: 'Friendly Support',
  description: 'Our team is always ready to answer questions and address concerns.'
},
{
  icon: '⚡',
  title: 'Emergency Repairs',
  description: 'Fast response for urgent repairs and unexpected pool issues.'
}
])

// ─── Pricing Plans ───────────────────────────────────────────────
const pricingPlans = ref([
{
  name: 'Basic Care',
  price: '95',
  features: ['Weekly cleaning', 'Skimming & surface debris', 'Vacuuming', 'Basic water testing']
},
{
  name: 'Professional Care',
  price: '145',
  features: ['Everything in Basic', 'Full chemical balancing', 'Equipment inspection', 'Monthly report']
},
{
  name: 'Premium Care',
  price: '195',
  features: ['Everything in Professional', 'Priority support', 'Repairs discount', 'Seasonal opening/closing']
}
])

// ─── Testimonials ────────────────────────────────────────────────
const testimonials = ref([
{
  quote: 'Excellent service. Our pool has never looked better. The team is professional, punctual, and truly cares about quality.',
  name: 'Sarah M.',
  role: 'Homeowner',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face&auto=format'
},
{
  quote: 'Very reliable and professional. They handle everything so we can actually enjoy our pool instead of worrying about maintenance.',
  name: 'David R.',
  role: 'Property Manager',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format'
},
{
  quote: 'Highly recommend Aqua Clean Pools. They transformed our community pool and the residents couldn\'t be happier.',
  name: 'Jessica L.',
  role: 'HOA Board Member',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format'
}
])
</script>

<style scoped>
.container {
max-width: 1280px;
}

/* Smooth scroll behavior */
html {
scroll-behavior: smooth;
}

/* Subtle floating animation for decorative elements */
@keyframes float {
0%, 100% { transform: translateY(0px); }
50% { transform: translateY(-10px); }
}
</style>