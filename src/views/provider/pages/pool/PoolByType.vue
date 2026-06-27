<template>
  <div class="min-h-screen bg-slate-50 font-inter">

    <!-- ===== PAGE HEADER ===== -->
    <div class="relative overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 border-b border-slate-200">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div class="absolute -bottom-10 left-10 w-60 h-60 rounded-full bg-teal-500/10 blur-3xl"></div>
      </div>
      <div class="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">Pool Types</h1>
              <p class="text-sm text-slate-500 mt-0.5">Monitor every pool based on its chemical system.</p>
            </div>
          </div>
          <button @click="fetchAll" :disabled="loading" class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-200 disabled:opacity-50">
            <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

      <!-- ===== SUMMARY STAT CARDS ===== -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <!-- Skeleton -->
        <template v-if="loading">
          <div v-for="i in 5" :key="i" class="rounded-2xl bg-white border border-slate-200 p-5 animate-pulse shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-slate-200"></div>
              <div class="h-4 bg-slate-200 rounded-lg w-20"></div>
            </div>
            <div class="h-8 bg-slate-200 rounded-lg w-16 mb-2"></div>
            <div class="h-3 bg-slate-200 rounded-lg w-12 mb-3"></div>
            <div class="h-1.5 bg-slate-200 rounded-full"></div>
          </div>
        </template>

        <!-- Loaded Cards -->
        <template v-else>
          <div
            v-for="type in typeConfigs"
            :key="type.key"
            @click="selectType(type.key)"
            :class="[
              'group relative overflow-hidden rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
              selectedType === type.key
                ? type.selectedBorder + ' ' + type.selectedBg + ' shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
            ]"
          >
            <div :class="['absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl transition-all duration-300', type.glowBg, 'group-hover:opacity-100 opacity-60']"></div>
            <div class="relative">
              <div class="flex items-center gap-3 mb-4">
                <div :class="['flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br border', type.iconBg, type.iconBorder]">
                  <component :is="type.icon" class="w-5 h-5 text-white" />
                </div>
                <span class="text-sm font-semibold text-slate-700">{{ type.label }}</span>
              </div>
              <div class="text-3xl font-bold text-slate-800 mb-1">{{ summary[type.key] ?? 0 }}</div>
              <div class="text-xs text-slate-500 mb-3">{{ getPercentage(type.key) }}% of total</div>
              <div class="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  :class="['h-full rounded-full bg-gradient-to-r transition-all duration-700', type.progressGradient]"
                  :style="{ width: getPercentage(type.key) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- ===== DOUGHNUT CHART ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-base font-bold text-slate-800">Pool Distribution</h2>
              <p class="text-xs text-slate-500 mt-0.5">By chemical type</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {{ totalPools }} Total
            </span>
          </div>

          <!-- Chart skeleton -->
          <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="w-48 h-48 rounded-full bg-slate-200 animate-pulse relative">
              <div class="absolute inset-8 rounded-full bg-white"></div>
            </div>
          </div>

          <div v-else class="relative flex items-center justify-center">
            <canvas ref="chartCanvas" class="max-w-xs max-h-64"></canvas>
            <div class="absolute text-center pointer-events-none">
              <div class="text-3xl font-bold text-slate-800">{{ totalPools }}</div>
              <div class="text-xs text-slate-500">Pools</div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 mb-6">Type Breakdown</h2>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center gap-3 animate-pulse">
              <div class="w-3 h-3 rounded-full bg-slate-200"></div>
              <div class="flex-1 h-4 bg-slate-200 rounded-lg"></div>
              <div class="w-12 h-4 bg-slate-200 rounded-lg"></div>
            </div>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="type in typeConfigs"
              :key="type.key"
              @click="selectType(type.key)"
              class="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-all duration-200 group"
            >
              <div :class="['w-3 h-3 rounded-full bg-gradient-to-r flex-shrink-0', type.progressGradient]"></div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">{{ type.label }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-400">{{ summary[type.key] ?? 0 }} pools</span>
                    <span class="text-xs font-semibold text-slate-600">{{ getPercentage(type.key) }}%</span>
                  </div>
                </div>
                <div class="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                  <div :class="['h-full rounded-full bg-gradient-to-r transition-all duration-700', type.progressGradient]" :style="{ width: getPercentage(type.key) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== CHEMICAL TYPE GRID ===== -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-slate-800">Chemical Systems</h2>
          <button v-if="selectedType" @click="clearSelection" class="text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            Clear Selection
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            v-for="type in typeConfigs"
            :key="type.key"
            @click="selectType(type.key)"
            :class="[
              'rounded-3xl shadow-sm border p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group',
              selectedType === type.key
                ? type.selectedBorder + ' ' + type.selectedBg + ' shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            ]"
          >
            <div :class="['flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br mb-4 transition-transform duration-300 group-hover:scale-110', type.iconBg]">
              <component :is="type.icon" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-base font-bold text-slate-800 mb-1">{{ type.label }}</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl font-bold text-slate-800">{{ summary[type.key] ?? 0 }}</span>
              <span class="text-sm text-slate-500">pools</span>
              <span :class="['ml-auto text-xs font-semibold px-2 py-0.5 rounded-full', type.badgeBg, type.badgeText]">{{ getPercentage(type.key) }}%</span>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">{{ type.description }}</p>
          </div>
        </div>
      </div>

      <!-- ===== POOLS TABLE ===== -->
      <div v-if="selectedType">
        <div class="flex items-center gap-3 mb-4">
          <div :class="['flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br', selectedConfig?.iconBg]">
            <component :is="selectedConfig?.icon" class="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-800">{{ selectedConfig?.label }} Pools</h2>
            <p class="text-xs text-slate-500">{{ filteredPools.length }} pools found</p>
          </div>
        </div>

        <!-- Table Skeleton -->
        <div v-if="loading" class="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="bg-slate-50 border-b border-slate-200 px-5 py-3">
            <div class="h-4 bg-slate-200 rounded-lg w-full animate-pulse"></div>
          </div>
          <div class="divide-y divide-slate-100 bg-white">
            <div v-for="i in 4" :key="i" class="px-5 py-4 animate-pulse">
              <div class="flex items-center gap-4">
                <div class="w-9 h-9 rounded-xl bg-slate-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-slate-200 rounded-lg w-1/3"></div>
                  <div class="h-3 bg-slate-200 rounded-lg w-1/5"></div>
                </div>
                <div class="hidden md:flex gap-6">
                  <div class="h-4 bg-slate-200 rounded-lg w-24"></div>
                  <div class="h-4 bg-slate-200 rounded-lg w-16"></div>
                  <div class="h-6 bg-slate-200 rounded-full w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredPools.length === 0" class="flex flex-col items-center justify-center py-20 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div class="relative mb-6">
            <div :class="['absolute inset-0 rounded-full blur-2xl scale-150 opacity-30', selectedConfig?.glowBg]"></div>
            <div :class="['relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br border border-white/10', selectedConfig?.iconBg]">
              <component :is="selectedConfig?.icon" class="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 class="text-lg font-bold text-slate-700 mb-2">No {{ selectedConfig?.label }} Pools Found</h3>
          <p class="text-sm text-slate-500 text-center max-w-xs mb-6">There are no pools using the {{ selectedConfig?.label?.toLowerCase() }} chemical system yet.</p>
          <button @click="clearSelection" class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5">
            View All Pools
          </button>
        </div>

        <!-- Table -->
        <div v-else class="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <!-- Table Header -->
            <div class="bg-slate-50 border-b border-slate-200 px-5 py-3 min-w-[700px]">
              <div class="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div class="col-span-3">Pool</div>
                <div class="col-span-2">Customer</div>
                <div class="col-span-1 text-right">Volume</div>
                <div class="col-span-2">Chemical</div>
                <div class="col-span-1 text-center">Equipment</div>
                <div class="col-span-1">Last Service</div>
                <div class="col-span-1 text-center">Status</div>
                <div class="col-span-1 text-right">Actions</div>
              </div>
            </div>

            <!-- Table Body -->
            <div class="divide-y divide-slate-100 bg-white min-w-[700px]">
              <div
                v-for="pool in filteredPools"
                :key="pool.id"
                class="group grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-slate-50 transition-all duration-200 border-l-2 border-transparent hover:border-cyan-500"
              >
                <!-- Pool -->
                <div class="col-span-3 flex items-center gap-3">
                  <div :class="['flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br border border-white/10 flex-shrink-0', selectedConfig?.iconBg]">
                    <component :is="selectedConfig?.icon" class="w-4 h-4 text-white" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-slate-700 truncate">{{ pool.label }}</div>
                    <div class="text-xs text-slate-400 font-mono">#{{ String(pool.id).padStart(4, '0') }}</div>
                  </div>
                </div>

                <!-- Customer -->
                <div class="col-span-2 flex items-center gap-2">
                  <div :class="['flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white flex-shrink-0', getAvatarColor(pool.customer?.contact_name || '')]">
                    {{ (pool.customer?.contact_name || '?').charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm text-slate-600 truncate">{{ pool.customer?.contact_name || 'N/A' }}</span>
                </div>

                <!-- Volume -->
                <div class="col-span-1 text-right">
                  <span class="text-sm font-semibold text-slate-700">{{ formatVolume(pool.volume_gallons) }}</span>
                  <span class="text-xs text-slate-400 ml-0.5">gal</span>
                </div>

                <!-- Chemical -->
                <div class="col-span-2">
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border', getChemicalStyle(pool.chemical_type)]">
                    <span :class="['w-1.5 h-1.5 rounded-full', getChemicalDot(pool.chemical_type)]"></span>
                    {{ pool.chemical_type }}
                  </span>
                </div>

                <!-- Equipment -->
                <div class="col-span-1 flex justify-center">
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-600 border border-violet-200">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    </svg>
                    {{ pool.equipment_count ?? 0 }}
                  </span>
                </div>

                <!-- Last Service -->
                <div class="col-span-1">
                  <span class="text-xs text-slate-500">{{ formatDate(pool.updated_at) }}</span>
                </div>

                <!-- Status -->
                <div class="col-span-1 flex justify-center">
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', pool.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200']">
                    <span :class="['w-1.5 h-1.5 rounded-full', pool.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400']"></span>
                    {{ pool.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="col-span-1 flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button class="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 hover:bg-cyan-50 hover:text-cyan-600 text-slate-400 border border-slate-200 hover:border-cyan-200 transition-all duration-200" title="View">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                  <button class="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-400 border border-slate-200 hover:border-amber-200 transition-all duration-200" title="Edit">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Banner -->
      <div v-if="error" class="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
        <svg class="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ error }}
        <button @click="fetchAll" class="ml-auto text-xs font-semibold underline hover:no-underline">Retry</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, defineComponent, h } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import api from '../../../../services/api.js'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

// ===== ICON COMPONENTS (inline Heroicons SVG) =====
const DropletIcon = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 2C8.5 8 5 13 5 16a7 7 0 0014 0c0-3-3.5-8-7-14z' })
  ])
})

