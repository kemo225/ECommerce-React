import apiClient from '../api/axios';

const normalizeTrip = (trip) => {
  if (!trip) return null;
  const primaryImgObj = trip.images?.find(img => img.isPrimary) || trip.images?.[0];
  const duration = trip.durationValue ? `${trip.durationValue} ${trip.durationTypeName || ''}`.trim() : 'Flexible';
  return {
    ...trip,
    title: trip.name || '',
    price: trip.adultPrice || 0,
    duration: duration,
    isInactive: !trip.isActive,
    image: primaryImgObj?.imageUrl || '',
    gallery: trip.images?.map(img => img.imageUrl) || [],
  };
};

const normalizeTripsResponse = (response) => {
  if (!response) return response;
  const result = { ...response };
  if (Array.isArray(result.data)) {
    result.data = result.data.map(normalizeTrip);
  } else if (result.data && Array.isArray(result.data.items)) {
    result.data = {
      ...result.data,
      items: result.data.items.map(normalizeTrip),
    };
  } else if (result.data) {
    result.data = normalizeTrip(result.data);
  }
  return result;
};

export const tripsService = {
  getAll: async (params) => {
    const apiParams = {};
    if (params) {
      if (params.page !== undefined) apiParams.PageNumber = params.page;
      if (params.PageNumber !== undefined) apiParams.PageNumber = params.PageNumber;
      
      if (params.pageSize !== undefined) apiParams.PageSize = params.pageSize;
      if (params.PageSize !== undefined) apiParams.PageSize = params.PageSize;

      if (params.minPrice !== undefined && params.minPrice !== '') apiParams.MinPrice = Number(params.minPrice);
      if (params.MinPrice !== undefined && params.MinPrice !== '') apiParams.MinPrice = Number(params.MinPrice);

      if (params.maxPrice !== undefined && params.maxPrice !== '') apiParams.MaxPrice = Number(params.maxPrice);
      if (params.MaxPrice !== undefined && params.MaxPrice !== '') apiParams.MaxPrice = Number(params.MaxPrice);

      if (params.typeId !== undefined && params.typeId !== '') apiParams.TypeId = Number(params.typeId);
      if (params.TypeId !== undefined && params.TypeId !== '') apiParams.TypeId = Number(params.TypeId);

      if (params.search !== undefined && params.search !== '') apiParams.SearchItem = params.search;
      if (params.SearchItem !== undefined && params.SearchItem !== '') apiParams.SearchItem = params.SearchItem;

      if (params.destination !== undefined && params.destination !== '') apiParams.Destination = params.destination;
      if (params.Destination !== undefined && params.Destination !== '') apiParams.Destination = params.Destination;

      if (params.includeInactive !== undefined) apiParams.includeInactive = params.includeInactive;
    }
    
    const response = await apiClient.get('/api/Trips', { params: apiParams });
    return normalizeTripsResponse(response.data);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/Trips/${id}`);
    return {
      ...response.data,
      data: normalizeTrip(response.data?.data)
    };
  },

  create: async (payload) => {
    const response = await apiClient.post('/api/Trips', payload);
    return {
      ...response.data,
      data: normalizeTrip(response.data?.data)
    };
  },

  update: async (payload) => {
    const response = await apiClient.put('/api/Trips', payload);
    return {
      ...response.data,
      data: normalizeTrip(response.data?.data)
    };
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

