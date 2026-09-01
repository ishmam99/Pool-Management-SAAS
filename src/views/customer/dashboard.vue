<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/40 to-pink-50/30">
        <!-- Loading State -->
        <div v-if="loading" class="container mx-auto px-4 py-8">
            <div class="animate-pulse space-y-8">
                <div class="flex justify-between items-center">
                    <div class="space-y-2">
                        <div class="h-8 w-64 bg-gray-200 rounded"></div>
                        <div class="h-4 w-48 bg-gray-200 rounded"></div>
                    </div>
                    <div class="h-12 w-12 bg-gray-200 rounded-full"></div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div v-for="i in 6" :key="i" class="h-24 bg-gray-200 rounded-2xl"></div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 space-y-6">
                        <div class="h-64 bg-gray-200 rounded-2xl"></div>
                    </div>
                    <div class="space-y-6">
                        <div class="h-48 bg-gray-200 rounded-2xl"></div>
                        <div class="h-48 bg-gray-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="container mx-auto px-4 py-8">
            <!-- Header -->
            <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold mb-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Good {{ timeOfDay }}, {{ customerName }} 👋
                    </h1>
                    <p class="text-gray-500 flex items-center gap-2">
                        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        {{ currentDate }}
                    </p>
                </div>
                <div class="flex items-center gap-3 mt-4 md:mt-0">
                    <router-link
                    to="/customer/messages"
                    class="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 text-sm font-medium shadow-md hover:shadow-lg shadow-indigo-200/50"
                    >
                    <i class="ri-chat-3-line"></i>
                    Contact Provider
                </router-link>
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-purple-200/50 ring-2 ring-white">
                    {{ customerInitials }}
                </div>
            </div>
        </header>

        <!-- Stats Cards with subtle background colors -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div class="bg-indigo-50/70 rounded-2xl border border-indigo-100/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold text-gray-800">{{ stats.total_pools ?? 0 }}</div>
                    <div class="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <i class="ri-drop-fill text-lg"></i>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Pools</div>
            </div>
            <div class="bg-emerald-50/70 rounded-2xl border border-emerald-100/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold text-emerald-600">{{ stats.active_agreements ?? 0 }}</div>
                    <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <i class="ri-file-text-line text-lg"></i>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Active Plans</div>
            </div>
            <div class="bg-blue-50/70 rounded-2xl border border-blue-100/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold text-gray-800">{{ stats.completed_services ?? 0 }}</div>
                    <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <i class="ri-checkbox-circle-line text-lg"></i>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Completed Visits</div>
            </div>
            <div class="bg-sky-50/70 rounded-2xl border border-sky-100/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold text-sky-600">{{ stats.total_invoices ?? 0 }}</div>
                    <div class="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        <i class="ri-receipt-line text-lg"></i>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Invoices</div>
            </div>
            <div class="bg-emerald-50/70 rounded-2xl border border-emerald-100/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(stats.total_paid) }}</div>
                    <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <i class="ri-wallet-3-line text-lg"></i>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Total Paid</div>
            </div>
            <div class="rounded-2xl border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group" :class="(stats.balance_due ?? 0) > 0 ? 'bg-rose-50/70 border-rose-100/50' : 'bg-gray-50/70 border-gray-100/50'">
                <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold" :class="(stats.balance_due ?? 0) > 0 ? 'text-rose-600' : 'text-gray-800'">
                        {{ formatCurrency(stats.balance_due) }}
                    </div>
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" :class="(stats.balance_due ?? 0) > 0 ? 'bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-500 group-hover:text-white'">
                        <i class="ri-coin-line text-lg"></i>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Balance Due</div>
            </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Pool Overview -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm">🏊</span>
                            My Pools
                        </h2>
                        <router-link to="/customer/pools" class="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2 transition">
                            View all →
                        </router-link>
                    </div>
                    <div v-if="pools.length === 0" class="text-center py-8 text-gray-500">
                        No pools on your account yet.
                    </div>
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                        v-for="pool in pools"
                        :key="pool.id"
                        class="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all duration-300 group"
                        >
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <div class="text-2xl mb-1">🏊</div>
                                <h3 class="font-semibold text-gray-800">{{ pool.label || pool.name }}</h3>
                            </div>
                            <span
                            class="px-2.5 py-1 text-xs rounded-full font-medium"
                            :class="pool.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'"
                            >
                            {{ pool.is_active !== false ? 'Active' : 'Inactive' }}
                        </span>
                    </div>
                    <router-link
                    :to="`/customer/pools/${pool.id}/history`"
                    class="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-500 hover:to-purple-500 hover:text-white group"
                    >
                    <i class="ri-history-line"></i>
                    Service History
                </router-link>
            </div>
        </div>
    </div>

    <!-- Recent Invoices -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-white text-sm">
                    <i class="ri-receipt-line"></i>
                </span>
                Recent Invoices
            </h2>
            <router-link to="/customer/billing" class="text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:underline underline-offset-2 transition">
                View all →
            </router-link>
        </div>
        <div v-if="recentInvoices.length === 0" class="text-center py-6 text-gray-500 text-sm">
            No recent invoices.
        </div>
        <div v-else class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="text-left text-xs text-gray-500 border-b border-gray-100 uppercase tracking-wide">
                        <th class="pb-3 font-semibold">Invoice</th>
                        <th class="pb-3 font-semibold">Amount</th>
                        <th class="pb-3 font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="inv in recentInvoices" :key="inv.invoice_number || inv.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td class="py-3 text-sm font-medium text-gray-800">{{ inv.invoice_number || `#${inv.id}` }}</td>
                        <td class="py-3 text-sm">{{ formatCurrency(inv.total) }}</td>
                        <td class="py-3">
                            <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(inv.status)">
                                {{ formatStatus(inv.status) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Right Column -->
<div class="space-y-6">
    <!-- Upcoming Visits -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-sm">
                    <i class="ri-calendar-event-line"></i>
                </span>
                Upcoming Visits
            </h2>
            <router-link to="/customer/schedule" class="text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline underline-offset-2 transition">
                Schedule →
            </router-link>
        </div>
        <div v-if="upcomingVisits.length === 0" class="text-center py-8 text-gray-500 text-sm">
            No upcoming visits scheduled.
        </div>
        <div v-else class="space-y-4">
            <div
            v-for="(visit, i) in upcomingVisits.slice(0, 3)"
            :key="i"
            class="p-4 rounded-xl border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-50/80 to-orange-50/60 border border-amber-100 hover:shadow-md transition-shadow"
            >
            <div class="text-sm font-semibold text-amber-700 flex items-center gap-2">
                <i class="ri-calendar-2-line"></i>
                {{ formatDate(visit.scheduled_date) }}
            </div>
            <div class="font-medium text-gray-800 mt-1 flex items-center gap-2">
                <span class="text-lg">🏊</span>
                {{ visit.pool?.label || 'Pool Visit' }}
            </div>
            <div v-if="visit.technician?.name" class="text-sm text-gray-600 mt-1.5 flex items-center gap-1.5">
                <i class="ri-user-line text-amber-500"></i>
                {{ visit.technician.name }}
            </div>
        </div>
    </div>
</div>

<!-- Quick Actions -->
<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-sm">
            <i class="ri-flashlight-fill"></i>
        </span>
        Quick Actions
    </h2>
    <div class="grid grid-cols-2 gap-3">
        <router-link
        v-for="action in quickActions"
        :key="action.to"
        :to="action.to"
        class="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 border border-transparent hover:border-indigo-200 transition-all duration-300 group text-center"
        >
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300 text-xl">
            <i :class="action.icon"></i>
        </div>
        <span class="text-xs font-medium text-gray-700 group-hover:text-indigo-700 transition-colors">{{ action.label }}</span>
    </router-link>
</div>
</div>
</div>
</div>
</div>
</div>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from 'vue'
    import Swal from 'sweetalert2'
    import { useAuthStore } from '../../store/AuthStore.js'
    import { customerPortalApi, getApiErrorMessage } from '../../services/customerPortalApi.js'
    import { formatCurrency, formatDate, formatStatus, statusBadgeClass, getInitials } from './utils/formatters.js'

    const authStore = useAuthStore()
    const loading = ref(true)
    const stats = ref({})
    const pools = ref([])
    const upcomingVisits = ref([])
    const recentInvoices = ref([])

    const customerName = computed(() => {
        return dashboardCustomer.value?.name || authStore.user?.name || 'Customer'
    })

    const customerInitials = computed(() => getInitials(customerName.value))

    const dashboardCustomer = ref(null)

    const currentDate = computed(() =>
        new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    )

    const timeOfDay = computed(() => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Morning'
        if (hour < 17) return 'Afternoon'
        return 'Evening'
    })

    const quickActions = [
        { to: '/customer/pools', icon: 'ri-drop-fill', label: 'My Pools' },
        { to: '/customer/schedule', icon: 'ri-calendar-check-line', label: 'Schedule' },
        { to: '/customer/billing', icon: 'ri-bank-card-line', label: 'Billing' },
        { to: '/customer/agreements', icon: 'ri-file-text-line', label: 'Agreements' },
        { to: '/customer/messages', icon: 'ri-chat-3-line', label: 'Messages' },
        { to: '/customer/profile', icon: 'ri-user-3-line', label: 'Profile' },
    ]

    const fetchDashboard = async () => {
        loading.value = true
        try {
            const data = await customerPortalApi.getDashboard()
            dashboardCustomer.value = data.customer
            stats.value = data.stats || {}
            pools.value = data.pools || []
            upcomingVisits.value = data.upcoming_visits || []
            recentInvoices.value = data.recent_invoices || []
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Failed to Load Dashboard',
                text: getApiErrorMessage(error),
            })
        } finally {
            loading.value = false
        }
    }

    watch(
        () => authStore.customerId,
        (newId, oldId) => {
            if (newId === oldId) return
            fetchDashboard()
        }
    )

    onMounted(fetchDashboard)
</script>