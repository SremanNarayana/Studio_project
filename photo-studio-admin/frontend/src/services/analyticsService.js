import api from './api';

const analyticsService = {
  get: (months = 12) => api.get('/analytics', { params: { months } }),
};

export default analyticsService;
