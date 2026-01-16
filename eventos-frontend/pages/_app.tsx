import type { AppProps } from 'next/app';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AdminAuthProvider>
      <div className="site-bg">
        <Component {...pageProps} />
      </div>
    </AdminAuthProvider>
  );
}
