import { createClient } from '@supabase/supabase-js';

// Estas variables se deben configurar en las variables de entorno
// o directamente aquí (para desarrollo)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Crear cliente de Supabase solo si hay credenciales configuradas
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para verificar si Supabase está disponible
export const isSupabaseEnabled = () => {
  return supabase !== null;
};

// Helper para verificar conectividad
export const checkSupabaseConnection = async () => {
  if (!isSupabaseEnabled()) {
    return { connected: false, error: 'Supabase no configurado' };
  }
  
  try {
    const { error } = await supabase.from('productos').select('count', { count: 'exact', head: true });
    return { connected: !error, error: error?.message };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};
