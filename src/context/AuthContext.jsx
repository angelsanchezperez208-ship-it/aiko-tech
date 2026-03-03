import { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  useEffect(() => {
    // 1. Revisamos si ya hay una sesión guardada en el navegador al entrar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
      setCargandoAuth(false);
    });

    // 2. Nos quedamos "escuchando" si el usuario entra o sale de su cuenta
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
    });

    // Limpieza de seguridad
    return () => subscription.unsubscribe();
  }, []);

  // Función rápida para cerrar sesión
  const cerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ usuario, cargandoAuth, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}