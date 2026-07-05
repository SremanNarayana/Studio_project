import api from './api';

const settingsService = {
  getSms: () => api.get('/settings/sms'),
  updateSms: (payload) => api.put('/settings/sms', payload),
};

export default settingsService;
