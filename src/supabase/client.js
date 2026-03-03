import { createClient } from '@supabase/supabase-js';

// 1. Leemos las llaves secretas que guardaste en tu archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Creamos y exportamos la conexión oficial
export const supabase = createClient(supabaseUrl, supabaseAnonKey);