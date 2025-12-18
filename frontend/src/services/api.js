import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const factoryAPI = {
  getFabrikat: () => api.get('/factory/fabrikat'),
  getFabrika: (id) => api.get(`/factory/fabrikat/${id}`),
  createFabrika: (data) => api.post('/factory/fabrikat', data),
  updateFabrika: (id, data) => api.put(`/factory/fabrikat/${id}`, data),
  deleteFabrika: (id) => api.delete(`/factory/fabrikat/${id}`),
  
  getProduktet: () => api.get('/factory/produktet'),
  getProdukt: (id) => api.get(`/factory/produktet/${id}`),
  getProduktetByFabrika: (fabrikaId) => api.get(`/factory/produktet/fabrika/${fabrikaId}`),
  createProdukt: (data) => api.post('/factory/produktet', data),
  updateProdukt: (id, data) => api.put(`/factory/produktet/${id}`, data),
  deleteProdukt: (id) => api.delete(`/factory/produktet/${id}`),
  
  getPunetoret: () => api.get('/factory/punetoret'),
  getPunetori: (id) => api.get(`/factory/punetoret/${id}`),
  getPunetoretByFabrika: (fabrikaId) => api.get(`/factory/punetoret/fabrika/${fabrikaId}`),
  createPunetori: (data) => api.post('/factory/punetoret', data),
  updatePunetori: (id, data) => api.put(`/factory/punetoret/${id}`, data),
  deletePunetori: (id) => api.delete(`/factory/punetoret/${id}`),
};


export const orderAPI = {
  getKlientet: () => api.get('/order/klientet'),
  getKlienti: (id) => api.get(`/order/klientet/${id}`),
  createKlienti: (data) => api.post('/order/klientet', data),
  updateKlienti: (id, data) => api.put(`/order/klientet/${id}`, data),
  deleteKlienti: (id) => api.delete(`/order/klientet/${id}`),
  
  getPorosite: () => api.get('/order/porosite'),
  getPorosia: (id) => api.get(`/order/porosite/${id}`),
  getPorositeByKlienti: (klientiId) => api.get(`/order/porosite/klienti/${klientiId}`),
  createPorosia: (data) => api.post('/order/porosite', data),
  updatePorosia: (id, data) => api.put(`/order/porosite/${id}`, data),
  deletePorosia: (id) => api.delete(`/order/porosite/${id}`),
};


export const inventoryAPI = {
  getStoku: () => api.get('/inventory/stoku'),
  getStokuItem: (id) => api.get(`/inventory/stoku/${id}`),
  getStokuByProdukt: (produktId) => api.get(`/inventory/stoku/produkt/${produktId}`),
  getLowStock: () => api.get('/inventory/stoku/low-stock'),
  createStoku: (data) => api.post('/inventory/stoku', data),
  updateStoku: (id, data) => api.put(`/inventory/stoku/${id}`, data),
  updateQuantity: (id, sasia) => api.patch(`/inventory/stoku/${id}/update-quantity`, { sasia }),
  deleteStoku: (id) => api.delete(`/inventory/stoku/${id}`),
};


export const financialAPI = {
  getPagesat: () => api.get('/financial/pagesat'),
  getPagesa: (id) => api.get(`/financial/pagesat/${id}`),
  getPagesaByPorosia: (porosiaId) => api.get(`/financial/pagesat/porosia/${porosiaId}`),
  createPagesa: (data) => api.post('/financial/pagesat', data),
  updatePagesa: (id, data) => api.put(`/financial/pagesat/${id}`, data),
  deletePagesa: (id) => api.delete(`/financial/pagesat/${id}`),
  
  getFaturat: () => api.get('/financial/faturat'),
  getFatura: (id) => api.get(`/financial/faturat/${id}`),
  getFaturaByPorosia: (porosiaId) => api.get(`/financial/faturat/porosia/${porosiaId}`),
  createFatura: (data) => api.post('/financial/faturat', data),
  updateFatura: (id, data) => api.put(`/financial/faturat/${id}`, data),
  deleteFatura: (id) => api.delete(`/financial/faturat/${id}`),
};


export const deliveryAPI = {
  getDergesat: () => api.get('/delivery/dergesat'),
  getDergesa: (id) => api.get(`/delivery/dergesat/${id}`),
  getDergesaByPorosia: (porosiaId) => api.get(`/delivery/dergesat/porosia/${porosiaId}`),
  getDergesatByStatus: (statusi) => api.get(`/delivery/dergesat/status/${statusi}`),
  createDergesa: (data) => api.post('/delivery/dergesat', data),
  updateDergesa: (id, data) => api.put(`/delivery/dergesat/${id}`, data),
  updateStatus: (id, statusi) => api.patch(`/delivery/dergesat/${id}/update-status`, { statusi }),
  deleteDergesa: (id) => api.delete(`/delivery/dergesat/${id}`),
};


export const reportAPI = {
  getRaportet: () => api.get('/report/raportet'),
  getRaporti: (id) => api.get(`/report/raportet/${id}`),
  generateSalesReport: (data) => api.post('/report/raportet/sales', data),
  generateInventoryReport: () => api.post('/report/raportet/inventory'),
  generateDeliveryReport: () => api.post('/report/raportet/delivery'),
  generateComprehensiveReport: (data) => api.post('/report/raportet/comprehensive', data),
  deleteRaporti: (id) => api.delete(`/report/raportet/${id}`),
};

export default api;

