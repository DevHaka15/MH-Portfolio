import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getMotion } from "../lib/motion";
import { prefetchRoute } from "../routes";

const ITEMS = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
] as const;

function activeIndex(path: string): number {
  if (path === "/") return 0;
  if (path.startsWith("/work")) return 1;
  if (path === "/about") return 2;
  return -1;
}

export function Dock({ path }: { path: string }) {
  const dockRef = useRef<HTMLElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const pillRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const idx = activeIndex(path);

  /* sliding active pill */
  useLayoutEffect(() => {
    const place = () => {
      const pill = pillRef.current;
      if (!pill) return;
      const a = idx >= 0 ? linkRefs.current[idx] : null;
      if (!a) { pill.style.width = "0px"; return; }
      pill.style.width = `${a.offsetWidth}px`;
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
    };
    place();
    addEventListener("resize", place);
    void document.fonts?.ready.then(place);
    return () => removeEventListener("resize", place);
  }, [idx]);

  /* scroll progress ring + "more opaque after 40px". Writes straight to the DOM, no React state. */
  useEffect(() => {
    const ring = ringRef.current, dock = dockRef.current;
    if (!ring || !dock) return;
    let max = 1, queued = false, scrolled = false;
    const measure = () => { max = Math.max(1, document.documentElement.scrollHeight - innerHeight); apply(); };
    const apply = () => {
      queued = false;
      ring.style.strokeDashoffset = String(81.7 * (1 - Math.min(1, scrollY / max)));
      const s = scrollY > 40;
      if (s !== scrolled) { scrolled = s; dock.classList.toggle("sc", s); }
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(apply); } };
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    measure();
    addEventListener("scroll", onScroll, { passive: true });
    return () => { ro.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);

  /* slight magnetic pull toward the cursor (mouse + capable devices only) */
  useEffect(() => {
    if (getMotion() !== "full") return;
    const cleanups = linkRefs.current.map((a) => {
      if (!a) return () => {};
      let r: DOMRect | null = null;
      const enter = () => { r = a.getBoundingClientRect(); };
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        r ??= a.getBoundingClientRect();
        a.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
      };
      const leave = () => { r = null; a.style.transform = ""; };
      a.addEventListener("pointerenter", enter);
      a.addEventListener("pointermove", move);
      a.addEventListener("pointerleave", leave);
      return () => { a.removeEventListener("pointerenter", enter); a.removeEventListener("pointermove", move); a.removeEventListener("pointerleave", leave); };
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <header className="dock" ref={dockRef}>
      <Link className="logo" to="/" aria-label="Malambo Hakabwandi, home">
        <svg viewBox="0 0 30 30" aria-hidden="true">
          <circle cx="15" cy="15" r="13" fill="none" stroke="#ffffff30" strokeWidth="2" />
          <circle ref={ringRef} className="ring" cx="15" cy="15" r="13" fill="none" stroke="#F5B400" strokeWidth="2" strokeLinecap="round" transform="rotate(-90 15 15)" />
          <image href="/images/mark.webp" x="7.25" y="7.59" width="15.5" height="14.82" />
        </svg>
        <b>Malambo Hakabwandi</b>
      </Link>
      <nav className="links" aria-label="Main">
        <i className="pill" ref={pillRef as React.RefObject<HTMLElement>} />
        {ITEMS.map((it, i) => (
          <Link
            key={it.to}
            to={it.to}
            ref={(el) => { linkRefs.current[i] = el; }}
            aria-current={i === idx ? "page" : undefined}
            onPointerEnter={() => prefetchRoute(it.to)}
            onTouchStart={() => prefetchRoute(it.to)}
          >
            <span>{it.label}</span>
            <span aria-hidden="true">{it.label}</span>
          </Link>
        ))}
      </nav>
      <Link className="hire" to="/contact" aria-current={path === "/contact" ? "page" : undefined} onPointerEnter={() => prefetchRoute("/contact")} onTouchStart={() => prefetchRoute("/contact")}>
        Hire me
      </Link>
    </header>
  );
}
