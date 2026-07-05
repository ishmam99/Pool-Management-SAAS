<template>
  <div>
    <div
      class="h-[80px]  w-full flex justify-between bg-[url('/src/assets/images/bg.webp')] bg-cover bg-no-repeat items-center text-black fixed top-0 z-40 duration-300">
      <div
        class="flex items-center justify-between w-full gap-8 px-10 h-[80px]  bg-gradient-to-r from-sky-600/50 to-purple-500/50   text-sm  font-semibold">
        <div class="flex justify-between w-full items-center">
          <div class="flex rounded-lg p-2  gap-2">


            <img src="/src/assets/logo.png" alt="Logo" class="w-16  m-auto" />
            <div class="space-y-[-10px]">
              <p class="text-white font-bold text-nowrap w-32 shadow-lg text-3xl">Pool Management</p>
              <p class="text-red-700 font-bold text-nowrap w-32 shadow-lg text-3xl">SAAS</p>
            </div>
          </div>
          <div class="flex items-center justify-center w-full gap-4">
            <h1 class="text-2xl uppercase font-bold text-white px-2 mx-10 rounded-r-lg  bg-sky-700 drop-shadow-md">
              Pool Service Provider Dashboard
            </h1>
           
          </div>
        </div>
      <div class="hover:bg-red-600 bg-white  text-red-600 hover:text-white px-4 py-3 cursor-pointer rounded-lg"
          @click="router.push('/login/adminLogin'), authStore.logout()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path
              d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z">
            </path>
          </svg>
      </div>
      </div>
    </div>
    <div class="flex">
     
      <transition enter-active-class="transition-all duration-500 ease-in-out"
        enter-from-class="opacity-0 translate-x-10" enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-500 ease-in-out" leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-10">
         <!-- <span v-if="authStore.layout === 'general'"><CustomerSidebar  /></span> -->
         <span ><Sidebar  class="w-[360px] h-full" /></span>   
      </transition>
      <RouterView class="w-full" :activeTab="activeTab" @set-tab="(tab) => setTab(tab)" />
      <!-- </transition> -->
    </div>
  </div>
</template>
<script setup>
// import HrSidebar from '/src/views/Hr/HrSidebar.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import { useProviderStore } from '../store/providerStore.js'
import { useAuthStore } from '../../../store/AuthStore.js'
const store = useProviderStore()
const authStore = useAuthStore()
const tabs = [
    'Dashboard',
    'Pools',
    'Customers',
    'Maintenance',
    'Services',
    'Reports',
    'Invoices'
]
const activeTab = ref(store.currentMenu || 'All')
const router = useRouter()
const sideBarActive = ref(true)


const dropdownOpen = ref(false)


const myTeams = ref([])




const changeTab = (tab) => {
  console.log('here and there', tab)
  activeTab.value = tab
}
const setTab = (tab) => {
  console.log('here and there', tab)
  activeTab.value = tab
}
</script>
