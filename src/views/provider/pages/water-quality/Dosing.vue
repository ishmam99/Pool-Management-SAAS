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
        <!-- Form -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Pool Volume (gallons)</label>
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
                <label class="block text-sm font-semibold text-slate-700 mb-2">Current Chlorine (ppm)</label>
                <input v-model.number="form.current_chlorine" type="number" step="0.1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Target Chlorine (ppm)</label>
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
            <button
              type="button"
              :disabled="loading"
              class="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50 transition"
              @click="calculateDose"
            >
              {{ loading ? 'Calculating...' : 'Calculate Dose' }}
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Dose Recommendation</h2>

          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-16 rounded-3xl bg-slate-100 animate-pulse"></div>
          </div>

          <div v-else-if="error" class="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {{ error }}
          </div>

          <div v-else-if="!result" class="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <div class="text-4xl mb-3">🧪</div>
            <p class="text-slate-500">Enter your pool details and click Calculate Dose to see recommendations.</p>
          </div>

          <div v-else class="space-y-4">
            <!-- Summary -->
            <div v-if="result.summary?.message" class="rounded-2xl bg-sky-50 border border-sky-200 p-4">
              <p class="text-sm font-semibold text-sky-900">{{ result.summary.message }}</p>
              <p v-if="result.pool_volume" class="text-xs text-sky-700 mt-1">Pool volume: {{ Number(result.pool_volume).toLocaleString() }} gallons</p>
            </div>

            <!-- Warnings -->
            <div v-if="result.warnings?.length" class="space-y-2">
              <div
                v-for="(warning, i) in result.warnings"
                :key="i"
                class="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 flex items-start gap-2"
              >
                <span>⚠️</span>
                <span>{{ warning }}</span>
              </div>
            </div>

            <!-- pH calculation -->
            <div v-if="result.calculations?.ph" class="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">pH Adjustment</p>
                <span class="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">pH</span>
              </div>
              <p class="text-lg font-bold text-slate-900">
                {{ result.calculations.ph.amount }} {{ result.calculations.ph.unit }}
              </p>
              <p class="text-sm text-slate-600 mt-1">{{ result.calculations.ph.chemical }}</p>
              <p v-if="result.calculations.ph.instruction" class="text-sm text-slate-500 mt-2 leading-relaxed">
                {{ result.calculations.ph.instruction }}
              </p>
            </div>

            <!-- Chlorine calculation -->
            <div v-if="result.calculations?.chlorine" class="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Chlorine Adjustment</p>
                <span class="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 font-medium">Chlorine</span>
              </div>
              <p class="text-lg font-bold text-slate-900">
                {{ result.calculations.chlorine.amount }} {{ result.calculations.chlorine.unit }}
              </p>
              <p class="text-sm text-slate-600 mt-1">{{ result.calculations.chlorine.chemical }}</p>
              <p v-if="result.calculations.chlorine.instruction" class="text-sm text-slate-500 mt-2 leading-relaxed">
                {{ result.calculations.chlorine.instruction }}
              </p>
            </div>

            <!-- Total chemicals -->
            <div v-if="result.total_chemicals?.length" class="rounded-2xl border border-slate-200 overflow-hidden">
              <div class="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <p class="text-sm font-semibold text-slate-800">Total Chemicals Needed</p>
              </div>
              <ul class="divide-y divide-slate-100">
                <li
                  v-for="(item, i) in result.total_chemicals"
                  :key="i"
                  class="px-4 py-3 flex items-center justify-between text-sm"
                >
                  <span class="text-slate-700">{{ item.chemical }}</span>
                  <span class="font-semibold text-slate-900">{{ item.amount }} {{ item.unit }}</span>
                </li>
              </ul>
            </div>

            <!-- Step-by-step instructions -->
            <div v-if="result.instructions?.length" class="rounded-2xl border border-slate-200 p-4">
              <p class="text-sm font-semibold text-slate-800 mb-3">Instructions</p>
              <ol class="space-y-2">
                <li
                  v-for="(step, i) in result.instructions"
                  :key="i"
                  class="flex gap-3 text-sm text-slate-700 leading-relaxed"
                >
                  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">
                    {{ i + 1 }}
                  </span>
                  <span>{{ step }}</span>
                </li>
              </ol>
            </div>

            <!-- No adjustments needed -->
            <div
              v-if="!result.calculations?.ph && !result.calculations?.chlorine && !result.instructions?.length"
              class="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800"
            >
              No chemical adjustments needed for the values entered.
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
const error = ref('')
const result = ref(null)
const form = ref({
  pool_volume: 15000,
  current_ph: 7.2,
  target_ph: 7.6,
  current_chlorine: 2.0,
  target_chlorine: 3.0,
  chemical_type: 'sodium_hypochlorite',
})

const calculateDose = async () => {
  loading.value = true
  error.value = ''
  try {
    result.value = await providerApi.calculateDose(form.value)
  } catch (err) {
    console.error(err)
    result.value = null
    error.value = err.response?.data?.message || 'Failed to calculate dose. Please check your inputs.'
  } finally {
    loading.value = false
  }
}
</script>
