import api from './api';

export default {
  list: () => api.get('/gallery'),
  upload: (payload) => api.post('/gallery', payload),
  remove: (id) => api.delete(`/gallery/${id}`),
};
