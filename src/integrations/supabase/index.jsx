import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useContext, useState, useEffect } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, session, setSession }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

// Generate hooks for CRUD operations for all tables based on openapi.json
// Example for a table named 'events'

/**
 * ### events
 *
 * | name       | type        | format | required |
 * |------------|-------------|--------|----------|
 * | id         | int8        | number | true     |
 * | name       | text        | string | true     |
 * | created_at | timestamptz | string | true     |
 * | date       | date        | string | true     |
 */

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (newEvent) => {
      const { data, error } = await supabase.from('events').insert(newEvent);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
      },
    }
  );
};

export const useReadEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useReadEvent = (id) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, updates }) => {
      const { data, error } = await supabase.from('events').update(updates).eq('id', id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
      },
    }
  );
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id) => {
      const { data, error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
      },
    }
  );
};

// Authentication hooks
export const useSignUp = () => {
  return useMutation(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    return data;
  });
};

export const useSignIn = () => {
  return useMutation(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  });
};

export const useSignOut = () => {
  return useMutation(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  });
};