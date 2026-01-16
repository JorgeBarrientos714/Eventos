import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AdminGuard({ children, redirectTo = '/admin/login' }: AdminGuardProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white/80">
        <div className="rounded-full border-4 border-[#0d7d6e]/20 border-t-[#0d7d6e] h-14 w-14 animate-spin" aria-label="Cargando" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
