import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/common/Home.vue'
import AboutUs from '../views/common/AboutUs.vue'
import Login from '../views/common/Login.vue'



const routes = [

  // Common
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About Us',
    component: AboutUs,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },


  // Provider
  {
    path: '/provider',
    component: () => import('../views/provider/layout/ProviderLayout.vue'),
    children: [
      {
        path: '/provider/dashboard',
        name: 'provider-dashboard',
        component: () => import('../views/provider/dashboard.vue')
      },

    ]
  },




  // Customer
    {
    path: '/customer',
    component: () => import('../views/customer/layout/CustomerLayout.vue'),
    children: [
      {
        path: '',
        name: 'customer-dashboard',
        component: () => import('../views/customer/dashboard.vue')
      },

    ]
  },


]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router