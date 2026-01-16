"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <header className="bg-brand-800 text-white sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        {/* logo + título */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-9 w-9 rounded-full bg-accent-300/90 flex items-center justify-center text-brand-800 font-bold text-sm">
            I
          </div>
          <div className="leading-tight">
            <p className="text-[11px] opacity-80">Instituto de Previsión</p>
            <h1 className="text-sm sm:text-base font-semibold">PORTAL INPREMA</h1>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-accent-200">
            Inicio
          </Link>

          {/* dropdown desktop */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="inline-flex items-center gap-1 hover:text-accent-200"
            >
              Módulos
              <span className={`transition-transform text-[10px] ${open ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {open && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-lg bg-white text-ink-700 shadow-lg border border-brand-50 overflow-hidden"
              >
                <Link
                  href="/carnetizacion"
                  className="block px-4 py-2 text-sm hover:bg-brand-50"
                  onClick={() => setOpen(false)}
                >
                  Carnetización
                </Link>

                <Link
                   href="/eventos"
                   className="block px-4 py-2 text-sm hover:bg-brand-50"
                   onClick={() => setOpen(false)}
                 >
                   Eventos
                </Link>

                {}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <button
            onClick={() => setOpenMobile((p) => !p)}
            className="bg-accent-300 text-brand-800 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
          >
            Módulos
            <span className={`transition-transform text-[10px] ${openMobile ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
        </div>
      </div>

      {/* dropdown móvil */}
      {openMobile && (
        <div className="md:hidden bg-white text-ink-700 shadow-lg border-t border-brand-50">
          <div className="max-w-6xl mx-auto px-4 py-2 space-y-1">
            <Link
              href="/"
              className="block px-2 py-2 text-sm rounded hover:bg-brand-50"
              onClick={() => setOpenMobile(false)}
            >
              Inicio
            </Link>
            <Link
              href="/carnetizacion"
              className="block px-2 py-2 text-sm rounded hover:bg-brand-50"
              onClick={() => setOpenMobile(false)}
            >
              Carnetización
            </Link>
            <Link
              href="/eventos"
              className="block px-2 py-2 text-sm rounded hover:bg-brand-50"
              onClick={() => setOpenMobile(false)}
            >
              Eventos 
            </Link>
            {}
          </div>
        </div>
      )}
    </header>
  );
}
