<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <!-- Page Header -->
        <div class="max-w-7xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Subscription Management</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage subscription plans, tenants, and billing</p>
                </div>
                <div class="mt-4 sm:mt-0 flex gap-3">
                    <button @click="refreshData" 
                            :disabled="loading"
                            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <svg class="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500">Loading dashboard data...</p>
            </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="max-w-7xl mx-auto space-y-6">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Total Plans</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.total_plans || 0 }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ stats.active_plans || 0 }} active</p>
                        </div>
                        <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Total Subscriptions</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.total_subscriptions || 0 }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ stats.active_subscriptions || 0 }} active</p>
                        </div>
                        <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Monthly Revenue</p>
                            <p class="text-2xl font-bold text-gray-900">${{ (stats.monthly_revenue || 0).toFixed(2) }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ stats.total_invoiced || 0 }} invoices</p>
                        </div>
                        <div class="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v4m0 4v4m-6-2h12"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Expiring Soon</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.expiring_soon || 0 }}</p>
                            <p class="text-xs text-gray-400 mt-1">in next 7 days</p>
                        </div>
                        <div class="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <router-link to="/admin/subscription/plans" 
                             class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                    <svg class="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Manage Plans</span>
                </router-link>
                
                <router-link to="/admin/subscription/tenants" 
                             class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                    <svg class="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tenants</span>
                </router-link>
                
                <router-link to="/admin/subscription/invoices" 
                             class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                    <svg class="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                    </svg>
                    <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Invoices</span>
                </router-link>
                
                <router-link to="/admin/subscription/billing-config" 
                             class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                    <svg class="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Billing Config</span>
                </router-link>
            </div>

            <!-- Recent Subscriptions & Revenue Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Subscriptions -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Recent Subscriptions</h3>
                        <router-link to="/admin/subscription/tenants" 
                                     class="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            View All →
                        </router-link>
                    </div>
                    <div v-if="recentSubscriptions.length === 0" class="text-center py-8">
                        <p class="text-sm text-gray-500">No recent subscriptions</p>
                    </div>
                    <div v-else class="space-y-3">
                        <div v-for="sub in recentSubscriptions" :key="sub.id" 
                             class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ sub.tenant?.name || 'Unknown' }}</p>
                                <p class="text-xs text-gray-500">{{ sub.plan?.name || 'No Plan' }}</p>
                            </div>
                            <div class="text-right">
                                <span :class="{
                                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium': true,
                                    'bg-green-100 text-green-800': sub.status === 'active',
                                    'bg-blue-100 text-blue-800': sub.status === 'trialing',
                                    'bg-amber-100 text-amber-800': sub.status === 'grace_period',
                                    'bg-red-100 text-red-800': sub.status === 'suspended',
                                    'bg-gray-100 text-gray-800': sub.status === 'cancelled'
                                }">
                                    {{ sub.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Revenue Overview -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                        <select v-model="revenuePeriod" 
                                class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span class="text-sm text-gray-600">Total Invoiced</span>
                            <span class="text-sm font-semibold text-gray-900">${{ (stats.total_invoiced || 0).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span class="text-sm text-gray-600">Collected</span>
                            <span class="text-sm font-semibold text-green-600">${{ (stats.collected || 0).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span class="text-sm text-gray-600">Pending</span>
                            <span class="text-sm font-semibold text-amber-600">${{ (stats.pending_amount || 0).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span class="text-sm text-gray-600">Overdue</span>
                            <span class="text-sm font-semibold text-red-600">${{ (stats.overdue_amount || 0).toFixed(2) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminApi } from '@/api/admin/subscription.js';

const loading = ref(false);
const stats = ref({
    total_plans: 0,
    active_plans: 0,
    total_subscriptions: 0,
    active_subscriptions: 0,
    monthly_revenue: 0,
    total_invoiced: 0,
    collected: 0,
    pending_amount: 0,
    overdue_amount: 0,
    expiring_soon: 0
});
const recentSubscriptions = ref([]);
const revenuePeriod = ref('month');

const fetchDashboardData = async () => {
    loading.value = true;
    try {
        const [statsRes, subsRes] = await Promise.all([
            adminApi.getStats(),
            adminApi.getTenantSubscriptions({ per_page: 5 })
        ]);
        
        stats.value = statsRes.data.data;
        recentSubscriptions.value = subsRes.data.data.data || [];
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    } finally {
        loading.value = false;
    }
};

const refreshData = () => {
    fetchDashboardData();
};

onMounted(() => {
    fetchDashboardData();
});
</script>