import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const photos = [
  {
    src: '/images/foto1.png',
    alt: 'Local de cooperativa — acceso y atención al público',
    caption: 'Acceso al público',
  },
  {
    src: '/images/foto2.png',
    alt: 'Interior de cooperativa — sala de productos y exhibición',
    caption: 'Espacio interno',
  },
  {
    src: '/images/foto3.png',
    alt: 'Sede institucional de cooperativa — fachada exterior',
    caption: 'Sede institucional',
  },
];

export default function Gallery() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });

      gsap.from('.gal-item', {
        y: 44,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gal-grid', start: 'top 82%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div ref={headRef} className="mb-12 text-center">
          <span className="text-sky-600 text-xs font-bold tracking-[0.18em] uppercase">
            Presencia en territorio
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Cooperativas a las que acompañamos
          </h2>
          <p className="mt-4 text-slate-500 max-w-[50ch] mx-auto leading-relaxed">
            Trabajamos con cooperativas activas que atienden a sus socios en múltiples
            sedes, brindando apoyo en su gestión diaria.
          </p>
        </div>

        {/* Bento gallery — 1 large left + 2 stacked right */}
        <div className="gal-grid grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 lg:h-[520px]">

          {/* Large left */}
          <div className="gal-item relative overflow-hidden rounded-2xl group h-72 lg:h-auto">
            <img
              src={photos[0].src}
              alt={photos[0].alt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="text-white text-xs font-semibold bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
                {photos[0].caption}
              </span>
            </div>
          </div>

          {/* Right column — stacked */}
          <div className="flex flex-col gap-4 lg:h-full">
            {[photos[1], photos[2]].map((photo, i) => (
              <div
                key={i}
                className="gal-item relative overflow-hidden rounded-2xl group h-56 lg:flex-1"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white text-xs font-semibold bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
                    {photo.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
