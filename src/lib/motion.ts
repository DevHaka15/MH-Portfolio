export type Motion = "full" | "lite" | "none";

/** Set before first paint by the small script in index.html. */
export function getMotion(): Motion {
  const m = document.documentElement.dataset.motion;
  return m === "full" || m === "lite" || m === "none" ? m : "lite";
}

/** Run low-priority work after the page is interactive. */
export function whenIdle(fn: () => void, timeout = 3000): void {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  const run = () => (w.requestIdleCallback ? w.requestIdleCallback(fn, { timeout }) : setTimeout(fn, 800));
  if (document.readyState === "complete") run();
  else addEventListener("load", run, { once: true });
}
