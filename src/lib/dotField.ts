/**
 * Hero dot field. Cheap on purpose:
 *  - every dot is a blit of one pre-drawn sprite (no per-dot path filling)
 *  - while the pointer moves it redraws at full rate; when the pointer rests it only drifts the wave ~11 times a second
 *  - it stops completely when the hero is off screen or the tab is hidden
 *  - phones / weak devices get ONE static draw and no animation loop at all
 */
export interface DotField {
  pointer(clientX: number, clientY: number): void;
  leave(): void;
  setVisible(v: boolean): void;
  resize(): void;
  destroy(): void;
}

const IDLE_MS = 90;   // wave only, pointer resting
const ACTIVE_MS = 16; // pointer moving
const SPRITE = 32;

function makeSprite(): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = s.height = SPRITE;
  const g = s.getContext("2d");
  if (g) {
    g.fillStyle = "rgb(120,150,245)";
    g.beginPath();
    g.arc(SPRITE / 2, SPRITE / 2, SPRITE / 2 - 1, 0, Math.PI * 2);
    g.fill();
  }
  return s;
}

export function createDotField(canvas: HTMLCanvasElement, animated: boolean, small: boolean): DotField {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { pointer() {}, leave() {}, setVisible() {}, resize() {}, destroy() {} };
  const c = ctx;
  const sprite = makeSprite();

  let W = 0, H = 0, dpr = 1, gap = 34;
  let mx = -9999, my = -9999;
  let left = 0, top = 0, scrollAtMeasure = 0;
  let visible = true, raf = 0, last = 0, lastMove = -1e9, destroyed = false, needsDraw = true;

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5);
    gap = (small ? 48 : 34) * dpr;
    W = canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    H = canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    const r = canvas.getBoundingClientRect();
    left = r.left; top = r.top; scrollAtMeasure = scrollY;
    draw(performance.now());
  }

  function draw(now: number): void {
    needsDraw = false;
    c.clearRect(0, 0, W, H);
    const R = 170 * dpr, t = now / 833;
    const fadeEnd = H * 0.3; // dots fade in over the top 30% (replaces a CSS mask, which is very costly on a live canvas)
    for (let y = gap / 2; y < H; y += gap) {
      const fade = y < fadeEnd ? y / fadeEnd : 1;
      for (let x = gap / 2; x < W; x += gap) {
        let px = x, py = y, r = 1.3, a = 0.2;
        if (animated) a += Math.sin(x / (gap * 3) + t) * Math.cos(y / (gap * 3) - t) * 0.07;
        const dx = x - mx, dy = y - my;
        if (dx > -R && dx < R && dy > -R && dy < R) {
          const d = Math.hypot(dx, dy);
          if (d < R) {
            const k = (1 - d / R) ** 2;
            px += (dx / (d || 1)) * k * 26 * dpr; py += (dy / (d || 1)) * k * 26 * dpr;
            r += k * 3.2; a += k * 0.6;
          }
        }
        a *= fade;
        if (a < 0.01) continue;
        const rr = r * dpr;
        c.globalAlpha = a > 1 ? 1 : a;
        c.drawImage(sprite, px - rr, py - rr, rr * 2, rr * 2);
      }
    }
    c.globalAlpha = 1;
  }

  function loop(now: number): void {
    if (destroyed) return;
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    const gapMs = now - lastMove < 1200 ? ACTIVE_MS : IDLE_MS;
    if (now - last < gapMs) return;
    last = now;
    draw(now);
  }

  if (animated) raf = requestAnimationFrame(loop);
  resize();

  return {
    pointer(clientX, clientY) {
      mx = (clientX - left) * dpr;
      my = (clientY - (top - (scrollY - scrollAtMeasure))) * dpr;
      lastMove = performance.now();
      if (!animated && !needsDraw) { needsDraw = true; requestAnimationFrame(() => draw(performance.now())); }
    },
    leave() { mx = my = -9999; lastMove = performance.now(); if (!animated) draw(performance.now()); },
    setVisible(v) { visible = v; },
    resize,
    destroy() { destroyed = true; cancelAnimationFrame(raf); },
  };
}
