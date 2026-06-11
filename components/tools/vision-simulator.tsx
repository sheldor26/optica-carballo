'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { ScanLine } from 'lucide-react';
import {
  binocularView,
  computeEyeBlur,
  formatDiopters,
  isCompensatingHyperope,
  usableAccommodation,
  NEAR_DEMAND_D,
  type AgeBand,
  type EyeBlur,
  type EyeRx,
} from '@/lib/vision-sim/optics';

/**
 * Simulador de visión según receta — 100% client-side, 0 llamadas a IA.
 * La física vive en lib/vision-sim/optics.ts (validada por optical-expert).
 * El render usa feGaussianBlur direccional con el truco rotar → blurear →
 * contra-rotar (SVG solo blurea en ejes del elemento).
 */

type SceneId = 'lejos' | 'cerca' | 'noche';
type EyeView = 'ambos' | 'OD' | 'OI';

const SCENES: { id: SceneId; label: string; demand: number; nightFactor: number }[] = [
  { id: 'lejos', label: 'De lejos (día)', demand: 0, nightFactor: 1 },
  { id: 'cerca', label: 'De cerca', demand: NEAR_DEMAND_D, nightFactor: 1 },
  // Pupila dilatada de noche → disco de desenfoque mayor con el mismo error.
  { id: 'noche', label: 'De noche', demand: 0, nightFactor: 1.7 },
];

/**
 * Intensidad del blur como % del ANCHO del viewport por dioptría — en px fijos
 * el efecto desaparecía en pantallas grandes (bug reportado por el founder
 * 2026-06-11: "se ve igual con y sin anteojos").
 */
const DEFAULT_K_PCT_PER_D = 0.6;

const EXAMPLE_OD: EyeRx = { sphere: -1.5, cylinder: -0.75, axis: 20 };
const EXAMPLE_OI: EyeRx = { sphere: -2, cylinder: -0.5, axis: 160 };
const ZERO_RX: EyeRx = { sphere: 0, cylinder: 0, axis: 0 };

function range(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  for (let v = from; step > 0 ? v <= to + 1e-9 : v >= to - 1e-9; v += step) {
    out.push(Math.round(v * 100) / 100);
  }
  return out;
}

const SPHERE_OPTIONS = range(6, -10, -0.25);
const CYL_OPTIONS = range(0, -4, -0.25);
const ADD_OPTIONS = range(0.75, 3.25, 0.25);

