import { useEffect, useRef } from 'react';
import { MessageCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { EMPRESA } from '../config';

const trustItems = [
  'Equipo de promotores',
  'Incorporación ágil',
  'Seguimiento personalizado',
];

export default function Hero() {
  const badgeRef = useRef(null);
  const h1Ref = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(badgeRef.current, { y: -14, opacity: 0, duration: 0.5, delay: 0.15 })
        .from(h1Ref.current, { y: 48, opacity: 0, duration: 0.75 }, '-=0.2')
        .from(subRef.current, { y: 28, opacity: 0, duration: 0.6 }, '-=0.5')
        .from(Array.from(ctaRef.current.children), {
          y: 18,
          opacity: 0,
          duration: 0.45,
          stagger: 0.1,
        }, '-=0.35')
        .from(statsRef.current, { opacity: 0, duration: 0.5 }, '-=0.2')
        .from(imgRef.current, { x: 50, opacity: 0, duration: 0.85, ease: 'power2.out' }, '-=0.9');
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-[1fr_42%]"
    >
      {/* ── Left panel ── */}
      <div className="bg-slate-900 flex flex-col justify-center px-8 lg:px-14 xl:px-20 pt-28 pb-14 lg:pt-0 lg:pb-0">

        {/* Verified badge */}
        <div ref={badgeRef} className="flex items-center gap-2.5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-slate-400 text-sm font-medium tracking-wide">
            Empresa registrada · Uruguay
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={h1Ref}
          className="text-4xl md:text-5xl xl:text-[3.6rem] font-bold text-white tracking-tight leading-[1.08] mb-6 max-w-xl"
        >
          Incorporamos socios para{' '}
          <span className="text-sky-400">cooperativas</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-slate-400 text-lg leading-relaxed mb-10 max-w-[50ch]"
        >
          {EMPRESA.descripcion}
        </p>

        {/* CTA buttons */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
          <a
            href={EMPRESA.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.97] active:-translate-y-px shadow-lg shadow-sky-900/30"
          >
            <MessageCircle size={18} strokeWidth={2} />
            Contactar por WhatsApp
          </a>
          <a
            href="#servicios"
            className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-6 py-3.5 rounded-xl transition-all duration-200"
          >
            Ver servicios
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Trust stats */}
        <div
          ref={statsRef}
          className="flex flex-wrap gap-x-7 gap-y-3 pt-8 border-t border-slate-800"
        >
          {trustItems.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle size={14} className="text-sky-500 shrink-0" strokeWidth={2} />
              <span className="text-slate-400 text-sm">{item}</span>
            </div>
          ))}
        </div>

        {/* Mobile preview image */}
        <div className="mt-10 lg:hidden rounded-2xl overflow-hidden h-52 relative">
          <img
            src="/images/foto3.png"
            alt="Sede de cooperativa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
          <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2">
            <p className="text-white text-xs font-semibold">Canselion SRL</p>
            <p className="text-slate-300 text-[10px]">Servicios para cooperativas</p>
          </div>
        </div>
      </div>

      {/* ── Right panel — photo ── */}
      <div ref={imgRef} className="hidden lg:block relative overflow-hidden">
        <img
          src="/images/foto3.png"
          alt="Sede de cooperativa atendida por Canselion SRL"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Left blend edge */}
        <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
        {/* Bottom info card */}
        <div className="absolute bottom-10 left-8 right-8">
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400 text-xs">Empresa verificada</span>
            </div>
            <p className="text-white font-semibold">Canselion SRL</p>
            <p className="text-slate-400 text-sm mt-0.5">Servicios tercerizados · Cooperativas</p>
          </div>
        </div>
      </div>
    </section>
  );
}
