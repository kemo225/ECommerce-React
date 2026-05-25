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

export const tripService = {
  getTrips: async (pageNumber, pageSize, filters = {}) => {
    const apiParams = {
      PageNumber: pageNumber || 1,
      PageSize: pageSize || 10,
      ...filters,
    };
    const response = await apiClient.get('/api/Trips', { params: apiParams });
    return normalizeTripsResponse(response.data);
  },

  getTripById: async (id) => {
    const response = await apiClient.get(`/api/Trips/${id}`);
    return {
      ...response.data,
      data: normalizeTrip(response.data?.data)
    };
  },

  createTrip: async (data) => {
    const response = await apiClient.post('/api/Trips', data);
    return {
      ...response.data,
      data: normalizeTrip(response.data?.data)
    };
  },

  updateTrip: async (data) => {
    const response = await apiClient.put('/api/Trips', data);
    return {
      ...response.data,
      data: normalizeTrip(response.data?.data)
    };
  },

  deactivateTrip: async (id) => {
    const response = await apiClient.delete(`/api/Trips/${id}/deactivate`);
    return response.data;
  },

  uploadTripImages: async (id, files) => {
    const formData = new FormData();
    // Convert single file or array of files to standard file append with 'Images' parameter name
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append('Images', file));
    } else if (files instanceof FileList) {
      Array.from(files).forEach((file) => formData.append('Images', file));
    } else {
      formData.append('Images', files);
    }

    const response = await apiClient.post(`/api/Trips/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteTripImage: async (id, imageId) => {
    const response = await apiClient.delete(`/api/Trips/${id}/image/${imageId}`);
    return response.data;
  },

  setPrimaryTripImage: async (id, imageId) => {
    const response = await apiClient.put(`/api/Trips/${id}/image/${imageId}/set-primary`);
    return response.data;
  },
};
