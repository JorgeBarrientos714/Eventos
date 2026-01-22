// Módulo: global/shared
// Función: Utilidades de registro/cancelación de eventos en localStorage
// Relacionados: components/MyRegistrationsPage.tsx, pages/my-registrations.tsx
// Rutas/Endpoints usados: ninguno (persistencia local)
// Notas: No se renombra para conservar imports.
import type { Registration } from '../types/teacher';

const KEY = 'eventos_registrations';
const CANCEL_KEY = 'eventos_cancelled_registrations';

export function getRegistrations(): Registration[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function saveRegistrations(regs: Registration[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(regs));
}

export function addRegistration(eventId: string, teacherDni: string) {
  const regs = getRegistrations();
  const exists = regs.some(r => r.eventId === eventId && r.teacherDni === teacherDni);
  if (!exists) {
    regs.push({ id: crypto.randomUUID(), eventId, teacherDni, registeredAt: new Date().toISOString() });
    saveRegistrations(regs);
  }
}

export function removeRegistration(eventId: string) {
  const regs = getRegistrations();
  const remaining = regs.filter(r => r.eventId !== eventId);
  saveRegistrations(remaining);
  const cancelled = getCancelledRegistrations();
  const removed = regs.find(r => r.eventId === eventId);
  if (removed) {
    cancelled.push(removed);
    saveCancelledRegistrations(cancelled);
  }
}

export function getCancelledRegistrations(): Registration[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CANCEL_KEY);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function saveCancelledRegistrations(regs: Registration[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CANCEL_KEY, JSON.stringify(regs));
}
