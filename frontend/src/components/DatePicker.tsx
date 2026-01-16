"use client";

import React, { useState } from "react";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// rango de años (puedes ampliarlo)
const YEARS = (() => {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current; y >= current - 80; y--) {
    years.push(y);
  }
  return years;
})();

type DatePickerProps = {
  label?: string;
  value?: string; // dd/mm/yyyy
  onChange?: (value: string) => void;
};

export default function DatePicker({ label, value, onChange }: DatePickerProps) {
  const today = new Date();
  const parsed = value ? parseDDMMYYYY(value) : null;

  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(parsed ? parsed.getMonth() : today.getMonth());
  const [currentYear, setCurrentYear] = useState(parsed ? parsed.getFullYear() : today.getFullYear());

  const days = buildCalendar(currentYear, currentMonth);

  function handleSelect(day: number) {
    const d = new Date(currentYear, currentMonth, day);
    onChange?.(formatDDMMYYYY(d));
    setOpen(false);
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-ink-700 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full border rounded-lg px-3 py-2 text-left text-sm flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
      >
        <span className={value ? "text-ink-900" : "text-ink-500"}>
          {value || "dd/mm/aaaa"}
        </span>
        <span className="text-ink-500 text-xs">📅</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-72 bg-white border border-brand-50 rounded-lg shadow-lg p-3">
          {/* header con selects */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm bg-white"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm bg-white"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* días */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-ink-500 mb-1">
            <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span className="text-red-500">Sa</span><span className="text-red-500">Do</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {days.map((d, idx) => {
              if (!d) return <span key={idx} />;
              const isSelected =
                parsed &&
                d === parsed.getDate() &&
                currentMonth === parsed.getMonth() &&
                currentYear === parsed.getFullYear();

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(d)}
                  className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center
                    ${isSelected ? "bg-brand-700 text-white" : "hover:bg-brand-50"}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// helpers
function buildCalendar(year: number, month: number): Array<number | null> {
  const firstDay = new Date(year, month, 1);
  let start = firstDay.getDay() - 1;
  if (start < 0) start = 6; // domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<number | null> = [];
  for (let i = 0; i < start; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function formatDDMMYYYY(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function parseDDMMYYYY(str: string): Date | null {
  const [dd, mm, yyyy] = str.split("/");
  if (!dd || !mm || !yyyy) return null;
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}
