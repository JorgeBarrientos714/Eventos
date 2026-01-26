// Módulo: global/shared
// Función: Bootstrap de la app Next.js; aplica providers y estilos globales
// Relacionados: context/AdminAuthContext.tsx, styles/globals.css
// Rutas/Endpoints usados: ninguno
// Notas: No se renombra por ser entrypoint de Next.js.
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AdminAuthProvider>
      <div className="site-bg">
        <Toaster position="top-right" richColors />
        <Component {...pageProps} />
      </div>
    </AdminAuthProvider>
  );
}
