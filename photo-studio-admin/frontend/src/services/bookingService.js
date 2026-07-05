import api from './api';

const bookingService = {
  create: (payload) => api.post('/bookings', payload),

  list: (params = {}) => api.get('/bookings', { params }),

  search: (q) => api.get('/bookings/search', { params: { q } }),

  getById: (id) => api.get(`/bookings/${id}`),

  update: (id, payload) => api.put(`/bookings/${id}`, payload),

  remove: (id) => api.delete(`/bookings/${id}`),

  updateStage: (id, payload) => api.patch(`/bookings/${id}/stage`, payload),

  updateApproval: (id, approvalStatus) =>
    api.patch(`/bookings/${id}/approval`, { approvalStatus }),
};

export default bookingService;
