import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, FileCheck, MessageCircle, Layers, Shield } from 'lucide-react';

const benefits = [
  {
    icon: CheckCircle,
    title: 'Promotores con experiencia en campo',
    desc: 'Nuestro equipo conoce el trabajo de captación en territorio y sabe cómo comunicar los beneficios de la cooperativa de forma clara y honesta.',
  },
  {
    icon: FileCheck,
    title: 'Documentación completa y ordenada',
    desc: 'Cada afiliación se procesa correctamente. La cooperativa recibe toda la documentación en tiempo y forma.',
  },
  {
    icon: MessageCircle,
    title: 'Comunicación directa con la cooperativa',
    desc: 'Reportes periódicos, respuesta ágil y coordinación constante con el equipo interno de cada cooperativa.',
  },
  {
    icon: Layers,
    title: 'Adaptación al perfil de cada cooperativa',
    desc: 'Trabajamos según los criterios, zonas y requisitos de cada organización, sin imponer un modelo único.',
  },
  {
    icon: Shield,
    title: 'Representación formal y confiable',
    desc: 'Nuestros promotores actúan como extensión formal de la cooperativa, con respaldo institucional y conducta profesional.',
  },
];

export default function WhyUs() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        x: -36,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      gsap.from(Array.from(listRef.current.children), {
        x: 28,
        opacity: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: listRef.current, start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="porque" ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — sticky heading */}
          <div ref={headRef} className="lg:sticky lg:top-28">
            <span className="text-sky-600 text-xs font-bold tracking-[0.18em] uppercase">
              Por qué elegirnos
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Un equipo comprometido con cada incorporación
            </h2>
            <p className="mt-6 text-slate-600 leading-relaxed">
              No somos una agencia genérica. Somos un equipo de promotores que entiende el
              trabajo de campo y opera con responsabilidad, claridad y compromiso con la
              cooperativa que representamos.
            </p>
            <div className="mt-10">
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 active:scale-[0.97] shadow-lg shadow-sky-900/20"
              >
                Sumate como cooperativa
              </a>
            </div>
          </div>

          {/* Right — benefits list */}
          <div ref={listRef} className="flex flex-col divide-y divide-slate-100">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 py-7 first:pt-0 last:pb-0">
                <div className="flex-shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 border border-sky-100">
                  <Icon size={18} className="text-sky-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1.5">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