const SparklesIcon = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' })
  ])
})

const BeakerIcon = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' })
  ])
})

const ShieldIcon = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
  ])
})

const LeafIcon = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 3s5 0 9 4 5 9 5 9-5 0-9-4S5 3 5 3zm0 0l7 14' })
  ])
})

// ===== TYPE CONFIG =====
const typeConfigs = [
  {
    key: 'chlorine',
    label: 'Chlorine',
    description: 'Traditional chlorine sanitation system.',
    icon: DropletIcon,
    iconBg: 'from-blue-500 to-cyan-500',
    iconBorder: 'border-blue-400/20',
    progressGradient: 'from-blue-500 to-cyan-500',
    glowBg: 'bg-blue-500/10',
    selectedBorder: 'border-blue-500/50',
    selectedBg: 'bg-blue-50',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-600',
    chartColor: '#3b82f6',
  },
  {
    key: 'salt',
    label: 'Salt',
    description: 'Saltwater chlorination system.',
    icon: SparklesIcon,
    iconBg: 'from-emerald-500 to-green-500',
    iconBorder: 'border-emerald-400/20',
    progressGradient: 'from-emerald-500 to-green-500',
    glowBg: 'bg-emerald-500/10',
    selectedBorder: 'border-emerald-500/50',
    selectedBg: 'bg-emerald-50',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-600',
    chartColor: '#10b981',
  },
  {
    key: 'bromine',
    label: 'Bromine',
    description: 'Ideal for spas and indoor pools.',
    icon: BeakerIcon,
    iconBg: 'from-orange-500 to-amber-500',
    iconBorder: 'border-orange-400/20',
    progressGradient: 'from-orange-500 to-amber-500',
    glowBg: 'bg-orange-500/10',
    selectedBorder: 'border-orange-500/50',
    selectedBg: 'bg-orange-50',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-600',
    chartColor: '#f97316',
  },
  {
    key: 'baquacil',
    label: 'Baquacil',
    description: 'Chlorine-free sanitization.',
    icon: ShieldIcon,
    iconBg: 'from-purple-500 to-fuchsia-500',
    iconBorder: 'border-purple-400/20',
    progressGradient: 'from-purple-500 to-fuchsia-500',
    glowBg: 'bg-purple-500/10',
    selectedBorder: 'border-purple-500/50',
    selectedBg: 'bg-purple-50',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-600',
    chartColor: '#a855f7',
  },
  {
    key: 'mineral',
    label: 'Mineral',
    description: 'Mineral purification system.',
    icon: LeafIcon,
    iconBg: 'from-teal-500 to-cyan-500',
    iconBorder: 'border-teal-400/20',
    progressGradient: 'from-teal-500 to-cyan-500',
    glowBg: 'bg-teal-500/10',
    selectedBorder: 'border-teal-500/50',
    selectedBg: 'bg-teal-50',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-600',
    chartColor: '#14b8a6',
  },
]

