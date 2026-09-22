"use client";

import { useEffect, useRef } from "react";
import { ParticleField } from "../lib/particles";

export default function ParticleHero({ image }: { image: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<ParticleField | null>(null);

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
    field.init().then(() => {
      if (!alive) return;
      const bounds = wrap.getBoundingClientRect();
      field.setMode(1, bounds.width / 2, bounds.height / 2);
    });

    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => field.setReducedMotion(mqMotion.matches);
    onMotion();
    mqMotion.addEventListener("change", onMotion);

    const mqDark = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => field.refreshColors();
    mqDark.addEventListener("change", onScheme);

    const io = new IntersectionObserver(([e]) =>
      field.setVisible(e.isIntersecting),
    );
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

  return (
    <div
      className="relative aspect-4/5 w-full max-w-md overflow-hidden bg-background"
      onPointerMove={(event) => {
        if (event.pointerType === "touch") {
          fieldRef.current?.clearPointer();
          return;
        }
        const bounds = event.currentTarget.getBoundingClientRect();
        fieldRef.current?.setPointer(
          event.clientX - bounds.left,
          event.clientY - bounds.top,
        );
      }}
      onPointerLeave={() => fieldRef.current?.clearPointer()}
      onPointerCancel={() => fieldRef.current?.clearPointer()}
    >
      <div ref={wrapRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
