import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAreas } from '../lib/events';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  showMobile: boolean;
  onClose: () => void;
}

export function Sidebar({ selectedCategory, onSelectCategory, showMobile, onClose }: SidebarProps) {
  const [categories, setCategories] = useState<string[]>(['Todas las áreas']);

  useEffect(() => {
    async function loadAreas() {
      try {
        const areas = await getAreas();
        const areaNames = areas.map(a => a.nombre);
        setCategories(['Todas las áreas', ...areaNames]);
      } catch (error) {
        console.error('Error al cargar áreas:', error);
        // Fallback a categorías por defecto
        setCategories(['Todas las áreas', 'Psicología', 'Terapia Ocupacional', 'Geriatría']);
      }
    }
    loadAreas();
  }, []);
  return (
    <>
      {/* Desktop Sidebar */}
      {/* Desktop Sidebar - Fijo con scroll independiente */}
      <aside className="hidden md:block w-64 bg-white/40 backdrop-blur-md border-r border-white/30 fixed left-0 top-[73px] bottom-0 overflow-y-auto shadow-lg z-40">
        <div className="p-6 pt-20">
          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#0d7d6e]/90 text-white backdrop-blur-sm'
                    : 'text-gray-700 hover:bg-white/60'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </aside>


      {/* Mobile Sidebar Overlay */}
      {showMobile && (
        <>
          {/* Backdrop con blur */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/95 backdrop-blur-md z-50 md:hidden">
            <div className="p-4 border-b border-white/30 flex items-center justify-between">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Categorías</h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#0d7d6e]/90 text-white'
                        : 'text-gray-700 hover:bg-white/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
