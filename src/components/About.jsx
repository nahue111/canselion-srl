import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Users, MapPin, ClipboardCheck } from 'lucide-react';

const features = [
  {
    icon: UserPlus,
    title: 'Captación de socios',
    text: 'Nuestros promotores trabajan en territorio para incorporar nuevos socios a la cooperativa de forma ordenada y efectiva.',
  },
  {
    icon: Users,
    title: 'Equipo de promotores',
    text: 'Contamos con un grupo de promotores capacitados, con experiencia en atención al público y gestión de afiliaciones.',
  },
  {
    icon: MapPin,
    title: 'Trabajo en territorio',
    text: 'Presencia activa en zonas asignadas, llegando directamente a potenciales socios con información clara y veraz.',
  },
  {
    icon: ClipboardCheck,
    title: 'Procesos documentados',
    text: 'Cada incorporación queda registrada y se entrega a la cooperativa con la documentación completa y en orden.',
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        x: -36,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      gsap.from(Array.from(cardsRef.current.children), {
        y: 28,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: cardsRef.current, start: 'top 82%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="nosotros" ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — text */}
          <div ref={textRef}>
            <span className="text-sky-600 text-xs font-bold tracking-[0.18em] uppercase">
              Quiénes somos
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Promotores especializados en incorporación de socios
            </h2>
            <p className="mt-6 text-slate-600 text-lg leading-relaxed">
              Canselion SRL cuenta con un equipo de promotores que trabajan en nombre de cooperativas
              para captar e incorporar nuevos socios. Nos encargamos de todo el proceso: desde el
              primer contacto hasta la entrega completa de la documentación.
            </p>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Operamos con responsabilidad y transparencia, siguiendo los procedimientos de cada
              cooperativa y brindando información clara a cada persona interesada en afiliarse.
            </p>
            <div className="mt-10">
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 active:scale-[0.97]"
              >
                Trabajar con nosotros
              </a>
            </div>
          </div>

          {/* Right — feature cards */}
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="p-6 border border-slate-200 rounded-2xl hover:border-sky-200 hover:shadow-md hover:shadow-sky-50 transition-all duration-250 group"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 border border-sky-100 group-hover:bg-sky-100 transition-colors duration-200">
                  <Icon size={20} className="text-sky-600" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
