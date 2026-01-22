// Módulo: login
// Función: Contexto de autenticación admin (login, registro, recuperación)
// Relacionados: lib/admin/services.ts, pages/admin/login.tsx
// Rutas/Endpoints usados: delega en lib/admin/services.ts
// Notas: No se renombra para mantener las importaciones existentes en el árbol de componentes.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminServices } from '../lib/admin/services';
import {
  AdminLoginPayload,
  AdminRegisterPayload,
  AdminUserSession,
  AdminRecoveryPayload,
  AdminResetPasswordPayload,
} from '../lib/admin/types';

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: AdminUserSession | null;
  login: (payload: AdminLoginPayload) => Promise<void>;
  register: (payload: AdminRegisterPayload) => Promise<void>;
  requestPasswordReset: (payload: AdminRecoveryPayload) => Promise<{ token: string; expira: string }>;
  resetPassword: (payload: AdminResetPasswordPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthState | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    adminServices
      .getSession()
      .then((currentSession) => {
        if (isMounted) {
          setSession(currentSession);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (payload: AdminLoginPayload) => {
    const newSession = await adminServices.login(payload);
    setSession(newSession);
  }, []);

  const register = useCallback(async (payload: AdminRegisterPayload) => {
    await adminServices.register(payload);
    const newSession = await adminServices.login({
      correoElectronico: payload.correoElectronico,
      contrasena: payload.contrasena,
    });
    setSession(newSession);
  }, []);

  const requestPasswordReset = useCallback(async (payload: AdminRecoveryPayload) => {
    return adminServices.requestPasswordReset(payload);
  }, []);

  const resetPassword = useCallback(async (payload: AdminResetPasswordPayload) => {
    await adminServices.resetPassword(payload);
  }, []);

  const logout = useCallback(async () => {
    await adminServices.logout();
    setSession(null);
  }, []);

  const value = useMemo<AdminAuthState>(() => ({
    isAuthenticated: Boolean(session),
    isLoading,
    session,
    login,
    register,
    requestPasswordReset,
    resetPassword,
    logout,
  }), [isLoading, session, login, logout, register, requestPasswordReset, resetPassword]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthState {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth debe utilizarse dentro de AdminAuthProvider');
  }
  return context;
}
