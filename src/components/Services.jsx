import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Users, MapPin, ClipboardList, PhoneCall, TrendingUp } from 'lucide-react';

const services = [
  {
    icon: UserPlus,
    title: 'Captación de socios',
    desc: 'Incorporamos nuevos socios para la cooperativa mediante contacto directo, con información veraz y atención profesional.',
  },
  {
    icon: Users,
    title: 'Equipo de promotores',
    desc: 'Gestionamos un grupo de promotores capacitados y coordinados, disponibles para operar en las zonas asignadas.',
  },
  {
    icon: MapPin,
    title: 'Cobertura territorial',
    desc: 'Presencia activa en puntos de interés, llegando a personas que no siempre llegan a la cooperativa por cuenta propia.',
  },
  {
    icon: ClipboardList,
    title: 'Gestión de afiliaciones',
    desc: 'Procesamos y organizamos la documentación de cada afiliación, entregándola completa y en orden a la cooperativa.',
  },
  {
    icon: PhoneCall,
    title: 'Seguimiento post-contacto',
    desc: 'Acompañamos al potencial socio desde el primer contacto hasta la confirmación de su incorporación.',
  },
  {
    icon: TrendingUp,
    title: 'Reporte de resultados',
    desc: 'Informamos periódicamente a la cooperativa sobre el avance, las incorporaciones realizadas y el estado de cada gestión.',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });

      gsap.from('.svc-card', {
        y: 36,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="servicios" ref={sectionRef} className="py-24 lg:py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div ref={headRef} className="mb-14">
          <span className="text-sky-400 text-xs font-bold tracking-[0.18em] uppercase">
            Lo que hacemos
          </span>
          <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-md">
              Qué hace nuestro equipo
            </h2>
            <p className="text-slate-400 max-w-xs leading-relaxed text-sm">
              Promotores capacitados que trabajan en territorio para incorporar socios a tu cooperativa.
            </p>
          </div>
        </div>

        {/* Grid — gap-px with bg creates hairline borders between cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800 rounded-2xl overflow-hidden"
        >
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="svc-card group bg-slate-900 p-8 hover:bg-slate-800/60 transition-colors duration-300"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600/10 border border-sky-600/20 group-hover:bg-sky-600/20 group-hover:border-sky-600/40 transition-all duration-300">
                <Icon size={20} className="text-sky-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-semibold text-base mb-3">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
