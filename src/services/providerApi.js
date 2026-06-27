import api from './api.js'

const unwrap = (response) => response.data?.data ?? response.data

export const providerApi = {
  getWaterQualityReadings: (params) =>
    api().post('chemical-management/readings', params).then(unwrap),

  getChemicalUsage: (params) =>
    api().get('chemical-management/chemicals-added', { params }).then(unwrap),

  getChemicalUsageSummary: (params) =>
    api().get('chemical-management/chemicals-added/summary', { params }).then(unwrap),

  getAlerts: (params) =>
    api().get('chemical-management/alerts', { params }).then((response) => ({
      alerts: response.data?.data ?? [],
      summary: response.data?.alert_summary ?? { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
    })),

  calculateDose: (payload) =>
    api().post('chemical-management/calculate-dose', payload).then(unwrap),

  getWarehouseInventory: (params) =>
    api().get('inventory/warehouse', { params }).then(unwrap),

  createWarehouseInventory: (payload) =>
    api().post('inventory/warehouse', payload).then(unwrap),

  getTruckStock: (params) =>
    api().get('inventory/truck-stock', { params }).then(unwrap),

  updateTruckStock: (stockId, payload) =>
    api().patch(`inventory/truck-stock/${stockId}`, payload).then(unwrap),

  getPurchaseOrders: (params) =>
    api().get('inventory/purchase-orders', { params }).then(unwrap),

  createPurchaseOrder: (payload) =>
    api().post('inventory/purchase-orders', payload).then(unwrap),

  getSuppliers: () =>
    api().get('inventory/suppliers').then(unwrap),

  createSupplier: (payload) =>
    api().post('inventory/suppliers', payload).then(unwrap),

  getLowStockAlerts: () =>
    api().get('inventory/low-stock').then((response) => response.data?.alerts ?? response.data),
}
