"use client";

import { useEffect, useRef, useState } from "react";
import { ParticleField } from "../lib/particles";

export default function ParticleHero({ image }: { image: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<ParticleField | null>(null);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [used, setUsed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let field: ParticleField;
    try {
      field = new ParticleField(canvas, image);
    } catch {
      return; // no 2D canvas: the heading below still tells the story
    }
    fieldRef.current = field;
    let alive = true;
    field.init().then(() => alive && setReady(true));

    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => field.setReducedMotion(mqMotion.matches);
    onMotion();
    mqMotion.addEventListener("change", onMotion);

    const mqDark = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => field.refreshColors();
    mqDark.addEventListener("change", onScheme);

    const io = new IntersectionObserver(([e]) => field.setVisible(e.isIntersecting));
    io.observe(wrap);

    let first = true;
    let timer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      clearTimeout(timer);
      if (first) {
        first = false;
        field.resize(width, height, dpr);
      } else {
        timer = setTimeout(() => field.resize(width, height, dpr), 120);
      }
    });
    ro.observe(wrap);

    return () => {
      alive = false;
      clearTimeout(timer);
      ro.disconnect();
      io.disconnect();
      mqMotion.removeEventListener("change", onMotion);
      mqDark.removeEventListener("change", onScheme);
      field.destroy();
      fieldRef.current = null;
    };
  }, [image]);

  const local = (e: React.PointerEvent | React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, r };
  };

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const field = fieldRef.current;
    if (!field || !ready) return;
    const next = !revealed;
    const { x, y, r } = local(e);
    // Keyboard activation reports (0, 0); ripple from the center instead.
    const fromKeyboard = e.detail === 0;
    field.setMode(next ? 1 : 0, fromKeyboard ? r.width / 2 : x, fromKeyboard ? r.height / 2 : y);
    setRevealed(next);
    setUsed(true);
  };

  return (
    <div className="w-full">
      <div ref={wrapRef} className="relative h-[clamp(300px,58vh,620px)] w-full">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <button
          type="button"
          aria-label="Reveal image"
          aria-pressed={revealed}
          disabled={!ready}
          onClick={toggle}
          onPointerMove={(e) => {
            const { x, y } = local(e);
            fieldRef.current?.setPointer(x, y);
          }}
          onPointerLeave={() => fieldRef.current?.clearPointer()}
          onPointerCancel={() => fieldRef.current?.clearPointer()}
          onPointerUp={(e) => e.pointerType === "touch" && fieldRef.current?.clearPointer()}
          className="absolute inset-0 cursor-pointer rounded-2xl outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-default"
        />
      </div>
      <p
        aria-hidden="true"
        className={`mt-1 h-4 select-none text-center text-xs tracking-widest text-muted uppercase transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        } ${used ? "" : "animate-pulse"}`}
      >
        {revealed ? "Click to go back" : "Click to reveal"}
      </p>
    </div>
  );
}