// ===== STATE =====
const allPools = ref([])
const summary = ref({ chlorine: 0, salt: 0, bromine: 0, baquacil: 0, mineral: 0 })
const filteredPools = ref([])
const selectedType = ref(null)
const loading = ref(false)
const error = ref(null)
const chartCanvas = ref(null)
let chartInstance = null

// ===== COMPUTED =====
const totalPools = computed(() =>
  Object.values(summary.value).reduce((a, b) => a + b, 0)
)

const selectedConfig = computed(() =>
  typeConfigs.find(t => t.key === selectedType.value) ?? null
)

function getPercentage(key) {
  if (!totalPools.value) return 0
  return Math.round(((summary.value[key] ?? 0) / totalPools.value) * 100)
}

// ===== API =====
async function fetchPools() {
  loading.value = true
  error.value = null
  try {
    const response = await api().get('/pool-management/pools')
    const data = response.data
    
    // Extract pools array from paginated response
    const pools = data.data || data || []
    allPools.value = pools
    
    // Calculate summary
    const summaryData = { chlorine: 0, salt: 0, bromine: 0, baquacil: 0, mineral: 0 }
    pools.forEach(pool => {
      const type = pool.chemical_type?.toLowerCase()
      if (summaryData.hasOwnProperty(type)) {
        summaryData[type]++
      }
    })
    summary.value = summaryData
    
    return pools
  } catch (e) {
    error.value = 'Failed to load pools data. Please try again.'
    console.error('Error fetching pools:', e)
    throw e
  } finally {
    loading.value = false
  }
}

