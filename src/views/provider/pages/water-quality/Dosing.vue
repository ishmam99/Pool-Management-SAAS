<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Dosing Calculator</h1>
          <p class="text-slate-500 mt-1">Estimate chemical dosing requirements for pool adjustments.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Pool Volume</label>
              <input v-model.number="form.pool_volume" type="number" min="0" placeholder="15000" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Current pH</label>
                <input v-model.number="form.current_ph" type="number" step="0.1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Target pH</label>
                <input v-model.number="form.target_ph" type="number" step="0.1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Current Chlorine</label>
                <input v-model.number="form.current_chlorine" type="number" step="0.1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Target Chlorine</label>
                <input v-model.number="form.target_chlorine" type="number" step="0.1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Chemical Type</label>
              <select v-model="form.chemical_type" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="sodium_hypochlorite">Sodium Hypochlorite</option>
                <option value="sodium_bisulfate">Sodium Bisulfate</option>
                <option value="calcium_hypochlorite">Calcium Hypochlorite</option>
              </select>
            </div>
            <button @click="calculateDose" class="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">Calculate Dose</button>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Dose Recommendation</h2>
          <div v-if="loading" class="space-y-3">
            <div class="h-16 rounded-3xl bg-slate-100 animate-pulse"></div>
            <div class="h-16 rounded-3xl bg-slate-100 animate-pulse"></div>
          </div>
          <div v-else>
            <div v-if="!result">
              <p class="text-slate-500">Enter your pool details to see dosing guidance.</p>
            </div>
            <div v-else class="space-y-4">
              <div class="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                <p class="text-sm text-slate-500">pH Adjustment</p>
                <p class="mt-2 text-lg font-semibold text-slate-900">{{ result.ph_adjustment.amount }} {{ result.ph_adjustment.unit }} {{ result.ph_adjustment.chemical }}</p>
              </div>
              <div class="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                <p class="text-sm text-slate-500">Chlorine Adjustment</p>
                <p class="mt-2 text-lg font-semibold text-slate-900">{{ result.chlorine_adjustment.amount }} {{ result.chlorine_adjustment.unit }} {{ result.chlorine_adjustment.chemical }}</p>
              </div>
              <div class="rounded-3xl bg-slate-50 p-4 border border-slate-200 text-slate-700">
                {{ result.instructions }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { providerApi } from '../../../../services/providerApi.js'

const loading = ref(false)
const result = ref(null)
const form = ref({
  pool_volume: 15000,
  current_ph: 7.2,
  target_ph: 7.6,
  current_chlorine: 2.0,
  target_chlorine: 3.0,
  chemical_type: 'sodium_hypochlorite'
})

const calculateDose = async () => {
  loading.value = true
  try {
    result.value = await providerApi.calculateDose(form.value)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