export function VisionSimulator() {
  const [od, setOd] = useState<EyeRx>(EXAMPLE_OD);
  const [oi, setOi] = useState<EyeRx>(EXAMPLE_OI);
  const [add, setAdd] = useState(0);
  const [ageBand, setAgeBand] = useState<AgeBand>('unknown');
  const [sceneId, setSceneId] = useState<SceneId>('lejos');
  const [eyeView, setEyeView] = useState<EyeView>('ambos');
  const [corrected, setCorrected] = useState(false);
  const [kPctPerD, setKPctPerD] = useState(DEFAULT_K_PCT_PER_D);

  // El blur escala con el ancho real del viewport (px fijos = invisible en desktop).
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(700);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.clientWidth || 700);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scene = SCENES.find((s) => s.id === sceneId)!;
  const usable = usableAccommodation(add, ageBand);
  const blurOd = computeEyeBlur(od, scene.demand, usable);
  const blurOi = computeEyeBlur(oi, scene.demand, usable);

  let activeRx: EyeRx;
  let activeBlur: EyeBlur;
  let dominantEye: 'OD' | 'OI' | null = null;
  if (eyeView === 'OD') {
    activeRx = od;
    activeBlur = blurOd;
  } else if (eyeView === 'OI') {
    activeRx = oi;
    activeBlur = blurOi;
  } else {
    const best = binocularView(blurOd, blurOi);
    dominantEye = best.eye;
    activeRx = best.eye === 'OD' ? od : oi;
    activeBlur = best.blur;
  }

  const kEff = (kPctPerD / 100) * viewportWidth * scene.nightFactor;
  const sigmaAxis = corrected ? 0 : kEff * activeBlur.e1;
  const sigmaPerp = corrected ? 0 : kEff * activeBlur.e2;
  const diff = Math.abs(activeBlur.e1 - activeBlur.e2);
  const ghostPx = corrected ? 0 : kEff * diff * 1.3;
  const ghostAngle = activeBlur.e2 > activeBlur.e1 ? activeRx.axis + 90 : activeRx.axis;
  const contrast = corrected ? 1 : 1 - Math.min(0.4, 0.07 * activeBlur.total);

  const compensating =
    !corrected && isCompensatingHyperope(activeRx, activeBlur, scene.demand);
  const sharp = corrected || activeBlur.total < 0.01;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Selector de escena */}
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Escena">
        {SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === sceneId}
            onClick={() => setSceneId(s.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              s.id === sceneId
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Viewport */}
      <div className="mt-4" ref={viewportRef}>
        <BlurredViewport
          axisDeg={activeRx.axis}
          sigmaAxisPx={sigmaAxis}
          sigmaPerpPx={sigmaPerp}
          ghostPx={ghostPx}
          ghostAngleDeg={ghostAngle}
          contrast={contrast}
        >
          {sceneId === 'lejos' && <SceneFar />}
          {sceneId === 'cerca' && <SceneNear />}
          {sceneId === 'noche' && <SceneNight />}
        </BlurredViewport>

        {/* Toggle sin/con anteojos */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={!corrected}
            onClick={() => setCorrected(false)}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              !corrected
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Sin anteojos
          </button>
          <button
            type="button"
            aria-pressed={corrected}
            onClick={() => setCorrected(true)}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              corrected
                ? 'border-brand bg-brand text-white'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Con anteojos
          </button>
        </div>

        {/* Estado / notas honestas */}
        <div className="text-muted-foreground mt-3 space-y-1.5 text-center text-sm" aria-live="polite">
          {eyeView === 'ambos' && dominantEye && (
            <p>
              Vista con los dos ojos: domina tu mejor ojo ({dominantEye}).
              {!sharp && ` Desenfoque ≈ ${formatDiopters(activeBlur.total).replace('−', '')} D.`}
            </p>
          )}
          {eyeView !== 'ambos' && !sharp && (
            <p>
              {eyeView}: desenfoque ≈ {formatDiopters(activeBlur.total).replace('−', '')} D.
            </p>
          )}
          {compensating && (
            <p className="text-foreground">
              Ves nítido porque compensás <strong>acomodando</strong> (esfuerzo del
              músculo ciliar): es la hipermetropía. Suele traer fatiga visual y dolor
              de cabeza al final del día.
            </p>
          )}
          {sharp && !compensating && !corrected && sceneId === 'cerca' && activeRx.sphere < 0 && (
            <p className="text-foreground">
              Nítido de cerca <strong>sin anteojos</strong> — no es un error: es la
              &ldquo;ventaja&rdquo; del miope, tu ojo ya enfoca a esta distancia.
              Cambiá a <strong>De lejos</strong> o <strong>De noche</strong> para ver
              tu dificultad real.
            </p>
          )}
          {sharp && !compensating && !corrected && !(sceneId === 'cerca' && activeRx.sphere < 0) && (
            <p>Con estos valores y a esta distancia, verías nítido sin corrección.</p>
          )}
        </div>
      </div>

      {/* Receta */}
      <div className="border-border/60 bg-background mt-8 rounded-xl border p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wide">
            Tu receta
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setOd(EXAMPLE_OD);
                setOi(EXAMPLE_OI);
              }}
              className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
            >
              Ejemplo
            </button>
            <button
              type="button"
              onClick={() => {
                setOd(ZERO_RX);
                setOi(ZERO_RX);
                setAdd(0);
              }}
              className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
            >
              Todo en cero
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <EyeInputs label="OD (ojo derecho)" rx={od} onChange={setOd} />
          <EyeInputs label="OI (ojo izquierdo)" rx={oi} onChange={setOi} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-muted-foreground text-xs font-medium">ADD (cerca)</span>
            <select
              value={add}
              onChange={(e) => setAdd(Number(e.target.value))}
              className="border-border bg-background mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
            >
              <option value={0}>Sin ADD</option>
              {ADD_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {formatDiopters(v)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-muted-foreground text-xs font-medium">
              Edad (opcional, si no tenés ADD)
            </span>
            <select
              value={ageBand}
              onChange={(e) => setAgeBand(e.target.value as AgeBand)}
              className="border-border bg-background mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
            >
              <option value="unknown">Prefiero no decir</option>
              <option value="lt40">Menos de 40</option>
              <option value="40to49">40 a 49</option>
              <option value="50to59">50 a 59</option>
              <option value="60plus">60 o más</option>
            </select>
          </label>
        </div>

        {/* Vista por ojo */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium">Mostrar:</span>
          {(['ambos', 'OD', 'OI'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={eyeView === v}
              onClick={() => setEyeView(v)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                eyeView === v
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {v === 'ambos' ? 'Ambos ojos' : v}
            </button>
          ))}
        </div>

        <Link
          href="/lector-de-receta"
          className="text-brand mt-5 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          <ScanLine className="size-4" />
          ¿Tenés la receta en papel? Leela automáticamente con el lector
        </Link>

        {/* Calibración fina (para ajustar el realismo contra una receta conocida) */}
        <details className="border-border/60 mt-5 border-t pt-4">
          <summary className="text-muted-foreground cursor-pointer text-xs">
            Ajuste fino del realismo
          </summary>
          <label className="mt-3 block">
            <span className="text-muted-foreground text-xs">
              Intensidad del desenfoque: {(kPctPerD / DEFAULT_K_PCT_PER_D).toFixed(1)}×
            </span>
            <input
              type="range"
              min={0.15}
              max={2}
              step={0.05}
              value={kPctPerD}
              onChange={(e) => setKPctPerD(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </label>
          <p className="text-muted-foreground mt-2 text-xs">
            Si conocés tu receta, calibrá este control hasta que la simulación se
            parezca a cómo ves vos sin anteojos.
          </p>
        </details>
      </div>
    </div>
  );
}

function EyeInputs({
  label,
  rx,
  onChange,
}: {
  label: string;
  rx: EyeRx;
  onChange: (rx: EyeRx) => void;
}) {
  return (
    <fieldset className="border-border/60 rounded-lg border p-3">
      <legend className="text-foreground px-1 text-xs font-semibold">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-muted-foreground text-xs">Esfera</span>
          <select
            value={rx.sphere}
            onChange={(e) => onChange({ ...rx, sphere: Number(e.target.value) })}
            className="border-border bg-background mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
          >
            {SPHERE_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v === 0 ? '0.00' : formatDiopters(v)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-muted-foreground text-xs">Cilindro</span>
          <select
            value={rx.cylinder}
            onChange={(e) => onChange({ ...rx, cylinder: Number(e.target.value) })}
            className="border-border bg-background mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
          >
            {CYL_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v === 0 ? 'Sin cilindro' : formatDiopters(v)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={`mt-2 block ${rx.cylinder === 0 ? 'opacity-40' : ''}`}>
        <span className="text-muted-foreground text-xs">Eje: {rx.axis}°</span>
        <input
          type="range"
          min={0}
          max={180}
          step={5}
          value={rx.axis}
          disabled={rx.cylinder === 0}
          onChange={(e) => onChange({ ...rx, axis: Number(e.target.value) })}
          className="mt-1 w-full"
        />
      </label>
    </fieldset>
  );
}

/**
 * Viewport con desenfoque gaussiano DIRECCIONAL orientado según el eje TABO.
 * SVG solo blurea en los ejes del elemento → rotamos un contenedor overscan
 * según el eje, bluereamos, y contra-rotamos el contenido. La escena se dibuja
 * en un canvas cuadrado con el contenido centrado (el overscan recorta bordes).
 * La "imagen fantasma" del astigmatismo es una segunda copia desplazada a lo
 * largo del meridiano más desenfocado (optical-expert: ES el efecto que el
 * astígmata reconoce).
 */
function BlurredViewport({
  axisDeg,
  sigmaAxisPx,
  sigmaPerpPx,
  ghostPx,
  ghostAngleDeg,
  contrast,
  children,
}: {
  axisDeg: number;
  sigmaAxisPx: number;
  sigmaPerpPx: number;
  ghostPx: number;
  ghostAngleDeg: number;
  contrast: number;
  children: React.ReactNode;
}) {
  const rawId = useId();
  const filterId = `vsim-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const blurred = sigmaAxisPx > 0.05 || sigmaPerpPx > 0.05;
  const showGhost = ghostPx > 2.5;
  const ghostRad = (ghostAngleDeg * Math.PI) / 180;
  const ghostDx = Math.cos(ghostRad) * ghostPx;
  const ghostDy = Math.sin(ghostRad) * ghostPx;

  return (
    <div
      className="border-border relative aspect-[3/2] w-full overflow-hidden rounded-xl border bg-zinc-900"
      style={{ filter: contrast < 0.999 ? `contrast(${contrast.toFixed(3)})` : undefined }}
    >
      <svg aria-hidden="true" className="absolute size-0">
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur
            stdDeviation={`${sigmaAxisPx.toFixed(2)} ${sigmaPerpPx.toFixed(2)}`}
          />
        </filter>
      </svg>
      {/* Overscan generoso: al rotar por el eje no quedan esquinas vacías. */}
      <div
        className="absolute"
        style={{
          top: '-60%',
          bottom: '-60%',
          left: '-35%',
          right: '-35%',
          transform: `rotate(${axisDeg}deg)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={blurred ? { filter: `url(#${filterId})` } : undefined}
        >
          <div
            className="absolute inset-0"
            style={{ transform: `rotate(${-axisDeg}deg)` }}
          >
            <div className="absolute inset-0">{children}</div>
            {showGhost && (
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-35"
                style={{ transform: `translate(${ghostDx.toFixed(1)}px, ${ghostDy.toFixed(1)}px)` }}
              >
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== Escenas ===================================
 * Canvas cuadrado 900×900, preserveAspectRatio slice. Por el overscan del
 * viewport, lo visible es aprox la franja central x 180–720 / y 280–620:
 * todo el contenido importante va ahí. Sintéticas a propósito (V1): el
 * founder valida la física primero; fotos reales se enchufan después.
 * ========================================================================= */

const SCENE_SVG_PROPS = {
  viewBox: '0 0 900 900',
  preserveAspectRatio: 'xMidYMid slice',
  className: 'absolute inset-0 h-full w-full',
  'aria-hidden': true,
} as const;

/** Lejos, de día: cartel con letras a la distancia (test clásico). */
function SceneFar() {
  return (
    <svg {...SCENE_SVG_PROPS}>
      <rect width="900" height="900" fill="#bfdbf3" />
      <rect y="540" width="900" height="360" fill="#9aa78f" />
      {/* Edificios al fondo */}
      <rect x="150" y="420" width="90" height="130" fill="#8e9aa6" />
      <rect x="630" y="400" width="110" height="150" fill="#7d8894" />
      <rect x="760" y="440" width="70" height="110" fill="#97a2ad" />
      {/* Sol */}
      <circle cx="680" cy="330" r="28" fill="#fde68a" />
      {/* Ruta */}
      <polygon points="380,900 520,900 470,560 430,560" fill="#6b7280" />
      <rect x="448" y="600" width="6" height="40" fill="#e5e7eb" />
      <rect x="447" y="680" width="8" height="55" fill="#e5e7eb" />
      <rect x="445" y="780" width="10" height="70" fill="#e5e7eb" />
      {/* Cartel con letras (lo que mira el test) */}
      <rect x="270" y="350" width="280" height="190" rx="8" fill="#fafaf7" stroke="#3f3f46" strokeWidth="4" />
      <rect x="395" y="540" width="14" height="80" fill="#52525b" />
      <text x="410" y="425" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="58" fill="#27272a">
        E F P
      </text>
      <text x="410" y="472" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="32" fill="#3f3f46">
        T O Z L P
      </text>
      <text x="410" y="510" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="19" fill="#52525b">
        L P E D P E C F D
      </text>
    </svg>
  );
}

/** De cerca (~40 cm): un menú en la mano. Presbicia y ADD viven acá. */
function SceneNear() {
  return (
    <svg {...SCENE_SVG_PROPS}>
      <rect width="900" height="900" fill="#7a6a58" />
      <rect x="225" y="265" width="450" height="380" rx="14" fill="#fefdf8" stroke="#d6d3d1" strokeWidth="2" />
      <text x="450" y="330" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="42" fill="#1c1917">
        MENÚ
      </text>
      <line x1="280" y1="350" x2="620" y2="350" stroke="#a8a29e" strokeWidth="2" />
      {[
        ['Café con leche', '$3.500', 395],
        ['Medialunas (x3)', '$2.800', 440],
        ['Tostado mixto', '$6.200', 485],
        ['Jugo de naranja', '$3.900', 530],
      ].map(([item, price, y]) => (
        <g key={item as string}>
          <text x="285" y={y as number} fontFamily="system-ui, sans-serif" fontSize="24" fill="#292524">
            {item}
          </text>
          <text x="615" y={y as number} textAnchor="end" fontFamily="system-ui, sans-serif" fontSize="24" fill="#292524">
            {price}
          </text>
        </g>
      ))}
      <text x="450" y="590" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="15" fill="#78716c">
        Precios con IVA incluido · Aceptamos todas las tarjetas
      </text>
      <text x="450" y="615" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#a8a29e">
        Consultá por opciones sin TACC y menú vegetariano
      </text>
    </svg>
  );
}

/**
 * De noche: luces puntuales. Capa de luces separada en blend "screen" —
 * optical-expert: el blur sobre la foto apaga las luces; separadas en screen,
 * el desenfoque las ESTIRA (los rayos/halos que el astígmata reconoce).
 */
function SceneNight() {
  return (
    <>
      <svg {...SCENE_SVG_PROPS}>
        <rect width="900" height="900" fill="#0b1023" />
        {/* Edificios oscuros */}
        <rect x="160" y="370" width="130" height="260" fill="#171c33" />
        <rect x="600" y="340" width="150" height="290" fill="#131830" />
        <rect x="330" y="420" width="100" height="210" fill="#1a2038" />
        {/* Calle */}
        <rect y="630" width="900" height="270" fill="#10142a" />
        <polygon points="390,900 510,900 472,630 428,630" fill="#181d36" />
        {/* Auto de frente (silueta) */}
        <rect x="398" y="560" width="104" height="52" rx="14" fill="#0e1228" />
        {/* Semáforo (estructura) */}
        <rect x="282" y="380" width="36" height="96" rx="8" fill="#0a0d1f" />
        <rect x="296" y="476" width="8" height="150" fill="#0a0d1f" />
      </svg>
      <svg {...SCENE_SVG_PROPS} style={{ mixBlendMode: 'screen' }}>
        {/* Luna */}
        <circle cx="660" cy="300" r="22" fill="#f5f3e7" />
        {/* Ventanas iluminadas */}
        {[
          [180, 395], [215, 395], [250, 395], [180, 445], [250, 445], [215, 495],
          [620, 365], [655, 365], [690, 365], [620, 415], [690, 415], [655, 465], [620, 515],
          [350, 445], [385, 445], [350, 495],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="18" height="24" rx="2" fill="#ffd47e" opacity="0.9" />
        ))}
        {/* Semáforo en rojo */}
        <circle cx="300" cy="400" r="11" fill="#ff4d4d" />
        {/* Faros del auto */}
        <circle cx="420" cy="586" r="12" fill="#fff7d6" />
        <circle cx="480" cy="586" r="12" fill="#fff7d6" />
        {/* Farolas */}
        <circle cx="120" cy="430" r="9" fill="#ffe9b0" />
        <circle cx="790" cy="410" r="9" fill="#ffe9b0" />
      </svg>
    </>
  );
}
