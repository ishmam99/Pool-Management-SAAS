<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/40 p-4 md:p-8"
  >
    <!-- Loading -->
    <div v-if="loading" class=" mx-auto space-y-6 animate-pulse">
      <div class="h-10 w-64 bg-gray-200 rounded-xl"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 2" :key="i" class="h-56 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="mx-auto">
      <header class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-xl shadow-lg shadow-teal-500/30"
          >
            <i class="ri-drop-fill"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">My Pools</h1>
            <p class="text-gray-500">
              View your pools and explore service history for each one.
            </p>
          </div>
        </div>
      </header>

      <!-- Empty -->
      <div
        v-if="pools.length === 0"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
      >
        <div class="text-6xl mb-4">🏊</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No pools yet</h3>
        <p class="text-gray-500">
          Your service provider hasn't added any pools to your account.
        </p>
      </div>

      <!-- Pool Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="pool in pools"
          :key="pool.id"
          class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all duration-300"
        >
          <div class="h-2 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center text-2xl"
                >
                  🏊
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">
                    {{ pool.label || pool.name || "Pool" }}
                  </h2>
                  <p
                    v-if="pool.service_address"
                    class="text-sm text-gray-500 mt-0.5"
                  >
                    {{ pool.service_address }}
                  </p>
                </div>
              </div>
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="
                  pool.is_active !== false
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
                "
              >
                {{ pool.is_active !== false ? "Active" : "Inactive" }}
              </span>
            </div>

            <dl class="grid grid-cols-2 gap-3 mb-6">
              <div class="bg-gray-50 rounded-xl p-3">
                <dt class="text-xs text-gray-500 uppercase tracking-wide">
                  Volume
                </dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">
                  {{
                    pool.volume_gallons
                      ? `${pool.volume_gallons} gal`
                      : "Not specified"
                  }}
                </dd>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <dt class="text-xs text-gray-500 uppercase tracking-wide">
                  Chemical
                </dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">
                  {{ pool.chemical_type || "Unknown" }}
                </dd>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <dt class="text-xs text-gray-500 uppercase tracking-wide">
                  Season
                </dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">
                  {{ pool.season || "Not set" }}
                </dd>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <dt class="text-xs text-gray-500 uppercase tracking-wide">
                  Gate Code
                </dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">
                  {{ pool.gate_code || "N/A" }}
                </dd>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <dt class="text-xs text-gray-500 uppercase tracking-wide">
                  Has Dog
                </dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">
                  {{
                    pool.has_dog === true
                      ? "Yes"
                      : pool.has_dog === false
                        ? "No"
                        : "Unknown"
                  }}
                </dd>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <dt class="text-xs text-gray-500 uppercase tracking-wide">
                  Equipment
                </dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">
                  {{ pool.equipment?.length || 0 }} items
                </dd>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 col-span-2">
                <dt class="text-xs text-gray-500 uppercase tracking-wide">
                  Notes
                </dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">
                  {{ pool.access_notes || "No access notes available" }}
                </dd>
              </div>
            </dl>
            <!-- <div v-if="pool.equipment?.length" class="space-y-3 mb-4">
              <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Equipment</h3>
              <div class="grid grid-cols-1 gap-3">
                <div
                  v-for="equip in pool.equipment"
                  :key="equip.id"
                  class="border border-gray-100 rounded-2xl p-3 bg-gray-50"
                >
                  <div class="flex items-center justify-between gap-3 mb-1">
                    <p class="font-semibold text-gray-800">{{ equip.brand }} {{ equip.model }}</p>
                    <span class="text-xs text-gray-500 uppercase tracking-wide">{{ equip.type }}</span>
                  </div>
                  <p class="text-sm text-gray-600">Serial: {{ equip.serial_number }}</p>
                  <p class="text-sm text-gray-600">Installed: {{ formatDate(equip.install_date) }}</p>
                </div>
              </div>
            </div> -->

            <router-link
    v-if="pool && pool.id"
    :to="{
      path: `/customer/pools/${pool.id}/history`,
      query: { name: pool.label || '' }
    }"
    class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold shadow-md shadow-teal-500/25 hover:from-teal-600 hover:to-cyan-700 hover:shadow-lg transition-all group-hover:scale-[1.01]"
  >

    <i class="ri-history-line text-lg"></i>
    View Pool Details
  </router-link>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import {
  customerPortalApi,
  getApiErrorMessage,
} from "../../../services/customerPortalApi.js";
import { formatDate } from "../utils/formatters.js";
import { useAuthStore } from "../../../store/AuthStore.js";

const authStore = useAuthStore();
const loading = ref(true);
const pools = ref([]);

const fetchPools = async () => {
  loading.value = true;
  try {
    const data = await customerPortalApi.getPools();
    pools.value = Array.isArray(data) ? data : data?.pools || [];
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Failed to Load Pools",
      text: getApiErrorMessage(error),
    });
  } finally {
    loading.value = false;
  }
};

watch(
  () => authStore.customerId,
  (newId, oldId) => {
    if (newId === oldId) return;

    fetchPools();
  },
);

onMounted(fetchPools);
</script>
