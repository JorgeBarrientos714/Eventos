const API_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL ?? `http://${window.location.hostname}:3000`)
  : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000');

const TOKEN_KEY = 'docente_token';

export const docenteAuth = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  setToken(token: string) {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(TOKEN_KEY, token); } catch {}
  },
  clearToken() {
    if (typeof window === 'undefined') return;
    try { localStorage.removeItem(TOKEN_KEY); } catch {}
  },
  async iniciarSesion(dni: string): Promise<{ token: string; docente: { id: number; nombreCompleto: string; nIdentificacion: string } }> {
    const res = await fetch(`${API_BASE_URL}/eventos/auth/docente/iniciar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || 'No fue posible iniciar sesión');
    }
    const data = await res.json();
    if (data?.token) this.setToken(data.token);
    return data;
  },
  async me(): Promise<{ id: number; nombreCompleto: string; nIdentificacion: string } | null> {
    const token = this.getToken();
    if (!token) return null;
    const res = await fetch(`${API_BASE_URL}/eventos/auth/docente/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  }
};
