import React from 'react';
import supabase from './index';

export const SupabaseProvider = ({ children }) => {
  return (
    <supabase.Provider value={supabase}>
      {children}
    </supabase.Provider>
  );
};