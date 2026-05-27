import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { EMPRESA } from '../config';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre nosotros', href: '#nosotros' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Por qué elegirnos', href: '#porque' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-white font-bold text-base tracking-[0.2em]">CANSELION</span>
              <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest">
                SRL
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[26ch]">
              {EMPRESA.tagline}
            </p>
            {EMPRESA.rut && (
              <p className="text-slate-600 text-xs mt-5">RUT: {EMPRESA.rut}</p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-slate-500 text-[10px] font-bold tracking-[0.18em] uppercase mb-5">
              Navegación
            </h4>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-500 text-[10px] font-bold tracking-[0.18em] uppercase mb-5">
              Contacto
            </h4>
            <div className="flex flex-col gap-3.5">
              <a
                href={EMPRESA.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                <MessageCircle size={14} className="text-sky-600 shrink-0" strokeWidth={2} />
                {EMPRESA.whatsapp}
              </a>
              <a
                href={`mailto:${EMPRESA.email}`}
                className="flex items-center gap-2.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                <Mail size={14} className="text-sky-600 shrink-0" strokeWidth={2} />
                {EMPRESA.email}
              </a>
              <div className="flex items-center gap-2.5 text-slate-500 text-sm">
                <MapPin size={14} className="text-sky-600 shrink-0" strokeWidth={2} />
                {EMPRESA.direccion}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-slate-600 text-sm">{EMPRESA.legal}</p>
          <p className="text-slate-700 text-xs">{EMPRESA.nombre} · Servicios para cooperativas</p>
        </div>
      </div>
    </footer>
  );
}
