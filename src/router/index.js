import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/common/Home.vue'
import AboutUs from '../views/common/AboutUs.vue'
import Login from '../views/common/Login.vue'
import AdminLogin from '../views/common/adminLogin.vue'
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
    path: '/adminLogin',
    name: 'AdminLogin',
    component: AdminLogin,
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
        path: '/provider/customers/:id',
        name: 'provider-allcustomers',
        component: () => import('../views/provider/pages/customer/AllCustomers/[id].vue')
      },
      {
        path: '/provider/customer-create',
        name: 'provider-customer-create',
        component: () => import('../views/provider/pages/customer/CreateCustomer.vue')
      },
      {
        path: '/provider/customer-details/:id',
        name: 'provider-customer-details',
        component: () => import('../views/provider/pages/customer/AllCustomers/CustomerDetails.vue')
      },
        {
        path: '/provider/prospective-customer-details/:id',
        name: 'provider-prospective-customer-details',
        component: () => import('../views/provider/pages/customer/AllCustomers/ProspectiveCustomerDetails.vue')
      },
      // Customer Service
      {
        path: '/provider/customer-service-agreements',
        name: 'provider-customers-service-agreements',
        component: () => import('../views/provider/pages/customer/ServiceAgreements/AgreementsList.vue')
      },
      {
        path: '/provider/customer-service-agreements-create',
        name: 'provider-service-agreements-create',
        component: () => import('../views/provider/pages/customer/ServiceAgreements/AgreementCreate.vue')
      },
       {
        path: '/provider/customer-service-terms-and-conditions',
        name: 'provider-service-terms-and-conditions',
        component: () => import('../views/provider/pages/customer/ServiceAgreements/TermsAndConditions/TermAndConditionsView.vue')
      },
       {
        path: '/provider/customer-service',
        name: 'provider-customer-service',
        component: () => import('../views/provider/pages/customer/ServiceAgreements/Service/Service.vue')
      },
       {
        path: '/provider/customer-add-serivice-customer',
        name: 'provider-service-add-serivice-customer',
        component: () => import('../views/provider/pages/customer/ServiceAgreements/AddService/AddServiceCustomers.vue')
      },
      {
        path: '/provider/customer-add-serivice/:id',
        name: 'provider-service-add-serivice',
        component: () => import('../views/provider/pages/customer/ServiceAgreements/AddService/AddService.vue')
      },

       {
        path: '/provider/customer-add-terms-customer',
        name: 'provider-service-add-terms-customer',
        component: () => import('../views/provider/pages/customer/ServiceAgreements/AddTermsAndConditions/AddTermsAndConditionsCustomers.vue')
      },
      {
        path: '/provider/customer-add-terms/:id',
        name: 'provider-service-add-terms',
        component: () => import('../views/provider/pages/customer/ServiceAgreements/AddTermsAndConditions/AddTermsAndConditions.vue')
      },
    
      // Customer Maintenance
 {
        path: '/provider/customer-maintenance-agreements',
        name: 'provider-maintenance-customers-agreements',
        component: () => import('../views/provider/pages/customer/MaintenanceAgreements/AgreementList.vue')
      },
      {
        path: '/provider/customer-maintenance-agreements-create',
        name: 'provider-maintenance-agreements-create',
        component: () => import('../views/provider/pages/customer/MaintenanceAgreements/AgreementCreate.vue')
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
        component: () => import('../views/provider/pages/pool/EquimentManagement/RegisterEquipments/RegisterEquipmentPools.vue')
      },
       {
        path: '/provider/pools-equipment-register/:id',
        name: 'provider-pools-equipment-register',
        component: () => import('../views/provider/pages/pool/EquimentManagement/RegisterEquipments/RegisterEquipmentToPool.vue')
      },
       {
        path: '/provider/equipment-manufacturer',
        name: 'provider-pools-equipment-manufacturer',
        component: () => import('../views/provider/pages/pool/EquimentManagement/EquipmentManufacturer.vue')
      },
       {
        path: '/provider/equipment-model',
        name: 'provider-pools-equipment-model',
        component: () => import('../views/provider/pages/pool/EquimentManagement/EquipmentModel.vue')
      },
       {
        path: '/provider/equipment-component',
        name: 'provider-pools-equipment-component',
        component: () => import('../views/provider/pages/pool/EquimentManagement/EquipmentComponent.vue')
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
        component: () => import('../views/provider/pages/service/Schedule/CalenderView.vue')
      },
      {
        path: '/provider/services-list',
        name: 'provider-services-list',
        component: () => import('../views/provider/pages/service/Schedule/ListView.vue')
      },
      {
        path: '/provider/services-perform-service-by-pool',
        name: 'provider-services-perform-service-by-pool',
        component: () => import('../views/provider/pages/service/PerformService/PerformServicebyPool.vue')
      },
      {
        path: '/provider/services-perform-service-today',
        name: 'provider-services-perform-service-today',
        component: () => import('../views/provider/pages/service/PerformService/PerformServiceToday.vue')
      },

      {
        path: '/provider/services-perform-service/:id',
        name: 'provider-services-perform-service',
        component: () => import('../views/provider/pages/service/PerformService/PerformService.vue')
      },
      {
        path: '/provider/services-perform-service-by-pool-schedules/:id',
        name: 'services-perform-service-by-pool-Schedules',
        component: () => import('../views/provider/pages/service/PerformService/PerformServicebyPoolSchedules.vue')
      },


      // Maintenance
      {
        path: '/provider/schedule-maintenance',
        name: 'provider-schedule-maintenance',
        component: () => import('../views/provider/pages/maintenance/CreateMaintenance.vue')
      },
      {
        path: '/provider/maintenance/:status',
        name: 'provider-view-maintenance',
        component: () => import('../views/provider/pages/maintenance/MaintenanceList/[status].vue')
      },

       {
        path: '/provider/maintenance-calendar',
        name: 'provider-maintenance-calendar',
        component: () => import('../views/provider/pages/maintenance/MaintenanceSchedule/CalenderView.vue')
      },
      {
        path: '/provider/maintenance-list',
        name: 'provider-maintenance-list',
        component: () => import('../views/provider/pages/maintenance/MaintenanceSchedule/ListView.vue')
      },


      // Technician
      {
        path: '/provider/technicians/new',
        name: 'provider-technicians-add',
        component: () => import('../views/provider/pages/technician/AddTechnician.vue')
      },
      {
        path: '/provider/technicians',
        name: 'provider-technicians-list',
        component: () => import('../views/provider/pages/technician/Users.vue')
      },

      // Water Quality Monitoring
      {
        path: '/provider/water-quality/readings',
        name: 'provider-water-quality-readings',
        component: () => import('../views/provider/pages/water-quality/Readings.vue')
      },
      {
        path: '/provider/water-quality/chemicals',
        name: 'provider-water-quality-chemicals',
        component: () => import('../views/provider/pages/water-quality/Chemicals.vue')
      },
      {
        path: '/provider/water-quality/alerts',
        name: 'provider-water-quality-alerts',
        component: () => import('../views/provider/pages/water-quality/Alerts.vue')
      },
      {
        path: '/provider/water-quality/dosing',
        name: 'provider-water-quality-dosing',
        component: () => import('../views/provider/pages/water-quality/Dosing.vue')
      },
      {
        path: '/provider/inventory/warehouse',
        name: 'provider-inventory-warehouse',
        component: () => import('../views/provider/pages/inventory/Warehouse.vue')
      },
      {
        path: '/provider/inventory/truck-stock',
        name: 'provider-inventory-truck-stock',
        component: () => import('../views/provider/pages/inventory/TruckStock.vue')
      },
      {
        path: '/provider/inventory/purchase-orders',
        name: 'provider-inventory-purchase-orders',
        component: () => import('../views/provider/pages/inventory/PurchaseOrders.vue')
      },
      {
        path: '/provider/inventory/suppliers',
        name: 'provider-inventory-suppliers',
        component: () => import('../views/provider/pages/inventory/Suppliers.vue')
      },
      {
        path: '/provider/inventory/low-stock',
        name: 'provider-inventory-low-stock',
        component: () => import('../views/provider/pages/inventory/LowStock.vue')
      },

      // Billing
      {
        path: '/provider/billing/invoices',
        name: 'provider-billing-invoices',
        component: () => import('../views/provider/pages/billing/InvoiceList.vue')
      },
      {
        path: '/provider/billing/invoices/create',
        name: 'provider-billing-invoice-create',
        component: () => import('../views/provider/pages/billing/InvoiceCreate.vue')
      },
      {
        path: '/provider/billing/payments',
        name: 'provider-billing-payments',
        component: () => import('../views/provider/pages/billing/PaymentsList.vue')
      },
      {
        path: '/provider/billing/payment-methods',
        name: 'provider-billing-payment-methods',
        component: () => import('../views/provider/pages/billing/PaymentMethods.vue')
      },

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
        path: '/customer/payments',
        name: 'customer-payments',
        component: () => import('../views/customer/pages/Payments.vue')
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
        path: '/customer/maintenance-agreements',
        name: 'customer-maintenance-agreements',
        component: () => import('../views/customer/pages/MaintenanceAgreements.vue')
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
      {
        path: '/customer/service-reports',
        name: 'customer-service-reports',
        component: () => import('../views/customer/pages/ServiceReports.vue')
      },
      {
        path: '/customer/service-reports/:id',
        name: 'customer-service-reports-details',
        component: () => import('../views/customer/pages/ReportDetails.vue')
      },
    ]
  },

  // Technician
  {
    path: '/technician',
    component: () => import('../views/technician/layout/TechnicianLayout.vue'),
    children: [
      {
        path: '/technician/dashboard',
        name: 'technician-dashboard',
        component: () => import('../views/technician/pages/Dashboard/techDashboard.vue')
      },

       {
        path: '/technician/my-schedules',
        name: 'technician-my-schedules',
        component: () => import('../views/technician/pages/MySchedule/MySchedule.vue')
      },

        {
        path: '/technician/perform-service/:id',
        name: 'technician-perform-service',
        component: () => import('../views/technician/pages/MySchedule/PerformService.vue')
      },

    ]
  },

  // Admin
  {
    path: '/admin',
    component: () => import('../views/admin/layout/AdminLayout.vue'),
    children: [
      {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/pages/Dashboard/adminDashboard.vue')
      },
      // Admins
      { path: '/admin/admins', name: 'admin-admins', component: () => import('../views/admin/pages/admins/AdminList.vue') },
      { path: '/admin/admins/create', name: 'admin-admins-create', component: () => import('../views/admin/pages/admins/AdminForm.vue') },
      { path: '/admin/admins/:id/edit', name: 'admin-admins-edit', component: () => import('../views/admin/pages/admins/AdminForm.vue') },
      // Tenants
      { path: '/admin/tenants', name: 'admin-tenants', component: () => import('../views/admin/pages/tenants/TenantList.vue') },
      { path: '/admin/tenants/create', name: 'admin-tenants-create', component: () => import('../views/admin/pages/tenants/TenantForm.vue') },
      { path: '/admin/tenants/domains/add', name: 'admin-tenants-domain-add', component: () => import('../views/admin/pages/tenants/AddDomain.vue') },
      { path: '/admin/tenants/domains/verify', name: 'admin-tenants-domain-verify', component: () => import('../views/admin/pages/tenants/VerifyDomain.vue') },
      { path: '/admin/tenants/:id/edit', name: 'admin-tenants-edit', component: () => import('../views/admin/pages/tenants/TenantForm.vue') },
      { path: '/admin/tenants/:id', name: 'admin-tenants-details', component: () => import('../views/admin/pages/tenants/TenantDetails.vue') },
      // Subscription plans
      { path: '/admin/subscription-plans', name: 'admin-subscription-plans', component: () => import('../views/admin/pages/subscriptions/PlanList.vue') },
      { path: '/admin/subscription-plans/create', name: 'admin-subscription-plans-create', component: () => import('../views/admin/pages/subscriptions/PlanForm.vue') },
      { path: '/admin/subscription-plans/:id/edit', name: 'admin-subscription-plans-edit', component: () => import('../views/admin/pages/subscriptions/PlanForm.vue') },
      // Tenant subscriptions
      { path: '/admin/tenant-subscriptions', name: 'admin-tenant-subscriptions', component: () => import('../views/admin/pages/subscriptions/SubscriptionList.vue') },
      { path: '/admin/tenant-subscriptions/create', name: 'admin-tenant-subscriptions-create', component: () => import('../views/admin/pages/subscriptions/SubscriptionForm.vue') },
      { path: '/admin/tenant-subscriptions/:id/edit', name: 'admin-tenant-subscriptions-edit', component: () => import('../views/admin/pages/subscriptions/SubscriptionForm.vue') },
    ]
  },

//provider website
    {
    path: '/provider-website',
    component: () => import('../views/provider-website/layout/provider-websiteLayout.vue'),
    children: [
  // Common
  {
    path: '',
    name: 'provider-website-home',
    component: () => import('../views/provider-website/common/Home/index.vue'),
  },
  {
    path: '/provider-website/about',
    name: 'Provider Website About',
    component: () => import('../views/provider-website/common/AboutUs.vue'),
  },
  {
    path: '/provider-website/features',
    name: 'Provider Website Features',
    component: () => import('../views/provider-website/common/Features.vue'),
  },
  {
    path: '/provider-website/blogs',
    name: 'Provider Website Blogs',
    component: () => import('../views/provider-website/common/Blogs.vue'),
  },
  {
    path: '/provider-website/join-us',
    name: 'Provider Website Join Us',
    component: () => import('../views/provider-website/common/JoinUs.vue'),
  },
  {
    path: '/provider-website/login',
    name: 'Provider Website login',
    component: () => import('../views/provider-website/common/csLogin.vue'),
  },
{
    path: '/provider-website/quote',
    name: 'Provider Website Quote Page',
    component: () => import('../views/provider-website/common/quote.vue'),
  },
    ]
  },



]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router