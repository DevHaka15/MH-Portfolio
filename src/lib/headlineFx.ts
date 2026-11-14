/**
 * Hero headline: each letter gets heavier and narrower near the pointer.
 * No React state. Letter centres are measured once (not on every move), and a letter's
 * style is only touched when its quantised value actually changes.
 */
const RADIUS = 260;

export interface HeadlineFx {
  move(pageX: number, pageY: number): void;
  leave(): void;
  invalidate(): void;
}

export function createHeadlineFx(root: HTMLElement): HeadlineFx {
  const letters = Array.from(root.querySelectorAll<HTMLElement>(".ch"));
  const cx = new Float32Array(letters.length);
  const cy = new Float32Array(letters.length);
  const lastW = new Int16Array(letters.length).fill(300);
  const lastX = new Float32Array(letters.length).fill(100);
  let dirty = true;
  let active = false;
  let ready = false; // letters have finished their intro slide-up
  const lastLetter = letters[letters.length - 1];
  if (lastLetter) lastLetter.addEventListener("animationend", () => { ready = true; dirty = true; }, { once: true });

  function measure(): void {
    const sx = scrollX, sy = scrollY;
    letters.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      cx[i] = r.left + sx + r.width / 2;
      // the intro slides letters up from below; the resting position is the one we want
      cy[i] = r.top + sy + r.height / 2;
    });
    dirty = false;
  }

  function reset(): void {
    letters.forEach((el, i) => {
      if (lastW[i] !== 300) { el.style.removeProperty("--w"); lastW[i] = 300; }
      if (lastX[i] !== 100) { el.style.removeProperty("--x"); lastX[i] = 100; }
    });
  }

  return {
    move(px, py) {
      if (!ready) return;
      // measure only while nothing is stretched, so the numbers are the resting layout
      if (dirty && !active) measure();
      active = true;
      for (let i = 0; i < letters.length; i++) {
        const d = Math.hypot(px - (cx[i] as number), py - (cy[i] as number));
        const t = Math.max(0, 1 - d / RADIUS);
        const w = 300 + Math.round((t * 500) / 25) * 25;
        const x = 100 - Math.round((t * 25) / 2.5) * 2.5;
        const el = letters[i] as HTMLElement;
        if (w !== lastW[i]) { el.style.setProperty("--w", String(w)); lastW[i] = w; }
        if (x !== lastX[i]) { el.style.setProperty("--x", String(x)); lastX[i] = x; }
      }
    },
    leave() { active = false; reset(); },
    invalidate() { if (!active) dirty = true; else { reset(); active = false; dirty = true; } },
  };
}
