// Canvas 2D particle engine for the hero: particles form "SK", then flow into an
// image on click. Framework-free; ParticleHero.tsx owns the DOM and observers.

export const CONFIG = {
  text: "SK",
  textWeight: 800,
  springK: 0.03,
  friction: 0.82, // per 60fps frame
  repelRadius: 90, // css px
  repelForce: 2.2,
  staggerMs: 700, // ripple duration from the click point to the farthest particle
  kick: 5, // outward burst when a particle switches target
  shimmer: 1.1, // idle wobble in px
  colorLerp: 0.07,
  dotSize: 1.7, // css px
  jitter: 0.35, // sample position jitter, fraction of grid step
  nearWhite: 245, // image pixels lighter than this on all channels are treated as background
} as const;

type Pt = { x: number; y: number; r: number; g: number; b: number };
type Rgb = [number, number, number];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const gridStep = (w: number) => clamp(Math.round(w / 180), 3, 6);
const maxParticles = (w: number) => (w < 600 ? 4500 : 7500);

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
}

function readCssColor(name: string, fallback: Rgb): Rgb {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!raw) return fallback;
    const { ctx } = makeCanvas(1, 1);
    ctx.fillStyle = raw;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  } catch {
    return fallback;
  }
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function sampleMask(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  step: number,
  skipNearWhite: boolean,
): Pt[] {
  const data = ctx.getImageData(0, 0, Math.round(w), Math.round(h)).data;
  const W = Math.round(w);
  const H = Math.round(h);
  const out: Pt[] = [];
  const j = step * CONFIG.jitter;
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const o = (Math.floor(y) * W + Math.floor(x)) * 4;
      if (data[o + 3] < 128) continue;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      if (skipNearWhite && r > CONFIG.nearWhite && g > CONFIG.nearWhite && b > CONFIG.nearWhite) continue;
      out.push({
        x: x + (Math.random() - 0.5) * 2 * j,
        y: y + (Math.random() - 0.5) * 2 * j,
        r,
        g,
        b,
      });
    }
  }
  return out;
}

function sampleText(w: number, h: number, step: number, family: string): Pt[] {
  const { ctx } = makeCanvas(w, h);
  const font = (size: number) => `${CONFIG.textWeight} ${size}px ${family}`;
  ctx.font = font(100);
  const m = ctx.measureText(CONFIG.text);
  const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const inkH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const size = Math.min((w * 0.78) / inkW, (h * 0.86) / inkH) * 100;
  ctx.font = font(size);
  const k = size / 100;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#000";
  ctx.fillText(
    CONFIG.text,
    (w - inkW * k) / 2 + m.actualBoundingBoxLeft * k,
    (h - inkH * k) / 2 + m.actualBoundingBoxAscent * k,
  );
  return sampleMask(ctx, w, h, step, false);
}

