import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/common/Home.vue'
import AboutUs from '../views/common/AboutUs.vue'
import Login from '../views/common/Login.vue'
import Blogs from '../views/common/Blogs.vue'
import Features from '../views/common/Features.vue'
import JoinUs from '../views/common/JoinUs.vue'



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

  {
    path: '/features',
    name: 'Features',
    component: Features,
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs,
  },
  {
    path: '/join-us',
    name: 'Join Us',
    component: JoinUs,
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

      // Customer
      {
        path: '/provider/customers',
        name: 'provider-allcustomers',
        component: () => import('../views/provider/pages/customer/AllCustomers.vue')
      },
      {
        path: '/provider/customer-create',
        name: 'provider-customer-create',
        component: () => import('../views/provider/pages/customer/CreateCustomer.vue')
      },
      {
        path: '/provider/customers-agreements',
        name: 'provider-customers-agreements',
        component: () => import('../views/provider/pages/customer/Aggreements.vue')
      },
      {
        path: '/provider/agreements-create',
        name: 'provider-agreements-create',
        component: () => import('../views/provider/pages/customer/AggreementCreate.vue')
      },


      // Pool
      {
        path: '/provider/pools-create',
        name: 'provider-pools-create',
        component: () => import('../views/provider/pages/pool/PoolCeate.vue')
      },
      {
        path: '/provider/pools',
        name: 'provider-pools',
        component: () => import('../views/provider/pages/pool/AllPools.vue')
      },
      {
        path: '/provider/pools-types',
        name: 'provider-pools-types',
        component: () => import('../views/provider/pages/pool/PoolByType.vue')
      },
      {
        path: '/provider/pools-equipment',
        name: 'provider-pools-equipment',
        component: () => import('../views/provider/pages/pool/EquipmentRegister.vue')
      },
      {
        path: '/provider/pools-map',
        name: 'provider-pools-map',
        component: () => import('../views/provider/pages/pool/PoolMapView.vue')
      },

      // Service
      {
        path: '/provider/services-calendar',
        name: 'provider-services-calendar',
        component: () => import('../views/provider/pages/service/CalenderView.vue')
      },
      {
        path: '/provider/services-unassigned',
        name: 'provider-services-unassigned',
        component: () => import('../views/provider/pages/service/ListView.vue')
      },

      // Maintenance
      {
        path: '/provider/schedule-maintenance',
        name: 'provider-schedule-maintenance',
        component: () => import('../views/provider/pages/maintenance/ScheduleMaintenance.vue')
      },
      {
        path: '/provider/maintenance/create',
        name: 'provider-create-maintenance',
        component: () => import('../views/provider/pages/maintenance/CreateMaintenance.vue')
      },
      {
        path: '/provider/maintenance/:status',
        name: 'provider-view-maintenance',
        component: () => import('../views/provider/pages/maintenance/[status].vue')
      },
      //   {
      //   path: '/provider/',
      //   name: 'provider-',
      //   component: () => import('../views/provider/pages/maintenance/')
      // },
      //   {
      //   path: '/provider/',
      //   name: 'provider-',
      //   component: () => import('../views/provider/pages/maintenance/')
      // },
      //   {
      //   path: '/provider/',
      //   name: 'provider-',
      //   component: () => import('../views/provider/pages/maintenance/')
      // },
      //   {
      //   path: '/provider/',
      //   name: 'provider-',
      //   component: () => import('../views/provider/pages/maintenance/')
      // },
      //   {
      //   path: '/provider/',
      //   name: 'provider-',
      //   component: () => import('../views/provider/pages/maintenance/')
      // },



      // Maintainance



      // Technician


      // Water Quality Monitoring


      // Customer




    ]
  },




  // Customer
  {
    path: '/customer',
    component: () => import('../views/customer/layout/CustomerLayout.vue'),
    children: [
      {
        path: '/customer/dashboard',
        name: 'customer-dashboard',
        component: () => import('../views/customer/dashboard.vue')
      },
      {
        path: '/customer/schedule',
        name: 'customer-schedule',
        component: () => import('../views/customer/pages/Schedule.vue')
      },
      {
        path: '/customer/pools',
        name: 'customer-pools',
        component: () => import('../views/customer/pages/Pools.vue')
      },
      {
        path: '/customer/pools/:id/history',
        name: 'customer-pool-history',
        component: () => import('../views/customer/pages/PoolHistory.vue')
      },
      {
        path: '/customer/water-quality',
        redirect: '/customer/pools'
      },
      {
        path: '/customer/photos',
        name: 'customer-photos',
        component: () => import('../views/customer/pages/Photos.vue')
      },
      {
        path: '/customer/billing',
        name: 'customer-billing',
        component: () => import('../views/customer/pages/Billing.vue')
      },
      {
        path: '/customer/billing/:id',
        name: 'customer-invoice-detail',
        component: () => import('../views/customer/pages/InvoiceDetail.vue')
      },
      {
        path: '/customer/agreements',
        name: 'customer-agreements',
        component: () => import('../views/customer/pages/Agreements.vue')
      },
      {
        path: '/customer/messages',
        name: 'customer-messages',
        component: () => import('../views/customer/pages/Messages.vue')
      },
      {
        path: '/customer/profile',
        name: 'customer-profile',
        component: () => import('../views/customer/pages/Profile.vue')
      },
      {
        path: '/customer/payment-methods',
        name: 'customer-payment-methods',
        component: () => import('../views/customer/pages/PaymentMethods.vue')
      },
      {
        path: '/customer/help',
        name: 'customer-help',
        component: () => import('../views/customer/pages/Help.vue')
      },
    ]
  },


]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router