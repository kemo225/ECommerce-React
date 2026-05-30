import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsService } from '../services/questions.service';
import toast from 'react-hot-toast';

export const useQuestions = (pageNumber, pageSize) => {
  return useQuery({
    queryKey: ['questions', pageNumber, pageSize],
    queryFn: () => questionsService.getAll(pageNumber, pageSize),
  });
};

export const useQuestion = (id) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => questionsService.create(data),
    onSuccess: () => {
      toast.success('Question created successfully');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to create question');
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => questionsService.update(data),
    onSuccess: () => {
      toast.success('Question updated successfully');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to update question');
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => questionsService.delete(id),
    onSuccess: () => {
      toast.success('Question deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to delete question');
    },
  });
};
