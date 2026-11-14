import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { GlassKeys } from "./GlassKeys";
import { getMotion } from "../lib/motion";
import { createDotField } from "../lib/dotField";
import { createHeadlineFx, type HeadlineFx } from "../lib/headlineFx";

const LINES = ["Designs that", "are impossible", "to ignore."];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = heroRef.current, h1 = h1Ref.current, stage = stageRef.current, canvas = canvasRef.current;
    if (!hero || !h1 || !stage || !canvas) return;
    const motion = getMotion();
    const full = motion === "full";
    const dots = createDotField(canvas, full, !full);
    let fx: HeadlineFx | null = full ? createHeadlineFx(h1) : null;

    /* pause the dots and the key animation when the hero is off-screen */
    const io = new IntersectionObserver(([e]) => {
      const v = !!e?.isIntersecting;
      hero.dataset.live = String(v);
      dots.setVisible(v);
    });
    io.observe(hero);

    let stageRect = stage.getBoundingClientRect(), stageScroll = scrollY;
    let resizeQueued = false;
    const onResize = () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => {
        resizeQueued = false;
        dots.resize();
        fx?.invalidate();
        stageRect = stage.getBoundingClientRect(); stageScroll = scrollY;
      });
    };
    addEventListener("resize", onResize);
    void document.fonts?.ready.then(() => fx?.invalidate());

    /* ONE pointer listener, ONE requestAnimationFrame per frame. Everything is written to the DOM directly, never to React state. */
    let qx = 0, qy = 0, queued = false;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const flush = () => {
      queued = false;
      fx?.move(qx + scrollX, qy + scrollY);
      dots.pointer(qx, qy);
      const top = stageRect.top - (scrollY - stageScroll);
      stage.style.setProperty("--px", clamp(((qx - stageRect.left) / stageRect.width) * 2 - 1).toFixed(3));
      stage.style.setProperty("--py", clamp(((qy - top) / stageRect.height) * 2 - 1).toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      qx = e.clientX; qy = e.clientY;
      if (!queued) { queued = true; requestAnimationFrame(flush); }
    };
    const onLeave = () => {
      fx?.leave(); dots.leave();
      stage.style.setProperty("--px", "0"); stage.style.setProperty("--py", "0");
    };
    if (full) {
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
    }

    return () => {
      io.disconnect(); dots.destroy(); fx = null;
      removeEventListener("resize", onResize);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  let n = 0;
  return (
    <div className="hero" ref={heroRef as React.RefObject<HTMLDivElement>} data-live="true">
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="wrap hg">
        <div className="hl">
          <Reveal className="chip" delay={0.05}>
            <img className="av" src="/images/me-sm.webp" width={36} height={36} alt="" />
            <span>Available for freelance work</span>
          </Reveal>
          <h1 ref={h1Ref} aria-label="Designs that are impossible to ignore.">
            {LINES.map((line) => (
              <span className="ln" aria-hidden="true" key={line}>
                {[...line].map((ch, i) =>
                  ch === " " ? (
                    " "
                  ) : (
                    <span className="ch" key={i} style={{ "--i": n++ } as CSSProperties}>{ch}</span>
                  ),
                )}
              </span>
            ))}
          </h1>
          <Reveal as="p" delay={0.35}>
            I’m Malambo, founder of MH Design Studio in Lusaka. I design logos, flyers and social media visuals, and I manage social media for brands that want to stand out.
          </Reveal>
          <Reveal className="btns" delay={0.45}>
            <Link className="cta" to="/work">See the work</Link>
            <Link className="cta g" to="/contact">Start a project</Link>
          </Reveal>
        </div>
        <div className="stage" ref={stageRef} aria-hidden="true">
          <GlassKeys />
        </div>
      </div>
    </div>
  );
}
