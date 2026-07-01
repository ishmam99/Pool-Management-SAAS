<template>
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
</template>