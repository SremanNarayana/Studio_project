import api from './api';

const analyticsService = {
  get: (months = 12, period = 'all') => {
    if (period !== 'month') return api.get('/analytics', { params: { months } });

    const now = new Date();
    const dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
    const monthLabel = now.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    return api.get('/analytics', { params: { months: 1, dateFrom, dateTo, monthLabel } });
  },
};

export default analyticsService;
