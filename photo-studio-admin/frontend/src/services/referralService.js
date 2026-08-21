import api from './api';

const referralService = {
  list: () => api.get('/referrals'),
  getUsage: (id) => api.get(`/referrals/${id}/usage`),
  redeem: (id, bookingId, points) => api.post(`/referrals/${id}/redeem`, { bookingId, points }),
};

export default referralService;
