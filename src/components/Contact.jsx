import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Mail, MapPin, FileText } from 'lucide-react';
import { EMPRESA } from '../config';

export default function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ct-block', {
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contacto" ref={sectionRef} className="py-24 lg:py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Heading */}
        <div className="ct-block mb-14">
          <span className="text-sky-400 text-xs font-bold tracking-[0.18em] uppercase">
            Contacto
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Estamos disponibles para atenderte
          </h2>
          <p className="mt-4 text-slate-400 max-w-[50ch] leading-relaxed">
            Si representás una cooperativa y querés sumar socios a través de nuestro equipo
            de promotores, contactanos por cualquiera de estos canales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left — contact methods ── */}
          <div className="ct-block flex flex-col gap-4">

            {/* WhatsApp — primary CTA */}
            <a
              href={EMPRESA.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-sky-600 hover:bg-sky-500 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-sky-900/30 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 shrink-0">
                <MessageCircle size={22} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sky-100 text-xs font-semibold uppercase tracking-widest mb-0.5">
                  WhatsApp
                </p>
                <p className="text-white font-bold text-lg">{EMPRESA.whatsapp}</p>
                <p className="text-sky-200 text-sm mt-0.5">Respuesta en horario comercial</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${EMPRESA.email}`}
              className="flex items-center gap-4 p-5 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-2xl transition-all duration-200 group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 shrink-0">
                <Mail size={20} className="text-sky-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                  Correo electrónico
                </p>
                <p className="text-white font-medium">{EMPRESA.email}</p>
              </div>
            </a>

            {/* Address */}
            <div className="flex items-center gap-4 p-5 bg-slate-800 border border-slate-700 rounded-2xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 shrink-0">
                <MapPin size={20} className="text-sky-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                  Ubicación
                </p>
                <p className="text-white font-medium">{EMPRESA.direccion}</p>
              </div>
            </div>

            {/* RUT — only shows when populated */}
            {EMPRESA.rut && (
              <div className="flex items-center gap-4 p-5 bg-slate-800 border border-slate-700 rounded-2xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 shrink-0">
                  <FileText size={20} className="text-sky-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                    RUT
                  </p>
                  <p className="text-white font-medium">{EMPRESA.rut}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Right — institutional card ── */}
          <div className="ct-block">
            <div className="h-full bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-slate-400 text-sm">Disponible para consultas</span>
                </div>

                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-white font-bold text-xl tracking-[0.15em]">CANSELION</span>
                  <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest">
                    SRL
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm max-w-[40ch]">
                  Equipo de promotores especializados en captación e incorporación de socios
                  para cooperativas, con procesos claros y documentación en orden.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Trabajamos con cooperativas que necesitan crecer en cantidad de socios. Nuestro
                  equipo se encarga del trabajo en campo para que la cooperativa pueda enfocarse
                  en atender a sus afiliados.
                </p>
                {!EMPRESA.rut && (
                  <p className="text-slate-700 text-xs mt-4">
                    RUT: disponible próximamente
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
