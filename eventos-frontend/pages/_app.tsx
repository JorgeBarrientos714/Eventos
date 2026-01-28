// Módulo: global/shared
// Función: Bootstrap de la app Next.js; aplica providers y estilos globales
// Relacionados: context/AdminAuthContext.tsx, styles/globals.css
// Rutas/Endpoints usados: ninguno
// Notas: No se renombra por ser entrypoint de Next.js.
import type { AppProps } from 'next/app';
import { Exo_2 } from 'next/font/google';
import { Toaster } from 'sonner';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import '../styles/globals.css';

const exo = Exo_2({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AdminAuthProvider>
      <div className={`site-bg ${exo.className}`}>
        <Toaster position="top-right" richColors />
        <Component {...pageProps} />
      </div>
    </AdminAuthProvider>
  );
}
