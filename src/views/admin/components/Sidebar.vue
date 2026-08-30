<template>
    <div class="bg-slate-300 w-100 py-4 px-2 min-h-screen border-r border-gray-200">
        <div class="bg-[#a4cef125] p-2 h-full flex flex-col font-semibold">
            <!-- Header with Customer Info -->
            <div class="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-sm">
                <h4 class="font-bold text-center text-sm text-sky-700 mb-3 pb-2 border-b border-sky-100">
                    Admin Dashboard
                </h4>
                <div class="flex flex-col items-center gap-2">
                    <div
                        class="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                        {{ customerInitials }}
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-800">{{ customerName }}</p>
                        <p class="text-xs text-gray-500">Admin Dashboard</p>
                    </div>
                </div>
            </div>

            <!-- Menu Items -->
            <div class="space-y-2 flex-1 overflow-y-auto">
                <div v-for="menu in menus" :key="menu.id" class="accordion-group bg-transparent rounded-xl">
                    <!-- Menu Header -->
                    <div class="flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 cursor-pointer"
                        :class="dropdownHeaderClass" @click="toggleAccordion(menu.id)" :style="{
                            backgroundColor: openSection === menu.id ? getMenuColor(menu.title) : 'white',
                            color: openSection === menu.id ? 'white' : getMenuColor(menu.title),
                            border: `2px solid ${getMenuColor(menu.title)}`
                        }">
                        <div class="flex items-center gap-3">
                            <i class="py-1 px-2 rounded-md" :class="`${menu.icon}`" :style="{
                                backgroundColor: getMenuColor(menu.title),
                                color: 'white'
                            }"></i>
                            <span>{{ menu.title }}</span>
                        </div>
                        <i class="ri-arrow-down-s-line transition-transform duration-300"
                            :class="{ 'rotate-180': openSection === menu.id }" :style="{
                                color: openSection === menu.id ? 'white' : getMenuColor(menu.title)
                            }"></i>
                    </div>

                    <!-- Dropdown Content -->
                    <div v-show="openSection === menu.id" class="ml-4 mt-1 space-y-1 border-l-2 pl-3"
                        :style="{ borderColor: getMenuColor(menu.title) }">

                        <!-- Render Groups -->
                        <template v-for="group in menu.groups" :key="group.key">
                            <!-- Group Header (with toggle for sub-items) -->
                            <div class="flex items-center justify-between w-full p-2 text-sm rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200"
                                :style="{
                                    color: getMenuColor(menu.title)
                                }" @click="toggleGroup(group.key)">
                                <div class="flex items-center gap-2">
                                    <i class="py-1 px-2 rounded-md text-white text-xs" :class="`${group.icon}`" :style="{
                                        backgroundColor: getMenuColor(menu.title)
                                    }"></i>
                                    <span>{{ group.title }}</span>
                                </div>
                                <i class="ri-arrow-down-s-line transition-transform duration-300 text-xs"
                                    :class="{ 'rotate-180': openGroup === group.key }" :style="{
                                        color: getMenuColor(menu.title)
                                    }"></i>
                            </div>

                            <!-- Group Sub-items -->
                            <div v-show="openGroup === group.key" class="ml-6 mt-1 space-y-1 border-l-2 pl-3"
                                :style="{ borderColor: getMenuColor(menu.title) }">
                                <router-link v-for="link in group.links" :key="link.to" :to="link.to"
                                    class="flex items-center gap-2 p-2 text-sm rounded-lg transition-all duration-300"
                                    :class="dropdownItemClass" active-class="router-link-active" :style="{
                                        color: getMenuColor(menu.title),
                                        borderLeft: `3px solid transparent`
                                    }" @click="setActiveLink(menu.title, link.text)">
                                    <i class="py-1 px-2 rounded-md text-white text-xs" :class="`${link.icon}`" :style="{
                                        backgroundColor: getMenuColor(menu.title)
                                    }"></i>
                                    <span class="block max-w-[120px] truncate whitespace-nowrap" :title="link.text">
                                        {{ link.text }}
                                    </span>
                                </router-link>
                            </div>
                        </template>

                        <!-- Regular links (non-grouped) -->
                        <router-link v-for="link in menu.links" :key="link.to" :to="link.to"
                            class="flex items-center gap-2 p-2 text-sm rounded-lg transition-all duration-300"
                            :class="dropdownItemClass" active-class="router-link-active" :style="{
                                color: getMenuColor(menu.title),
                                borderLeft: `3px solid transparent`
                            }" @click="setActiveLink(menu.title, link.text)">
                            <i class="py-1 px-2 rounded-md text-white" :class="`${link.icon}`" :style="{
                                backgroundColor: getMenuColor(menu.title)
                            }"></i>
                            <span class="block max-w-[200px] truncate whitespace-nowrap" :title="link.text">
                                {{ link.text }}
                            </span>
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- LOGOUT -->
            <button type="button"
                class="py-3 px-6 mt-4 w-full bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-semibold transition-all duration-300 hover:from-red-700 hover:to-pink-700 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                @click="authStore.logout(), router.push('/login')">
                <i class="ri-logout-box-r-line"></i>
                Log Out
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../store/AuthStore.js'

const dropdownHeaderClass = 'bg-white text-blue-800 hover:bg-blue-50 shadow-md'
const dropdownItemClass = 'bg-white text-blue-800 hover:bg-blue-50'

