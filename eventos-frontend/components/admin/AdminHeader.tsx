// Módulo: frontend-admin
// Función: Barra de navegación para usuarios internos (admin)
// Relacionados: AdminLayout, Header (público), AdminAuthContext
// Rutas/Endpoints usados: ninguno directo
// Notas: Basado en Header.tsx pero adaptado para panel administrativo
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Menu, User, ChevronDown, LogOut, Settings, Search, X } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export function AdminHeader({ currentPage, onNavigate, searchQuery = '', onSearch }: AdminHeaderProps) {
  const router = useRouter();
  const { session, logout } = useAdminAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const modulesRef = useRef<HTMLDivElement | null>(null);

  // Sincronizar con prop externa
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Obtener nombre del usuario
  const primerNombre = session?.usuario.empleado?.nombre?.split(' ')[0] || '';
  const nombreCompleto = session?.usuario.empleado?.nombre || session?.usuario.correoElectronico || 'Usuario';

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

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setShowMobileMenu(false);
    setShowModulesMenu(false);
  };

  // Buscador: filtra solo en la página actual, no redirige
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearchQuery.trim());
    }
  };

  // Limpiar búsqueda y mostrar todos los resultados
  const handleClearSearch = () => {
    setLocalSearchQuery('');
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

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  // Función para navegar a diferentes vistas del módulo de eventos
  const handleEventosFilter = (filter: 'all' | 'eventos' | 'clases') => {
    if (filter === 'all') {
      handleNavClick('eventos');
    } else {
      router.push(`/admin/eventos?filter=${filter}`);
    }
    setShowModulesMenu(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 overflow-x-clip">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-nowrap items-center justify-between gap-3 md:gap-4 min-w-0">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-[#0d7d6e] text-xl md:text-2xl tracking-wide flex-shrink-0"
            style={{ fontWeight: 700 }}
          >
            INPREMA
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 min-w-0 flex-1">
            {/* Buscador */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar eventos, clases, área..."
                className="w-full px-4 py-2 pr-20 rounded-full border-0 bg-gray-200 text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0d7d6e] text-sm"
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {localSearchQuery && (
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
            </form>
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#0d7d6e] transition-colors ${currentPage === 'home' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('eventos')}
              className={`hover:text-[#0d7d6e] transition-colors ${currentPage === 'eventos' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
            >
              Gestión de Eventos
            </button>

            {/* Menú Módulos */}
            <div className="relative ml-auto" ref={modulesRef}>
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
                      Hola, {primerNombre}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{session?.usuario.correoElectronico}</p>
                  </div>

                  {/* Opciones */}
                  <button
                    onClick={() => {
                      router.push('/carnetizacion');
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
                  <button
                    onClick={() => {
                      setShowModulesMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                    disabled
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
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

            {/* Info del usuario */}
            <div className="flex items-center gap-2 text-sm text-gray-600 max-w-[240px] min-w-0">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{nombreCompleto}</span>
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
            {/* Buscador móvil */}
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                placeholder="Buscar eventos, clases, área..."
                className="w-full px-4 py-2 pr-20 rounded-full border-0 bg-gray-200 text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0d7d6e] text-sm"
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {localSearchQuery && (
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
            </form>

            {/* Info del usuario en móvil */}
            <div className="flex items-center gap-2 text-sm py-2 border-b border-gray-100">
              <User className="w-4 h-4 flex-shrink-0 text-gray-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  Hola, {primerNombre}
                </p>
                <p className="text-xs text-gray-500 truncate">{session?.usuario.correoElectronico}</p>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`block w-full text-left hover:text-[#0d7d6e] transition-colors ${currentPage === 'home' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('eventos')}
              className={`block w-full text-left hover:text-[#0d7d6e] transition-colors ${currentPage === 'eventos' ? 'text-[#0d7d6e]' : 'text-gray-700'}`}
            >
              Gestión de Eventos
            </button>

            {/* Módulos en móvil */}
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1 text-gray-700 text-sm font-semibold">
                Módulos
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="pl-4 space-y-2">
                <button
                  onClick={() => {
                    router.push('/carnetizacion');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left text-sm text-gray-700 hover:text-[#0d7d6e]"
                >
                  Carnetización
                </button>
                <button
                  onClick={() => handleEventosFilter('eventos')}
                  className="block w-full text-left text-sm text-gray-700 hover:text-[#0d7d6e]"
                >
                  Eventos
                </button>
                <button
                  onClick={() => handleEventosFilter('clases')}
                  className="block w-full text-left text-sm text-gray-700 hover:text-[#0d7d6e]"
                >
                  Clases
                </button>
                <button
                  disabled
                  className="block w-full text-left text-sm text-gray-400 cursor-not-allowed"
                >
                  Configuración
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
          </nav>
        )}
      </div>
    </header>
  );
}