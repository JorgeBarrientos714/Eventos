import Link from 'next/link';
import { useRouter } from 'next/router';
import backgroundImage from '../../assets/Edificio Color Blanco.jpg';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function AdminLayout({ title, description, children }: AdminLayoutProps) {
  const router = useRouter();
  const { logout, session } = useAdminAuth();
  const backgroundUrl = 'src' in backgroundImage ? backgroundImage.src : backgroundImage;

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  return (
    <div className="events-shell">
      <div
        className="events-bg-fixed"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.96) 75%), url(${backgroundUrl})`,
        }}
      />
      <div className="events-content">
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-[#0d7d6e]">Panel administrativo</span>
              <h1 className="text-lg font-semibold text-gray-800">INPREMA</h1>
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
              <Link href="/admin/eventos" className={router.pathname.startsWith('/admin/eventos') ? 'text-[#0d7d6e]' : 'hover:text-[#0d7d6e]'}>
                Gestión de eventos
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#0d7d6e]/20 px-4 py-1.5 text-sm text-[#0d7d6e] transition hover:bg-[#0d7d6e] hover:text-white"
              >
                Cerrar sesión
              </button>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="mb-8 space-y-2">
            {title && <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
            {session && (
              <p className="text-xs text-gray-400">
                Conectado como <span className="font-medium text-gray-600">{session.usuario.correoElectronico}</span>
                {session.usuario.empleado?.areaNombre && (
                  <>
                    {' '}| Área: <span className="font-medium text-gray-600">{session.usuario.empleado.areaNombre}</span>
                  </>
                )}
              </p>
            )}
          </div>
          <div className="rounded-2xl bg-white/95 p-6 shadow-sm ring-1 ring-gray-100/60 backdrop-blur-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