const authStore = useAuthStore()
const router = useRouter()
const openSection = ref('')
const openGroup = ref('')
const isSidebarLoading = ref(false)

// Get customer info from auth store
const customerName = computed(() => {
    return authStore?.user?.name || authStore?.user?.full_name || 'Admin User'
})

const customerInitials = computed(() => {
    const name = customerName.value
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
})

// Menu Colors Configuration
const menuColors = {
    'Dashboard': '#0ea5e9',
    'Admin Management': '#8b5cf6',
    'Service Provider Management': '#14b8a6',
    'Billing Management': '#f97316',
}

// Function to get menu color with fallback
const getMenuColor = (menuTitle) => {
    if (menuColors[menuTitle]) return menuColors[menuTitle];
    const matchedKey = Object.keys(menuColors).find(key => menuTitle.startsWith(key));
    if (matchedKey) return menuColors[matchedKey];
    return '#6B7280';
}

// Track active menu item for styling
const activeMenu = ref('')

const setActiveLink = (menuTitle, linkText) => {
    activeMenu.value = `${menuTitle}-${linkText}`
}

function toggleAccordion(name) {
    if (openSection.value === name) {
        openSection.value = ''
        openGroup.value = ''
    } else {
        openSection.value = name
    }
}

function toggleGroup(key) {
    if (openGroup.value === key) {
        openGroup.value = ''
    } else {
        openGroup.value = key
    }
}

// Updated Sidebar Menu Configuration - Admin Dashboard
const menus = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: 'ri-dashboard-line',
        links: [
            { to: '/admin/dashboard', icon: 'ri-dashboard-2-line', text: 'Dashboard' }
        ]
    },
    {
        id: 'admin-management',
        title: 'Admin Management',
        icon: 'ri-admin-line',
        links: [
            { to: '/admin/admins', icon: 'ri-user-settings-line', text: 'Admin List' },
            { to: '/admin/admins/create', icon: 'ri-user-add-line', text: 'Create Admin' }
        ]
    },
    {
        id: 'tenant-management',
        title: 'Service Provider Management',
        icon: 'ri-building-line',
        links: [
            { to: '/admin/tenants/create', icon: 'ri-user-add-line', text: 'Create Service Provider' },
            { to: '/admin/tenants', icon: 'ri-building-4-line', text: 'Service Provider List' },
            { to: '/admin/tenant-subscriptions-settings', icon: 'ri-settings-4-line', text: 'Subscription Settings' },
        ]
    },
    {
        id: 'subscription-management',
        title: 'Subscription Management',
        icon: 'ri-money-dollar-circle-line',
        groups: [
            {
                key: 'subscription-plans',
                title: 'Subscription Plans',
                icon: 'ri-list-settings-line',
                links: [
                    { to: '/admin/subscription/plans', icon: 'ri-list-check', text: 'Plan List' },
                    { to: '/admin/subscription/plans/create', icon: 'ri-add-circle-line', text: 'Create Plan' }
                ]
            },
            {
                key: 'tenant-subscriptions',
                title: 'Tenant Subscriptions',
                icon: 'ri-user-community-line',
                links: [
                    { to: '/admin/subscription/tenants', icon: 'ri-list-check', text: 'Subscription List' },
                    { to: '/admin/subscription/tenants/create', icon: 'ri-add-circle-line', text: 'Create Subscription' }
                ]
            },
            {
                key: 'billing-config',
                title: 'Billing Configuration',
                icon: 'ri-settings-4-line',
                links: [
                    { to: '/admin/subscription/billing-config', icon: 'ri-settings-3-line', text: 'Configure Billing' }
                ]
            }
        ]
    },
    {
        id: 'billing-management',
        title: 'Billing Management',
        icon: 'ri-receipt-line',
        groups: [
            {
                key: 'invoices',
                title: 'Invoices',
                icon: 'ri-file-text-line',
                links: [
                    { to: '/admin/subscription/invoices', icon: 'ri-file-list-3-line', text: 'All Invoices' }
                ]
            },
            {
                key: 'revenue',
                title: 'Revenue',
                icon: 'ri-line-chart-line',
                links: [
                    { to: '/admin/subscription/dashboard', icon: 'ri-bar-chart-2-line', text: 'Revenue Statistics' }
                ]
            }
        ]
    }
]
</script>

<style scoped>
/* Keep your existing styles */
.router-link-active {
    background-color: #f0f9ff;
    border-left: 3px solid #0ea5e9 !important;
    border-radius: 0.375rem;
    padding: 0.5rem;
    transition: background-color 0.3s, color 0.3s;
}

.accordion-group:hover .menu-header {
    transform: translateX(2px);
}

.accordion-group {
    transition: all 0.2s ease-in-out;
}

.ml-4 {
    max-height: 300px;
    overflow-y: auto;
}

.ml-4::-webkit-scrollbar {
    width: 4px;
}

.ml-4::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.ml-4::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.ml-4::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.overflow-y-auto {
    overflow-y: auto;
    flex: 1;
}

.ml-6 {
    margin-left: 1.5rem;
}

.ml-6 .router-link {
    font-size: 0.8rem;
    padding-left: 0.5rem;
}

.ml-6 .router-link i {
    font-size: 0.75rem;
}

.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.w-80 {
    width: 20rem;
}

@media (max-width: 768px) {
    .w-80 {
        width: 100%;
        max-width: 280px;
    }
}
</style>