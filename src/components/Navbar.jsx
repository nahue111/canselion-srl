import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { EMPRESA } from '../config';

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-slate-900/96 backdrop-blur-md shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2.5 shrink-0">
            <span className="text-white font-bold text-lg tracking-[0.2em]">CANSELION</span>
            <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest">
              SRL
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href={EMPRESA.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.97]"
          >
            <MessageCircle size={15} strokeWidth={2} />
            Contactar
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-1.5 -mr-1.5"
            aria-label="Menú de navegación"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-6 pb-5 flex flex-col gap-1 border-t border-slate-800">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-white py-3 text-base font-medium border-b border-slate-800/60 last:border-0 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={EMPRESA.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold py-3.5 rounded-xl mt-3 transition-all active:scale-[0.98]"
          >
            <MessageCircle size={18} />
            Contactar por WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
