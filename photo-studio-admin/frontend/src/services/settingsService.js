import api from './api';

const settingsService = {
  getWhatsApp: () => api.get('/settings/whatsapp'),
  updateWhatsApp: (payload) => api.put('/settings/whatsapp', payload),
};

export default settingsService;
