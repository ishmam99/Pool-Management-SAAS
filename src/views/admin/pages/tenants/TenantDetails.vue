<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-screen-2xl mx-auto w-full">
      <router-link to="/admin/tenants" class="inline-flex items-center gap-2 text-teal-600 text-sm font-medium mb-4"><i class="ri-arrow-left-line"></i> Back to Tenants</router-link>

      <div v-if="loading" class="animate-pulse space-y-4"><div class="h-32 bg-slate-200 rounded-2xl"></div></div>

      <template v-else-if="tenant">
        <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">{{ tenant.company_name || tenant.name }}</h1>
            <p class="text-slate-500 mt-1">Tenant #{{ tenant.id }}</p>
          </div>
          <div class="flex gap-2">
            <router-link :to="`/admin/tenants/${tenant.id}/edit`" class="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white">Edit</router-link>
            <router-link :to="`/admin/tenants/domains/add?tenant_id=${tenant.id}`" class="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white">Add Domain</router-link>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section class="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm w-full">
            <h2 class="text-lg font-semibold mb-5">Company Information</h2>
            <div class="grid gap-4 text-sm">
              <div class="space-y-1">
                <p class="text-slate-500">Legal Name</p>
                <p class="font-medium">{{ tenant.legal_name || '—' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">EIN</p>
                <p class="font-medium">{{ tenant.ein || '—' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">Status</p>
                <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold" :class="statusBadgeClass(tenant.status)">{{ formatStatus(tenant.status) }}</span>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">Domain Mode</p>
                <p class="capitalize font-medium">{{ tenant.domain_mode || '—' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">Marketplace</p>
                <p class="font-medium">{{ tenant.marketplace_opt_in ? 'Enabled' : 'Disabled' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-slate-500">Created</p>
                <p class="font-medium">{{ formatDate(tenant.created_at) }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm w-full xl:col-span-2">
            <div class="grid gap-6">
              <div>
                <h2 class="text-lg font-semibold mb-4">Subscription</h2>
                <div class="rounded-2xl bg-slate-50 p-5 border border-slate-200 text-sm">
                  <div v-if="tenant.subscription" class="grid gap-3">
                    <div class="flex items-center justify-between gap-4">
                      <span class="text-slate-500">Plan</span>
                      <span class="font-medium">{{ tenant.subscription.plan?.name || tenant.subscription.plan_name || '—' }}</span>
                    </div>
                    <div class="flex items-center justify-between gap-4">
                      <span class="text-slate-500">Status</span>
                      <span class="font-medium">{{ formatStatus(tenant.subscription.status) }}</span>
                    </div>
                  </div>
                  <p v-else class="text-slate-500">No subscription linked.</p>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between gap-4 mb-4">
                  <h2 class="text-lg font-semibold">Domains</h2>
                  <router-link :to="`/admin/tenants/domains/add?tenant_id=${tenant.id}`" class="text-sm font-semibold text-teal-600">Add Domain</router-link>
                </div>
                <div class="space-y-3">
                  <template v-if="tenant.domains?.length">
                    <div v-for="d in tenant.domains" :key="d.id || d.domain" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                      <div>
                        <p class="font-medium">{{ d.domain || d.domain_name }}</p>
                        <p class="text-xs text-slate-500">Type: {{ d.type || 'custom' }}</p>
                      </div>
                      <router-link :to="`/admin/tenants/domains/verify?tenant_id=${tenant.id}&domain=${encodeURIComponent(d.domain || d.domain_name)}`" class="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50">
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
