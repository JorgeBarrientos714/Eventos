# eventos-frontend

Proyecto Next.js (pages router) con Tailwind y TypeScript, listo para integrar los archivos adjuntos de `EVENTOS`.

## Pasos de integración

1. Copia el contenido de la carpeta adjunta `EVENTOS` dentro de este proyecto, mapeando:
   - `EVENTOS/pages` -> `pages`
   - `EVENTOS/components` -> `components`
   - `EVENTOS/styles/globals.css` -> `styles/globals.css` (puedes combinar o reemplazar)
   - `EVENTOS/types` -> `types` (crea la carpeta si no existe)
   - `EVENTOS/data` -> `data` (crea la carpeta si no existe)
   - `EVENTOS/imports` -> `imports` (crea la carpeta si no existe)

2. Ajusta rutas si fuera necesario:
   - Si tienes una página `Events.tsx`, crea un archivo `pages/eventos.tsx` que la exporte.
   - Verifica que los imports relativos apunten a `components/` y no a rutas fuera.

3. Tailwind
   - Ya está configurado con `@tailwind base/components/utilities` y tokens simples en `styles/globals.css`.
   - Si tu CSS trae `@layer base` con utilidades como `outline-ring/50`, elimínalas o sustitúyelas por clases estándar de Tailwind.

4. Dependencias
   - Incluye `lucide-react`, `recharts`, `sonner`.
   - Ejecuta la instalación:

```powershell
Push-Location "C:\Users\Inprenet\Downloads\PortalInprema\PortalInprema\eventos-frontend"; npm install; Pop-Location
npm run dev
```

5. Inicio
   - Desarrollo: `npm run dev`
   - Compilación: `npm run build`
   - Producción: `npm start`