function sampleImage(img: HTMLImageElement, w: number, h: number, step: number): Pt[] {
  const { ctx } = makeCanvas(w, h);
  const iw = img.naturalWidth || 600;
  const ih = img.naturalHeight || 600;
  const scale = Math.min((w * 0.9) / iw, (h * 0.94) / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return sampleMask(ctx, w, h, step, true);
}

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Cull or duplicate (with a little jitter) so the list has exactly n points.
function resample(pts: Pt[], n: number, step: number): Pt[] {
  if (pts.length >= n) return shuffle(pts.slice()).slice(0, n);
  const out = pts.slice();
  while (out.length < n) {
    const p = pts[Math.floor(Math.random() * pts.length)];
    out.push({ ...p, x: p.x + (Math.random() - 0.5) * step, y: p.y + (Math.random() - 0.5) * step });
  }
  return out;
}

// Sorting both lists left-to-right makes the morph read as a sweep, not a tangle.
function sortByX(pts: Pt[], step: number): Pt[] {
  return pts
    .map((p) => ({ p, k: p.x + (Math.random() - 0.5) * step * 6 }))
    .sort((a, b) => a.k - b.k)
    .map((e) => e.p);
}

export class ParticleField {
  private ctx: CanvasRenderingContext2D;
  private family = "sans-serif";
  private img: HTMLImageElement | null = null;
  private assetsReady = false;
  private destroyed = false;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private oldW = 0; // size at the last build, to rescale positions on resize
  private oldH = 0;
  private W = 0; // backing-store size
  private H = 0;
  private dot = 2;
  private imageData: ImageData | null = null;
  private buf: Uint32Array | null = null;

  private n = 0;
  private pos = new Float32Array(0);
  private vel = new Float32Array(0);
  private sk = new Float32Array(0);
  private im = new Float32Array(0);
  private skCol = new Uint8Array(0);
  private imCol = new Uint8Array(0);
  private col = new Float32Array(0);
  private tone = new Float32Array(0);
  private phase = new Float32Array(0);
  private want = new Uint8Array(0);
  private trig = new Float64Array(0);

  private accent: Rgb = [37, 99, 235];
  private mode: 0 | 1 = 0;
  private mx = 0;
  private my = 0;
  private mActive = false;

  private visible = true;
  private reduced = false;
  private running = false;
  private raf = 0;
  private last = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private imageUrl: string,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas unavailable");
    this.ctx = ctx;
    document.addEventListener("visibilitychange", this.update);
  }

  async init() {
    const family = getComputedStyle(document.body).fontFamily || "sans-serif";
    try {
      await document.fonts.load(`${CONFIG.textWeight} 100px ${family}`, CONFIG.text);
    } catch {
      // fall through to whatever font is available
    }
    this.img = await loadImage(this.imageUrl);
    if (this.destroyed) return;
    this.family = family;
    this.accent = readCssColor("--accent", this.accent);
    this.assetsReady = true;
    this.build();
  }

  destroy() {
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.raf);
    document.removeEventListener("visibilitychange", this.update);
  }

  resize(w: number, h: number, dpr: number) {
    if (w < 2 || h < 2) return;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.W = Math.round(w * dpr);
    this.H = Math.round(h * dpr);
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.dot = Math.max(2, Math.round(CONFIG.dotSize * dpr));
    this.imageData = this.ctx.createImageData(this.W, this.H);
    this.buf = new Uint32Array(this.imageData.data.buffer);
    this.build();
  }

  refreshColors() {
    this.accent = readCssColor("--accent", this.accent);
    for (let i = 0; i < this.n; i++) this.setSkColor(i);
    if (this.reduced) this.snap();
  }

  setVisible(v: boolean) {
    this.visible = v;
    this.update();
  }

  setReducedMotion(v: boolean) {
    this.reduced = v;
    if (v) this.snap();
    this.update();
  }

  setPointer(x: number, y: number) {
    this.mx = x;
    this.my = y;
    this.mActive = true;
  }

  clearPointer() {
    this.mActive = false;
  }

  // Send every particle to the other shape, rippling outward from (cx, cy).
  setMode(mode: 0 | 1, cx = this.w / 2, cy = this.h / 2) {
    this.mode = mode;
    if (this.reduced) {
      this.snap();
      return;
    }
    const now = performance.now();
    let maxD = 1;
    const d = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) {
      d[i] = Math.hypot(this.pos[i * 2] - cx, this.pos[i * 2 + 1] - cy);
      if (d[i] > maxD) maxD = d[i];
    }
    for (let i = 0; i < this.n; i++) this.trig[i] = now + (CONFIG.staggerMs * d[i]) / maxD;
  }

  private setSkColor(i: number) {
    const t = this.tone[i];
    this.skCol[i * 3] = this.accent[0] * t;
    this.skCol[i * 3 + 1] = this.accent[1] * t;
    this.skCol[i * 3 + 2] = this.accent[2] * t;
  }

  private build() {
    if (!this.assetsReady || this.w < 2 || this.h < 2 || this.destroyed) return;
    const step = gridStep(this.w);
    const skPts = sampleText(this.w, this.h, step, this.family);
    let imPts = this.img ? sampleImage(this.img, this.w, this.h, step) : [];
    if (imPts.length === 0) imPts = skPts; // image failed to load: morph is a no-op
    if (skPts.length === 0) return;

    const n = Math.min(Math.max(skPts.length, imPts.length), maxParticles(this.w));
    const sk = sortByX(resample(skPts, n, step), step);
    const im = sortByX(resample(imPts, n, step), step);

    const old = { n: this.n, pos: this.pos, vel: this.vel, col: this.col, want: this.want };
    const sx = this.oldW ? this.w / this.oldW : 1;
    const sy = this.oldH ? this.h / this.oldH : 1;

    this.n = n;
    this.pos = new Float32Array(n * 2);
    this.vel = new Float32Array(n * 2);
    this.sk = new Float32Array(n * 2);
    this.im = new Float32Array(n * 2);
    this.skCol = new Uint8Array(n * 3);
    this.imCol = new Uint8Array(n * 3);
    this.col = new Float32Array(n * 3);
    this.tone = new Float32Array(n);
    this.phase = new Float32Array(n);
    this.want = new Uint8Array(n);
    this.trig = new Float64Array(n);

    for (let i = 0; i < n; i++) {
      this.sk[i * 2] = sk[i].x;
      this.sk[i * 2 + 1] = sk[i].y;
      this.im[i * 2] = im[i].x;
      this.im[i * 2 + 1] = im[i].y;
      this.imCol[i * 3] = im[i].r;
      this.imCol[i * 3 + 1] = im[i].g;
      this.imCol[i * 3 + 2] = im[i].b;
      this.tone[i] = 0.7 + Math.random() * 0.3;
      this.phase[i] = Math.random() * Math.PI * 2;
      this.setSkColor(i);
      if (i < old.n) {
        // Resize: keep where particles are so the animation doesn't reset.
        this.pos[i * 2] = old.pos[i * 2] * sx;
        this.pos[i * 2 + 1] = old.pos[i * 2 + 1] * sy;
        this.vel[i * 2] = old.vel[i * 2];
        this.vel[i * 2 + 1] = old.vel[i * 2 + 1];
        this.col.set(old.col.subarray(i * 3, i * 3 + 3), i * 3);
        this.want[i] = old.want[i];
      } else {
        // First build: start scattered and assemble into the letters.
        this.pos[i * 2] = Math.random() * this.w;
        this.pos[i * 2 + 1] = Math.random() * this.h;
        this.col.set(this.skCol.subarray(i * 3, i * 3 + 3), i * 3);
        this.want[i] = this.mode;
      }
    }
    this.oldW = this.w;
    this.oldH = this.h;

    if (this.reduced) this.snap();
    this.update();
  }

  // Jump straight to the current shape (reduced motion) and draw once.
  private snap() {
    for (let i = 0; i < this.n; i++) {
      const tgt = this.mode ? this.im : this.sk;
      const c = this.mode ? this.imCol : this.skCol;
      this.pos[i * 2] = tgt[i * 2];
      this.pos[i * 2 + 1] = tgt[i * 2 + 1];
      this.vel[i * 2] = this.vel[i * 2 + 1] = 0;
      this.col[i * 3] = c[i * 3];
      this.col[i * 3 + 1] = c[i * 3 + 1];
      this.col[i * 3 + 2] = c[i * 3 + 2];
      this.want[i] = this.mode;
    }
    this.draw();
  }

  private update = () => {
    const should = this.visible && !document.hidden && !this.reduced && this.n > 0 && !this.destroyed;
    if (should && !this.running) {
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else if (!should && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  };

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(2.5, (now - this.last) / 16.667);
    this.last = now;
    this.step(now, dt);
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  private step(now: number, dt: number) {
    const { n, pos, vel, sk, im, col, skCol, imCol, want, trig, phase, mode } = this;
    const damp = Math.pow(CONFIG.friction, dt);
    const k = CONFIG.springK * dt;
    const t = now * 0.0015;
    const R = CONFIG.repelRadius;
    const R2 = R * R;
    const lerp = 1 - Math.pow(1 - CONFIG.colorLerp, dt);
    const { mx, my, mActive } = this;

    for (let i = 0; i < n; i++) {
      const i2 = i * 2;
      const i3 = i * 3;

      if (want[i] !== mode && now >= trig[i]) {
        want[i] = mode;
        const a = Math.random() * Math.PI * 2;
        const s = CONFIG.kick * (0.4 + Math.random() * 0.6);
        vel[i2] += Math.cos(a) * s;
        vel[i2 + 1] += Math.sin(a) * s;
      }

      const tgt = want[i] ? im : sk;
      const tx = tgt[i2] + Math.cos(t + phase[i]) * CONFIG.shimmer;
      const ty = tgt[i2 + 1] + Math.sin(t * 1.3 + phase[i]) * CONFIG.shimmer;
      let x = pos[i2];
      let y = pos[i2 + 1];
      let ax = (tx - x) * k;
      let ay = (ty - y) * k;

      if (mActive) {
        const dx = x - mx;
        const dy = y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * CONFIG.repelForce * dt;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
        }
      }

      const vx = (vel[i2] + ax) * damp;
      const vy = (vel[i2 + 1] + ay) * damp;
      vel[i2] = vx;
      vel[i2 + 1] = vy;
      x += vx * dt;
      y += vy * dt;
      pos[i2] = x;
      pos[i2 + 1] = y;

      const c = want[i] ? imCol : skCol;
      col[i3] += (c[i3] - col[i3]) * lerp;
      col[i3 + 1] += (c[i3 + 1] - col[i3 + 1]) * lerp;
      col[i3 + 2] += (c[i3 + 2] - col[i3 + 2]) * lerp;
    }
  }

  private draw() {
    const { buf, imageData, W, H, dot, dpr, n, pos, col } = this;
    if (!buf || !imageData) return;
    buf.fill(0);
    for (let i = 0; i < n; i++) {
      const px = Math.round(pos[i * 2] * dpr - dot / 2);
      const py = Math.round(pos[i * 2 + 1] * dpr - dot / 2);
      if (px < 0 || py < 0 || px > W - dot || py > H - dot) continue;
      const rgba = (255 << 24) | (col[i * 3 + 2] << 16) | (col[i * 3 + 1] << 8) | col[i * 3];
      for (let yy = 0; yy < dot; yy++) {
        const row = (py + yy) * W + px;
        for (let xx = 0; xx < dot; xx++) buf[row + xx] = rgba;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
  }
}
