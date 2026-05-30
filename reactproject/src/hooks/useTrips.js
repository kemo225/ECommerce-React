import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { tripsService } from '../services/trips.service';
import toast from 'react-hot-toast';

// -- Queries -- //

export const useTrips = (params) => {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: () => tripsService.getAll(params),
    placeholderData: keepPreviousData,
  });
};

export const useTrip = (id) => {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripsService.getById(id),
    enabled: !!id,
  });
};

// -- Mutations -- //

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripsService.create,
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
    mutationFn: ({ id, data }) => tripsService.update(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Trip updated successfully');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update trip');
    },
  });
};

export const useDeactivateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripsService.deactivate,
    onSuccess: () => {
      toast.success('Trip deactivated successfully');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to deactivate trip');
    },
  });
};

export const useReactivateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripsService.reactivate,
    onSuccess: () => {
      toast.success('Trip reactivated successfully');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to reactivate trip');
    },
  });
};

// -- Image Mutations -- //

export const useUploadTripImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => tripsService.uploadImage(id, formData),
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
    mutationFn: ({ id, imageId }) => tripsService.deleteImage(id, imageId),
    onSuccess: (_, { id }) => {
      toast.success('Image deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete image');
    },
  });
};

export const useSetPrimaryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageId }) => tripsService.setPrimaryImage(id, imageId),
    onSuccess: (_, { id }) => {
      toast.success('Primary image updated');
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to set primary image');
    },
  });
};
