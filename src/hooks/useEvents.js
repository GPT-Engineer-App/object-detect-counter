import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/integrations/supabase';

const fetchEvents = async () => {
  const { data, error } = await supabase.from('event').select('*');
  if (error) throw new Error(error.message);
  return data;
};

const fetchEventById = async (id) => {
  const { data, error } = await supabase.from('event').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

const createEvent = async (event) => {
  const { data, error } = await supabase.from('event').insert(event).single();
  if (error) throw new Error(error.message);
  return data;
};

const updateEvent = async (id, event) => {
  const { data, error } = await supabase.from('event').update(event).eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

const deleteEvent = async (id) => {
  const { data, error } = await supabase.from('event').delete().eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
};

export const useEvent = (id) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(createEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(updateEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
};