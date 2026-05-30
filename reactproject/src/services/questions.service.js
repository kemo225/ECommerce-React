import apiClient from '../api/axios';

export const questionsService = {
  getAll: async (pageNumber, pageSize) => {
    const params = {};
    if (pageNumber) params.pageNumber = pageNumber;
    if (pageSize) params.pageSize = pageSize;
    const response = await apiClient.get('/api/Questions', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/Questions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/api/Questions', data);
    return response.data;
  },

  update: async (data) => {
    const response = await apiClient.put('/api/Questions', data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/Questions/${id}`);
    return response.data;
  },
};
