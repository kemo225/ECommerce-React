import apiClient from '../api/axios';

const BASE = '/api/Trips';

const buildParams = (pageNumber, pageSize, extra = {}) => ({ pageNumber, pageSize, ...extra });

const tripService = {
  getTrips: async (pageNumber = 1, pageSize = 10, filters = {}) => {
    const params = buildParams(pageNumber, pageSize, filters);
    const { data } = await apiClient.get(BASE, { params });
    return data;
  },

  getTripById: async (id) => {
    const { data } = await apiClient.get(`${BASE}/${id}`);
    return data;
  },

  createTrip: async (payload) => {
    const { data } = await apiClient.post(BASE, payload);
    return data;
  },

  // API expects full payload (including id if needed) on PUT /api/Trips
  updateTrip: async (payload) => {
    const { data } = await apiClient.put(BASE, payload);
    return data;
  },

  deactivateTrip: async (id) => {
    const { data } = await apiClient.delete(`${BASE}/${id}/deactivate`);
    return data;
  },

  // Image endpoints
  uploadTripImages: async (id, files = []) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('Images', file));
    const { data } = await apiClient.post(`${BASE}/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteTripImage: async (id, imageId) => {
    const { data } = await apiClient.delete(`${BASE}/${id}/image/${imageId}`);
    return data;
  },

  setPrimaryTripImage: async (id, imageId) => {
    const { data } = await apiClient.put(`${BASE}/${id}/image/${imageId}/set-primary`);
    return data;
  },
};

export default tripService;
