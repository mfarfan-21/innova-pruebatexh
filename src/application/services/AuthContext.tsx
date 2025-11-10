/**
 * AuthContext - Contexto de Autenticación
 * Provee el estado de autenticación a toda la aplicación
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../../infrastructure/adapters/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User, AuthState, LoginCredentials } from '../../shared/types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Verificar sesión al cargar
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // Helper para construir el objeto User
      const buildUser = async (authUser: SupabaseUser): Promise<User> => {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('username')
            .eq('id', authUser.id)
            .single();

          return {
            id: authUser.id,
            username: userData?.username || authUser.email!.split('@')[0],
            email: authUser.email!,
            createdAt: new Date(authUser.created_at),
            lastSignInAt: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) : undefined,
          };
        } catch (error) {
          console.error('Error fetching username:', error);
          return {
            id: authUser.id,
            username: authUser.email!.split('@')[0],
            email: authUser.email!,
            createdAt: new Date(authUser.created_at),
            lastSignInAt: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) : undefined,
          };
        }
      };

      // Primero, verificar si hay una sesión inicial
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession?.user && isMounted) {
        console.log('🔐 Initial session found:', initialSession.user.id);
        const user = await buildUser(initialSession.user);
        
        if (!isMounted) return;

        setAuthState({
          user,
          accessToken: initialSession.access_token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else if (isMounted) {
        console.log('🔓 No initial session');
        setAuthState({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }

      // Luego, escuchar cambios de autenticación
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 Auth event:', event, 'Session:', session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }
        
        if (session?.user) {
          const user = await buildUser(session.user);
          
          if (!isMounted) return;

          setAuthState({
            user,
            accessToken: session.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          if (!isMounted) return;
          setAuthState({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      });

      return subscription;
    };

    const subscriptionPromise = initAuth();

    return () => {
      isMounted = false;
      subscriptionPromise.then(sub => sub?.unsubscribe());
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      // 1. Buscar usuario por username en la tabla public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, email')
        .eq('username', credentials.username)
        .single();

      if (userError || !userData) {
        throw new Error('Usuario no encontrado');
      }

      // 2. Intentar login con el email encontrado
      const { error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: credentials.password,
      });

      if (error) throw error;

      // El estado se actualizará automáticamente por onAuthStateChange
      return { success: true };
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return { success: true };
    } catch (error: unknown) {
      console.error('Logout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cerrar sesión';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
