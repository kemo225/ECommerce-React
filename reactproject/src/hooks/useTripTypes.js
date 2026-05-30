import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripTypesService } from '../services/tripTypes.service';
import toast from 'react-hot-toast';

export const useTripTypes = (pageNumber, pageSize) => {
  return useQuery({
    queryKey: ['tripTypes', pageNumber, pageSize],
    queryFn: () => tripTypesService.getAll(pageNumber, pageSize),
  });
};

export const useTripType = (id) => {
  return useQuery({
    queryKey: ['tripType', id],
    queryFn: () => tripTypesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTripType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tripTypesService.create(data),
    onSuccess: () => {
      toast.success('Trip type created successfully');
      queryClient.invalidateQueries({ queryKey: ['tripTypes'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to create trip type');
    },
  });
};

export const useUpdateTripType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tripTypesService.update(data),
    onSuccess: () => {
      toast.success('Trip type updated successfully');
      queryClient.invalidateQueries({ queryKey: ['tripTypes'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to update trip type');
    },
  });
};

export const useDeleteTripType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => tripTypesService.delete(id),
    onSuccess: () => {
      toast.success('Trip type deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tripTypes'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to delete trip type');
    },
  });
};
