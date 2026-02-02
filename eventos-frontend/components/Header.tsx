// Módulo: global/public
// Función: Barra de navegación principal del portal público
// Relacionados: components/Home.tsx, pages/index.tsx
// Rutas/Endpoints usados: ninguno
// Notas: No se renombra para conservar imports.
import Link from 'next/link';
import { ChevronDown, Menu, Search, X, User, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { docenteAuth } from '../lib/authDocente';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSearch?: (query: string) => void;
  searchQuery?: string; // Recibir searchQuery desde App.tsx
}

export function Header({ currentPage, onNavigate, onSearch, searchQuery: externalSearchQuery = '' }: HeaderProps) {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const modulesRef = useRef<HTMLDivElement | null>(null);
  const [docenteNombre, setDocenteNombre] = useState<string>('');
  const [docenteCorreo, setDocenteCorreo] = useState<string>('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const primerNombre = docenteNombre?.split(' ')[0] || '';


  // Sincronizar con el searchQuery externo (cuando se limpia desde App.tsx)
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  // Cerrar menú de módulos al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modulesRef.current && !modulesRef.current.contains(e.target as Node)) {
        setShowModulesMenu(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Cargar docente actual si hay token
  useEffect(() => {
    let mounted = true;
    (async () => {
      const me = await docenteAuth.me().catch(() => null);
      if (mounted) {
        if (me?.nombreCompleto) setDocenteNombre(me.nombreCompleto);
        if (me?.nIdentificacion) setDocenteCorreo(me.nIdentificacion);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setShowMobileMenu(false);
  };

  // Buscador: filtra solo en la página actual, no redirige
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  // Limpiar búsqueda y mostrar todos los resultados
  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Manejar tecla Escape para limpiar
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

  // Función para navegar a diferentes vistas del módulo de eventos
  const handleEventosFilter = (filter: 'all' | 'eventos' | 'clases') => {
    if (filter === 'all') {
      handleNavClick('events');
    } else {
      router.push(`/events?filter=${filter}`);
    }
    setShowModulesMenu(false);
  };

  const handleLogout = () => {
    docenteAuth.clearToken();
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 overflow-x-clip">
      <div className="mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-nowrap items-center justify-between gap-3 md:gap-4 min-w-0">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-[#0d7d6e] text-xl md:text-2xl tracking-wide flex-shrink-0"
            style={{ fontWeight: 700 }}
          >
            INPREMA
          </button>

          {/* Search Bar - Desktop & Tablet */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center basis-full sm:basis-auto w-full sm:flex-1 sm:max-w-md mx-0 sm:mx-4 order-3 sm:order-none min-w-0">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar eventos, clases, área..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 pr-20 rounded-full border-0 bg-gray-200 text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0d7d6e] text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Limpiar búsqueda (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#0d7d6e]"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 min-w-0">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#0d7d6e] transition-colors ${currentPage === 'home' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
            >
              Inicio
            </button>
            {(
              <>
                <button
                  onClick={() => handleNavClick('my-registrations')}
                  className={`hover:text-[#0d7d6e] transition-colors ${currentPage === 'my-registrations' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
                >
                  Mis inscripciones
                </button>
                <button
                  onClick={() => handleNavClick('cancel-registrations')}
                  className={`hover:text-[#0d7d6e] transition-colors ${currentPage === 'cancel-registrations' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
                >
                  Cancelar inscripciones
                </button>
                <button
                  onClick={() => handleNavClick('cancellation-history')}
                  className={`hover:text-[#0d7d6e] transition-colors ${currentPage === 'cancellation-history' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
                >
                  Historial de cancelaciones
                </button>
              </>
            )}
            <div className="relative" ref={modulesRef}>
              <button
                onClick={() => setShowModulesMenu((v) => !v)}
                className="flex items-center gap-1 text-gray-700 hover:text-[#0d7d6e] transition-colors"
              >
                Módulos
                <ChevronDown className="w-4 h-4" />
              </button>
              {showModulesMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  {/* Saludo */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {docenteNombre || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{docenteCorreo}</p>
                  </div>

                  {/* Opciones */}
                  <button
                    onClick={() => {
                      handleNavClick('carnetizacion');
                      setShowModulesMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Carnetización
                  </button>
                  <button
                    onClick={() => handleEventosFilter('eventos')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Eventos
                  </button>
                  <button
                    onClick={() => handleEventosFilter('clases')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clases
                  </button>

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Salir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-700 hover:text-[#0d7d6e]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="md:hidden mt-4 pt-4 border-t space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="sm:hidden mb-3">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar eventos, clases, área..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearch) onSearch(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-2 pr-20 rounded-full border border-gray-300 focus:outline-none focus:border-[#0d7d6e] text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Limpiar búsqueda (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0d7d6e]"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <button
              onClick={() => handleNavClick('home')}
              className={`block w-full text-left hover:text-[#0d7d6e] transition-colors ${currentPage === 'home' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('events')}
              className={`block w-full text-left hover:text-[#0d7d6e] transition-colors ${currentPage === 'events' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
            >
              Eventos
            </button>
            {docenteNombre && (
              <>
                <button
                  onClick={() => handleNavClick('my-registrations')}
                  className={`block w-full text-left hover:text-[#0d7d6e] transition-colors ${currentPage === 'my-registrations' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
                >
                  Mis inscripciones
                </button>
                <button
                  onClick={() => handleNavClick('cancel-registrations')}
                  className={`block w-full text-left hover:text-[#0d7d6e] transition-colors ${currentPage === 'cancel-registrations' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
                >
                  Cancelar inscripciones
                </button>
                <button
                  onClick={() => handleNavClick('cancellation-history')}
                  className={`block w-full text-left hover:text-[#0d7d6e] transition-colors ${currentPage === 'cancellation-history' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
                >
                  Historial de cancelaciones
                </button>
              </>
            )}
            <div className="space-y-2 border-t border-gray-100 pt-3">
              {/* Info del usuario en móvil */}
              <div className="flex items-center gap-2 text-sm py-2 border-b border-gray-100">
                <User className="w-4 h-4 flex-shrink-0 text-gray-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {docenteNombre || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{docenteCorreo}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-700 text-sm font-semibold">
                Módulos
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="pl-4 space-y-2">
                <button
                  onClick={() => {
                    handleNavClick('carnetizacion');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left text-sm text-gray-700 hover:text-[#0d7d6e] transition-colors"
                >
                  Carnetización
                </button>
                <button
                  onClick={() => {
                    handleEventosFilter('eventos');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left text-sm text-gray-700 hover:text-[#0d7d6e] transition-colors"
                >
                  Eventos
                </button>
                <button
                  onClick={() => {
                    handleEventosFilter('clases');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left text-sm text-gray-700 hover:text-[#0d7d6e] transition-colors"
                >
                  Clases
                </button>
              </div>
            </div>
            
            {/* Logout en móvil */}
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm text-red-600 hover:text-red-700 flex items-center gap-2 pt-3 border-t border-gray-100"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
            {/*  <Link
              href="/admin/login"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#0d7d6e] px-4 py-2 text-sm font-semibold text-[#0d7d6e] transition hover:bg-[#0d7d6e] hover:text-white"
            >
              Iniciar sesión administrativo
            </Link> */}
          </nav>
        )}
      </div>
    </header>
  );
}