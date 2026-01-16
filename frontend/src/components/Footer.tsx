export default function Footer() {
  return (
    <footer className="bg-brand-900 text-base text-sm text-white mt-10">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="opacity-90">© {new Date().getFullYear()} INPRENET. Todos los derechos reservados.</p>
        <p className="text-xs opacity-70">Portal interno </p>
      </div>
    </footer>
  );
}
