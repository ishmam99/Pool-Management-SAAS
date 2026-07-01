<template>
  <footer class="bg-slate-900 text-white">
    <!-- Newsletter Section -->
    <div class="border-b border-slate-800/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 class="text-2xl font-bold text-white">Stay Updated</h3>
            <p class="text-slate-400 mt-1">
              Get the latest pool management tips and product updates.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              class="px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 transition-colors w-full sm:w-64"
            />
            <button
              class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-ocean-blue to-aqua text-white font-semibold hover:scale-105 hover:shadow-lg hover:shadow-ocean-blue/25 transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
        <!-- Brand Area -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <img src="/src/assets/logo.png" alt="PoolSync" class="w-10 h-10 rounded-lg" />
            <span class="text-2xl font-bold text-white">PoolSync</span>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed mb-3">
            Smart pool management software helping service providers and pool owners manage maintenance, services, and operations efficiently.
          </p>
          <p class="text-ocean-blue text-sm font-medium">
            Built for modern pool businesses.
          </p>
        </div>

        <!-- Product Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">Product</h4>
          <ul class="space-y-2.5">
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Features</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Solutions</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Pricing</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Dashboard</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Integrations</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Updates</a></li>
          </ul>
        </div>

        <!-- Solutions -->
        <div>
          <h4 class="text-white font-semibold mb-4">Solutions</h4>
          <ul class="space-y-2.5">
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Manage Pools</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Schedule Maintenance</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Customer Management</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Work Orders</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Pool Monitoring</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Service Requests</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Water Reports</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Invoice Tracking</a></li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="text-white font-semibold mb-4">Resources</h4>
          <ul class="space-y-2.5">
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Blog</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Pool Maintenance Guide</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">FAQs</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Help Center</a></li>
            <li><a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors text-sm">Contact Support</a></li>
          </ul>
        </div>

        <!-- Contact Information -->
        <div>
          <h4 class="text-white font-semibold mb-4">Contact Us</h4>
          <ul class="space-y-2.5 text-slate-400 text-sm">
            <li class="font-medium text-white">PoolSync Headquarters</li>
            <li>420 Business Avenue</li>
            <li>Texas, USA</li>
            <li class="pt-1">
              <span class="text-white font-medium">Phone:</span><br />
              +1 (555) 123-4567
            </li>
            <li>
              <span class="text-white font-medium">Email:</span><br />
              <a href="mailto:hello@poolsync.com" class="hover:text-ocean-blue transition-colors">hello@poolsync.com</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Social Media & Bottom Footer -->
      <div class="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-slate-400 text-sm">
          &copy; 2026 PoolSync. All rights reserved.
        </p>

        <!-- Social Media Icons -->
        <div class="flex items-center gap-4">
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors" aria-label="LinkedIn">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors" aria-label="Facebook">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors" aria-label="Twitter/X">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors" aria-label="Instagram">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
        </div>

        <!-- Legal Links -->
        <div class="flex flex-wrap items-center gap-4 text-sm">
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors">Privacy Policy</a>
          <span class="text-slate-700">|</span>
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors">Terms of Service</a>
          <span class="text-slate-700">|</span>
          <a href="#" class="text-slate-400 hover:text-ocean-blue transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>