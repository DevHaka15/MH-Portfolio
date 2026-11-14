import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/** One shared observer for every reveal on the page (cheaper than one per element). */
let io: IntersectionObserver | null = null;
function observer(): IntersectionObserver {
  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io?.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 },
  );
  return io;
}

interface RevealProps {
  as?: "div" | "h2" | "p" | "dl";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Fades and slides content in once when it scrolls into view. Only transform + opacity are animated. */
export function Reveal({ as = "div", delay = 0, className = "", style, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = observer();
    o.observe(el);
    return () => o.unobserve(el);
  }, []);

  return (
    <Tag ref={ref} className={`rv ${className}`.trim()} style={{ "--d": `${delay}s`, ...style } as CSSProperties}>
      {children}
    </Tag>
  );
}
