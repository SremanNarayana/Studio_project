import api from './api';

const dashboardService = {
  getSummary: (period) => {
    if (period !== 'thisMonth') return api.get('/dashboard');

    const now = new Date();
    const dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
    return api.get('/dashboard', { params: { dateFrom, dateTo } });
  },
};

export default dashboardService;
