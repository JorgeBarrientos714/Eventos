// Módulo: login
// Función: Vista de autenticación admin (login/registro/recuperación)
// Relacionados: context/AdminAuthContext.tsx, lib/admin/services.ts
// Rutas/Endpoints usados: delega en lib/admin/services.ts (auth/register/login/recuperar/restablecer)
// Notas: No se renombra para preservar rutas Next.js y compatibilidad.
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Lock, Mail, PlusCircle, RefreshCcw } from 'lucide-react';
import backgroundImage from '../../assets/Edificio Color Blanco.jpg';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminServices } from '../../lib/admin/services';
import { AdminArea } from '../../lib/admin/types';
import Image from 'next/image';

type AuthMode = 'login' | 'register' | 'recover';

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    login,
    register,
    requestPasswordReset,
    resetPassword,
  } = useAdminAuth();
  const backgroundUrl = 'src' in backgroundImage ? backgroundImage.src : backgroundImage;

  const [mode, setMode] = useState<AuthMode>('login');
  const [areas, setAreas] = useState<AdminArea[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');

  const [nombre, setNombre] = useState('');
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [dni, setDni] = useState('');
  const [idArea, setIdArea] = useState('');

  const [recoveryToken, setRecoveryToken] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [generatedToken, setGeneratedToken] = useState<{ token: string; expira: string } | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin/eventos');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    let ignore = false;
    async function loadAreas() {
      if (mode !== 'register' || areas.length > 0) {
        return;
      }
      setLoadingAreas(true);
      try {
        const response = await adminServices.listAreas();
        if (!ignore) {
          setAreas(response);
        }
      } catch (err) {
        console.error('No se pudieron cargar las áreas', err);
      } finally {
        if (!ignore) {
          setLoadingAreas(false);
        }
      }
    }
    loadAreas();
    return () => {
      ignore = true;
    };
  }, [mode, areas.length]);

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    resetMessages();
    setSubmitting(true);
    try {
      await login({ correoElectronico, contrasena });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    resetMessages();
    setSubmitting(true);
    try {
      await register({
        nombre,
        numeroEmpleado,
        dni,
        idArea: Number(idArea),
        correoElectronico,
        contrasena,
      });
      setSuccess('Usuario creado y sesión iniciada correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar al usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestRecovery = async (event: FormEvent) => {
    event.preventDefault();
    resetMessages();
    setSubmitting(true);
    try {
      const issued = await requestPasswordReset({ correoElectronico });
      setGeneratedToken(issued);
      setRecoveryToken(issued.token);
      setSuccess('Se generó el token de recuperación. Revisa el correo o utiliza el token mostrado.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar el token de recuperación');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault();
    resetMessages();
    setSubmitting(true);
    try {
      await resetPassword({ token: recoveryToken, nuevaContrasena });
      setSuccess('Contraseña actualizada correctamente. Ahora puedes iniciar sesión.');
      setMode('login');
      setContrasena('');
      setNuevaContrasena('');
      setGeneratedToken(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    resetMessages();
    setSubmitting(false);
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="correo" className="text-sm font-semibold text-gray-600">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          value={correoElectronico}
          onChange={(e) => setCorreoElectronico(e.target.value)}
          autoComplete="email"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
          placeholder="correo@inprema.hn"
          required
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-gray-600">Contraseña</label>
        <input
          id="password"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
          placeholder="••••••••"
          required
        />
      </div>
      <button
        type="submit"
        disabled={submitting || !correoElectronico || !contrasena}
        className="w-full rounded-full bg-[#0d7d6e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b6a60] disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {submitting ? 'Ingresando…' : 'Iniciar sesión'}
      </button>
      <div className="flex flex-col gap-2 pt-2 text-center text-xs text-gray-500">
        <button
          type="button"
          onClick={() => handleModeChange('recover')}
          className="inline-flex items-center justify-center gap-2 text-[#0d7d6e] transition hover:text-[#0b6a60]"
        >
          <RefreshCcw className="h-3.5 w-3.5" /> Recuperar contraseña
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('register')}
          className="inline-flex items-center justify-center gap-2 text-[#0d7d6e] transition hover:text-[#0b6a60]"
        >
          <PlusCircle className="h-3.5 w-3.5" /> Crear cuenta administrativa
        </button>
      </div>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegister} className="mt-8 space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600">Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            placeholder="Nombre del empleado"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600">Número de empleado</label>
          <input
            type="text"
            value={numeroEmpleado}
            onChange={(e) => setNumeroEmpleado(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            placeholder="Código interno"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600">DNI</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 15);
              setDni(value);
            }}
            maxLength={15}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            placeholder="0801..."
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600">Área administrativa</label>
          <select
            value={idArea}
            onChange={(e) => setIdArea(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            required
            disabled={loadingAreas}
          >
            <option value="">Selecciona un área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-600">Correo institucional</label>
        <input
          type="email"
          value={correoElectronico}
          onChange={(e) => setCorreoElectronico(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
          placeholder="correo@inprema.hn"
          required
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-600">Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
          placeholder="Crea una contraseña segura"
          required
        />
      </div>
      <button
        type="submit"
        disabled={submitting || !correoElectronico || !contrasena || !nombre || !dni || !numeroEmpleado || !idArea}
        className="w-full rounded-full bg-[#0d7d6e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b6a60] disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {submitting ? 'Registrando…' : 'Registrar y acceder'}
      </button>
      <div className="pt-2 text-center text-xs text-gray-500">
        <button
          type="button"
          onClick={() => handleModeChange('login')}
          className="inline-flex items-center justify-center gap-2 text-[#0d7d6e] transition hover:text-[#0b6a60]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a iniciar sesión
        </button>
      </div>
    </form>
  );

  const renderRecoveryForm = () => (
    <div className="mt-8 space-y-6">
      <form onSubmit={handleRequestRecovery} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600">Correo asociado a la cuenta</label>
          <input
            type="email"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            placeholder="correo@inprema.hn"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !correoElectronico}
          className="w-full rounded-full bg-[#0d7d6e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b6a60] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {submitting ? 'Generando token…' : 'Enviar token de recuperación'}
        </button>
      </form>

      {generatedToken && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p className="font-semibold">Token generado</p>
          <p className="mt-1 flex items-center gap-2 text-xs">
            <Mail className="h-3.5 w-3.5" />
            {generatedToken.token}
          </p>
          <p className="mt-1 text-xs text-emerald-600">Válido hasta: {new Date(generatedToken.expira).toLocaleString('es-HN')}</p>
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600">Token recibido</label>
          <input
            type="text"
            value={recoveryToken}
            onChange={(e) => setRecoveryToken(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            placeholder="Pega el token del correo"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600">Nueva contraseña</label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !recoveryToken || !nuevaContrasena}
          className="w-full rounded-full bg-[#0d7d6e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b6a60] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {submitting ? 'Actualizando…' : 'Restablecer contraseña'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-gray-500">
        <button
          type="button"
          onClick={() => handleModeChange('login')}
          className="inline-flex items-center justify-center gap-2 text-[#0d7d6e] transition hover:text-[#0b6a60]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a iniciar sesión
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (mode === 'register') {
      return renderRegisterForm();
    }
    if (mode === 'recover') {
      return renderRecoveryForm();
    }
    return renderLoginForm();
  };

  const title = mode === 'login' ? 'Acceso administrativo' : mode === 'register' ? 'Crear usuario administrativo' : 'Recuperar acceso';
  const subtitle =
    mode === 'login'
      ? 'Ingresa con tu correo institucional para administrar el portal.'
      : mode === 'register'
        ? 'Registra tus datos para habilitar tu cuenta del panel administrativo.'
        : 'Genera un token de recuperación y actualiza tu contraseña.';

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Columna izquierda: Branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-[#0d7d6e] to-[#0ead93] relative">
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundUrl}
            alt="INPREMA edificio"
            fill
            style={{ objectFit: 'cover', opacity: 0.25 }}
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8">
          <div className="rounded-2xl px-10 py-12 flex flex-col items-center w-full max-w-xs">
            <span className="text-4xl font-bold text-white mb-2 tracking-widest">INPREMA</span>
          </div>
        </div>
      </div>

      {/* Columna derecha: Formulario */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white min-h-screen px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              className="px-6 py-2 text-lg font-semibold border-b-2 focus:outline-none transition-all"
              style={{
                color: '#0d7d6e',
                borderColor: '#0d7d6e',
                borderBottomWidth: 2,
                background: 'none',
                opacity: 0.95,
              }}
              disabled
            >
              Administrador
            </button>
            <button
              type="button"
              className="px-6 py-2 text-lg font-semibold text-gray-400 border-b-2 border-transparent focus:outline-none transition-all"
              style={{ background: 'none', opacity: 0.7 }}
              disabled
            >
              Interno
            </button>
          </div>
          <div className="flex flex-col items-center gap-3 text-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0d7d6e]/10 text-[#0d7d6e]">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          {error && <p className="mt-6 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
          {success && <p className="mt-6 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
