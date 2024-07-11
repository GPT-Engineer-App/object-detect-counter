import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Supabase Table Definitions
 * 
 * ### event
 * 
 * | name       | type        | format | required |
 * |------------|-------------|--------|----------|
 * | id         | int8        | number | true     |
 * | name       | text        | string | true     |
 * | created_at | timestamptz | string | true     |
 * | date       | date        | string | true     |
 */

export const useFetchEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('event').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useFetchEvent = (id) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('event').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEvent) => {
      const { data, error } = await supabase.from('event').insert(newEvent);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('events');
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedEvent) => {
      const { data, error } = await supabase.from('event').update(updatedEvent).eq('id', updatedEvent.id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('events');
      queryClient.invalidateQueries(['event', updatedEvent.id]);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase.from('event').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('events');
    },
  });
};

export const SupabaseProvider = ({ children }) => {
  return (
    <supabase.Provider value={supabase}>
      {children}
    </supabase.Provider>
  );
};