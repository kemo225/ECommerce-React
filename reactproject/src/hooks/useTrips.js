import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { tripService } from '../services/trip.service';
import toast from 'react-hot-toast';

// -- Queries -- //

export const useTrips = (pageNumber, pageSize, filters = {}) => {
  return useQuery({
    queryKey: ['trips', pageNumber, pageSize, filters],
    queryFn: () => tripService.getTrips(pageNumber, pageSize, filters),
    placeholderData: keepPreviousData,
  });
};

export const useTrip = (id) => {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.getTripById(id),
    enabled: !!id,
  });
};

// -- Mutations -- //

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tripService.createTrip(data),
    onSuccess: () => {
      toast.success('Trip created successfully');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create trip');
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tripService.updateTrip(data),
    onSuccess: (_, data) => {
      toast.success('Trip updated successfully');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', data.id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update trip');
    },
  });
};

export const useDeactivateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => tripService.deactivateTrip(id),
    onSuccess: () => {
      toast.success('Trip status updated');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to change trip status');
    },
  });
};
export const useReactivateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => tripService.reactivateTrip(id),
    onSuccess: () => {
      toast.success('Trip status updated');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to change trip status');
    },
  });
};

// -- Image Management Mutations -- //

export const useUploadTripImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }) => tripService.uploadTripImages(id, files),
    onSuccess: (_, { id }) => {
      toast.success('Images uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to upload images');
    },
  });
};

export const useDeleteTripImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageId }) => tripService.deleteTripImage(id, imageId),
    onSuccess: (_, { id }) => {
      toast.success('Image deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete image');
    },
  });
};

export const useSetPrimaryTripImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageId }) => tripService.setPrimaryTripImage(id, imageId),
    onSuccess: (_, { id }) => {
      toast.success('Primary image set successfully');
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to set primary image');
    },
  });
};
