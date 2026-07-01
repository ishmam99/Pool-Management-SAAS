<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-cyan-50 p-4 md:p-8">
    <div class="w-full">
      <router-link to="/admin/tenants" class="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm mb-4 transition hover:bg-white">
        <i class="ri-arrow-left-line"></i> Back to Tenants
      </router-link>

      <div v-if="loading" class="animate-pulse space-y-4"><div class="h-32 bg-slate-200 rounded-3xl"></div></div>

      <template v-else-if="tenant">
        <div class="mb-6 rounded-[2rem] bg-gradient-to-r from-teal-500 to-sky-600 p-8 shadow-2xl text-white">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 class="text-4xl font-extrabold tracking-tight">{{ tenant.company_name || tenant.name }}</h1>
              <p class="mt-2 text-slate-100/90">Tenant #{{ tenant.id }}</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <router-link :to="`/admin/tenants/${tenant.id}/edit`" class="rounded-2xl bg-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/30 transition">Edit</router-link>
              <router-link :to="`/admin/tenants/domains/add?tenant_id=${tenant.id}`" class="rounded-2xl bg-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/30 transition">Add Domain</router-link>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section class="rounded-[2rem] bg-white/95 ring-1 ring-slate-200/80 p-8 shadow-xl w-full">
            <h2 class="text-lg font-semibold mb-5 text-slate-900">Company Information</h2>
            <div class="grid gap-5 text-sm">
              <div class="space-y-1">
                <p class="text-slate-500">Legal Name</p>
                <p class="font-medium text-slate-900">{{ tenant.legal_name || '—' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">EIN</p>
                <p class="font-medium text-slate-900">{{ tenant.ein || '—' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">Status</p>
                <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold" :class="statusBadgeClass(tenant.status)">{{ formatStatus(tenant.status) }}</span>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">Domain Mode</p>
                <p class="capitalize font-medium text-slate-900">{{ tenant.domain_mode || '—' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">Marketplace</p>
                <p class="font-medium text-slate-900">{{ tenant.marketplace_opt_in ? 'Enabled' : 'Disabled' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">Created</p>
                <p class="font-medium text-slate-900">{{ formatDate(tenant.created_at) }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-[2rem] bg-white/95 ring-1 ring-slate-200/80 p-8 shadow-xl w-full xl:col-span-2">
            <div class="grid gap-6">
              <div class="rounded-[1.5rem] bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-lg">
                <div class="flex items-center justify-between gap-4 mb-4">
                  <h2 class="text-lg font-semibold">Subscription</h2>
                  <span class="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">Status</span>
                </div>
                <div class="rounded-3xl bg-white/10 p-5 border border-white/10 text-sm">
                  <div v-if="tenant.subscription" class="grid gap-4">
                    <div class="flex items-center justify-between gap-4 text-slate-100">
                      <span>Plan</span>
                      <span class="font-semibold">{{ tenant.subscription.plan?.name || tenant.subscription.plan_name || '—' }}</span>
                    </div>
                    <div class="flex items-center justify-between gap-4 text-slate-100">
                      <span>Status</span>
                      <span class="font-semibold">{{ formatStatus(tenant.subscription.status) }}</span>
                    </div>
                  </div>
                  <p v-else class="text-slate-200">No subscription linked.</p>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between gap-4 mb-4">
                  <h2 class="text-lg font-semibold text-slate-900">Domains</h2>
                  <router-link :to="`/admin/tenants/domains/add?tenant_id=${tenant.id}`" class="text-sm font-semibold text-sky-600">Add Domain</router-link>
                </div>
                <div class="space-y-3">
                  <template v-if="tenant.domains?.length">
                    <div v-for="d in tenant.domains" :key="d.id || d.domain" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-[1.5rem] bg-slate-100 p-5 border border-slate-200">
                      <div>
                        <p class="font-semibold text-slate-900">{{ d.domain || d.domain_name }}</p>
                        <p class="text-xs text-slate-500">Type: {{ d.type || 'custom' }}</p>
                      </div>
                      <router-link :to="`/admin/tenants/domains/verify?tenant_id=${tenant.id}&domain=${encodeURIComponent(d.domain || d.domain_name)}`" class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition">
                        <i class="ri-check-line"></i>
                        Verify
                      </router-link>
                    </div>
                  </template>
                  <p v-else class="text-slate-500">No custom domains configured.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { adminApi, getApiErrorMessage } from '../../../../services/adminApi.js'
import { formatDate, formatStatus, statusBadgeClass } from '../../utils/formatters.js'

const route = useRoute()
const loading = ref(true)
const tenant = ref(null)

onMounted(async () => {
  try {
    tenant.value = await adminApi.getTenant(route.params.id)
  } catch (e) {
    await Swal.fire({ icon: 'error', title: 'Error', text: getApiErrorMessage(e) })
  } finally {
    loading.value = false
  }
})
</script>