async function fetchAll() {
  try {
    await fetchPools()
    if (selectedType.value) {
      filterPoolsByType(selectedType.value)
    }
  } catch (e) {
    // Error already handled in fetchPools
  }
}

// ===== ACTIONS =====
function filterPoolsByType(type) {
  loading.value = true
  try {
    const filtered = allPools.value.filter(pool => 
      pool.chemical_type?.toLowerCase() === type.toLowerCase()
    )
    filteredPools.value = filtered
  } catch (e) {
    error.value = `Failed to filter ${type} pools.`
    console.error('Error filtering pools:', e)
  } finally {
    loading.value = false
  }
}

function selectType(key) {
  if (selectedType.value === key) {
    clearSelection()
    return
  }
  selectedType.value = key
  filterPoolsByType(key)
}

function clearSelection() {
  selectedType.value = null
  filteredPools.value = []
}

// ===== CHART =====
function buildChart() {
  if (!chartCanvas.value) return
  if (chartInstance) chartInstance.destroy()

  const data = typeConfigs.map(t => summary.value[t.key] ?? 0)
  const colors = typeConfigs.map(t => t.chartColor)
  const labels = typeConfigs.map(t => t.label)

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          titleColor: '#1e293b',
          bodyColor: '#64748b',
          padding: 10,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed} pools (${getPercentage(typeConfigs[ctx.dataIndex].key)}%)`
          }
        }
      },
      animation: { duration: 800, easing: 'easeInOutQuart' }
    }
  })
}

// ===== STYLE HELPERS =====
function getChemicalStyle(type) {
  const map = {
    chlorine: 'bg-blue-50 text-blue-600 border-blue-200',
    salt: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    bromine: 'bg-orange-50 text-orange-600 border-orange-200',
    baquacil: 'bg-purple-50 text-purple-600 border-purple-200',
    mineral: 'bg-teal-50 text-teal-600 border-teal-200',
  }
  return map[type?.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-200'
}

function getChemicalDot(type) {
  const map = {
    chlorine: 'bg-blue-500',
    salt: 'bg-emerald-500',
    bromine: 'bg-orange-500',
    baquacil: 'bg-purple-500',
    mineral: 'bg-teal-500',
  }
  return map[type?.toLowerCase()] || 'bg-slate-500'
}

function getAvatarColor(name) {
  const colors = ['bg-violet-600', 'bg-blue-600', 'bg-cyan-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-pink-600', 'bg-indigo-600']
  return colors[(name?.charCodeAt(0) || 0) % colors.length]
}

function formatVolume(v) {
  return v ? Number(v).toLocaleString() : '—'
}

function formatDate(date) {
  if (!date) return '—'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return '—'
  }
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await fetchPools()
  await nextTick()
  buildChart()
})

watch(summary, async () => {
  await nextTick()
  buildChart()
}, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.font-inter { font-family: 'Inter', sans-serif; }
</style>