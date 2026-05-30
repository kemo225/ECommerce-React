import apiClient from '../api/axios';

export const tripsService = {
  getAll: async (params) => {
    // Dynamic filters & query parameters matching the sunnytrip API
    const response = await apiClient.get('/api/Trips', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/Trips/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await apiClient.post('/api/Trips', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await apiClient.put(`/api/Trips/${id}`, payload);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await apiClient.delete(`/api/Trips/${id}/deactivate`);
    return response.data;
  },

  reactivate: async (id) => {
    const response = await apiClient.put(`/api/Trips/${id}/reactivate`);
    return response.data;
  },

  uploadImage: async (id, formData) => {
    const response = await apiClient.post(`/api/Trips/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (id, imageId) => {
    const response = await apiClient.delete(`/api/Trips/${id}/image/${imageId}`);
    return response.data;
  },

  setPrimaryImage: async (id, imageId) => {
    const response = await apiClient.put(`/api/Trips/${id}/image/${imageId}/set-primary`);
    return response.data;
  },
};
