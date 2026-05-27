import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2, ChevronLeft } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

function leerUTMs() {
  const p = new URLSearchParams(window.location.search);
  const source   = p.get('utm_source')   || '';
  const campaign = p.get('utm_campaign') || '';
  return {
    utmSource:   source,
    utmCampaign: campaign,
    utmAd:       p.get('utm_ad')      || '',
    utmContent:  p.get('utm_content') || '',
    origen:      source ? `${source}${campaign ? ' / ' + campaign : ''}` : 'Directo',
  };
}

function celularValido(cel) {
  const d = cel.replace(/\D/g, '');
  // Uruguay: 09XXXXXXX (9 dígitos) o con prefijo 598 (11-12 dígitos)
  return d.length === 9 || d.length === 11 || d.length === 12;
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function BarraProgreso({ paso }) {
  const pct = ((paso + 1) / 3) * 100;
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-slate-400">Paso {paso + 1} de 3</span>
        <span className="text-sm text-slate-300">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-sky-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function BtnOpcion({ label, seleccionado, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-base font-medium transition-all duration-150 active:scale-[0.97] min-h-[60px] ${
        seleccionado
          ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-100'
          : 'bg-white border-slate-200 text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700'
      }`}
    >
      {label}
    </button>
  );
}

function CampoTexto({ label, type = 'text', placeholder, value, onChange, error, inputMode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={`w-full border-2 rounded-xl px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-300 outline-none transition-colors ${
          error
            ? 'border-red-400 bg-red-50 focus:border-red-400'
            : 'border-slate-200 focus:border-sky-400 bg-white'
        }`}
      />
      {error && (
        <p className="flex items-center gap-1.5 text-red-500 text-sm mt-1.5">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Pantalla de éxito ─────────────────────────────────────────────────────────

function PantallaExito() {
  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col items-center justify-center px-4 py-12 text-center">
      <Logo />
      <div className="mt-6 w-full max-w-sm bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 px-8 py-12">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-100">
            <CheckCircle size={34} className="text-emerald-500" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
          Gracias. Recibimos tu consulta.
        </h1>
        <p className="text-slate-500 leading-relaxed text-base">
          Un asesor de Canselion SRL se va a contactar con vos para brindarte
          la información disponible.
        </p>
      </div>
      <p className="mt-8 text-slate-400 text-xs">
        Canselion SRL · Servicios para cooperativas
      </p>
    </div>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <span className="font-bold text-slate-800 text-base tracking-[0.18em]">CANSELION</span>
      <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest">
        SRL
      </span>
    </a>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

const ENDPOINT = import.meta.env.VITE_GAS_ENDPOINT;

export default function Registros() {
  const [paso, setPaso]       = useState(0);
  const [avanzando, setAvanzando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [utms, setUtms]       = useState({});
  const [errores, setErrores] = useState({});

  const [datos, setDatos] = useState({
    esSocio:       '',
    situacion:     '',
    nombre:        '',
    celular:       '',
    localidad:     '',
    consentimiento: false,
  });

  useEffect(() => {
    setUtms(leerUTMs());
  }, []);

  // Scroll al top cuando cambia el paso
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [paso]);

  const elegir = (campo, valor) => {
    if (avanzando) return;
    setDatos(prev => ({ ...prev, [campo]: valor }));
    setAvanzando(true);
    setTimeout(() => {
      setPaso(p => p + 1);
      setAvanzando(false);
    }, 280);
  };

  const actualizar = (campo) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setDatos(prev => ({ ...prev, [campo]: val }));
    if (errores[campo]) setErrores(prev => ({ ...prev, [campo]: '' }));
  };

  const validar = () => {
    const errs = {};
    if (!datos.nombre.trim())
      errs.nombre = 'Ingresá tu nombre y apellido.';
    else if (!datos.nombre.trim().includes(' '))
      errs.nombre = 'Ingresá nombre y apellido separados por un espacio.';
    if (!datos.celular.trim())
      errs.celular = 'Ingresá tu número de celular.';
    else if (!celularValido(datos.celular))
      errs.celular = 'El número no parece válido. Ejemplo: 099 000 000';
    if (!datos.localidad.trim())
      errs.localidad = 'Ingresá tu localidad o departamento.';
    if (!datos.consentimiento)
      errs.consentimiento = 'Necesitás aceptar para poder continuar.';
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const enviar = async () => {
    if (!validar()) return;
    setCargando(true);
    setErrorEnvio('');

    const payload = {
      fecha:       new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' }),
      nombre:      datos.nombre.trim(),
      celular:     datos.celular.trim(),
      localidad:   datos.localidad.trim(),
      esSocio:     datos.esSocio,
      situacion:   datos.situacion,
      consentimiento: 'Sí',
      origen:      utms.origen   || 'Directo',
      utmSource:   utms.utmSource   || '',
      utmCampaign: utms.utmCampaign || '',
      utmAd:       utms.utmAd       || '',
      utmContent:  utms.utmContent  || '',
    };

    try {
      // Content-Type text/plain evita el preflight OPTIONS (CORS issue con Apps Script)
      await fetch(ENDPOINT, {
        method:   'POST',
        headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
        body:     JSON.stringify(payload),
        mode:     'no-cors',
      });
      setEnviado(true);
    } catch {
      setErrorEnvio('No pudimos guardar tu consulta. Por favor intentá nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (enviado) return <PantallaExito />;

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col items-center px-4 py-10">

      <Logo />

      {/* Intro */}
      <p className="mt-5 text-center text-slate-500 text-sm max-w-xs leading-relaxed">
        Te hacemos unas preguntas rápidas para derivarte con un asesor.
      </p>

      {/* Card */}
      <div className="mt-6 w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 px-6 py-7">

          <BarraProgreso paso={paso} />

          {/* ── Paso 0: ¿Es socio? ────────────────────────────────────── */}
          {paso === 0 && (
            <div key="paso0" className="step-in">
              <h1 className="text-xl font-bold text-slate-900 mb-1.5 leading-snug">
                ¿Sos socio/a de la Cooperativa de la Previsión Social?
              </h1>
              <p className="text-slate-400 text-sm mb-6">
                Elegí la opción que mejor describe tu situación.
              </p>
              <div className="flex flex-col gap-3">
                {['Sí', 'No'].map(op => (
                  <BtnOpcion
                    key={op}
                    label={op}
                    seleccionado={datos.esSocio === op}
                    onClick={() => elegir('esSocio', op)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Paso 1: Jubilado / Pensionista ────────────────────────── */}
          {paso === 1 && (
            <div key="paso1" className="step-in">
              <h1 className="text-xl font-bold text-slate-900 mb-1.5 leading-snug">
                ¿Sos jubilado/a o pensionista?
              </h1>
              <p className="text-slate-400 text-sm mb-6">
                Esta información ayuda al asesor a orientarte mejor.
              </p>
              <div className="flex flex-col gap-3">
                {['Jubilado/a', 'Pensionista'].map(op => (
                  <BtnOpcion
                    key={op}
                    label={op}
                    seleccionado={datos.situacion === op}
                    onClick={() => elegir('situacion', op)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Paso 2: Datos de contacto ─────────────────────────────── */}
          {paso === 2 && (
            <div key="paso2" className="step-in">
              <h1 className="text-xl font-bold text-slate-900 mb-1.5 leading-snug">
                ¿Cómo te contactamos?
              </h1>
              <p className="text-slate-400 text-sm mb-6">
                Un asesor se va a comunicar con vos para darte la información disponible.
              </p>

              <div className="flex flex-col gap-5">
                <CampoTexto
                  label="Nombre y apellido"
                  placeholder="Ej: María González"
                  value={datos.nombre}
                  onChange={actualizar('nombre')}
                  error={errores.nombre}
                />
                <CampoTexto
                  label="Celular"
                  type="tel"
                  inputMode="tel"
                  placeholder="Ej: 099 000 000"
                  value={datos.celular}
                  onChange={actualizar('celular')}
                  error={errores.celular}
                />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Localidad / Departamento</label>
                  <select
                    value={datos.localidad}
                    onChange={actualizar('localidad')}
                    className={`w-full border-2 rounded-xl px-4 py-3.5 text-base outline-none transition-colors appearance-none ${
                      errores.localidad
                        ? 'border-red-400 bg-red-50 text-slate-800'
                        : datos.localidad
                        ? 'border-slate-200 focus:border-sky-400 bg-white text-slate-800'
                        : 'border-slate-200 focus:border-sky-400 bg-white text-slate-400'
                    }`}
                  >
                    <option value="" disabled>Elegí tu departamento</option>
                    <option value="Montevideo">Montevideo</option>
                    <option value="San José">San José</option>
                    <option value="Canelones">Canelones</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errores.localidad && (
                    <p className="flex items-center gap-1.5 text-red-500 text-sm mt-1.5">
                      <AlertCircle size={13} className="shrink-0" />
                      {errores.localidad}
                    </p>
                  )}
                </div>

                {/* Consentimiento */}
                <div>
                  <label
                    className={`flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                      errores.consentimiento
                        ? 'border-red-300 bg-red-50'
                        : datos.consentimiento
                        ? 'border-sky-300 bg-sky-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={datos.consentimiento}
                      onChange={actualizar('consentimiento')}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-sky-600"
                    />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Acepto que Canselion SRL me contacte para brindarme información
                      sobre beneficios, requisitos y opciones disponibles vinculadas
                      a la cooperativa.
                    </span>
                  </label>
                  {errores.consentimiento && (
                    <p className="flex items-center gap-1.5 text-red-500 text-sm mt-1.5">
                      <AlertCircle size={13} className="shrink-0" />
                      {errores.consentimiento}
                    </p>
                  )}
                </div>
              </div>

              {/* Error de envío */}
              {errorEnvio && (
                <div className="mt-5 flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="shrink-0" />
                  <p className="text-sm leading-snug">{errorEnvio}</p>
                </div>
              )}

              <button
                type="button"
                onClick={enviar}
                disabled={cargando}
                className="mt-6 w-full bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg shadow-sky-100"
              >
                {cargando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar consulta'
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-3 leading-relaxed">
                Tus datos serán utilizados únicamente para responder tu consulta.
              </p>
            </div>
          )}
        </div>

        {/* Botón volver */}
        {paso > 0 && (
          <button
            type="button"
            onClick={() => setPaso(p => p - 1)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm py-2.5 transition-colors"
          >
            <ChevronLeft size={15} />
            Volver
          </button>
        )}
      </div>

      {/* Pie */}
      <p className="mt-10 text-slate-400 text-xs text-center max-w-xs leading-relaxed">
        Esta página es propiedad de Canselion SRL. Los datos ingresados son
        confidenciales y se utilizan exclusivamente para brindar información
        sobre la cooperativa.
      </p>
    </div>
  );
}
