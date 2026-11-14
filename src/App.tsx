import { Suspense, useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Background } from "./components/Background";
import { Curtain, type CurtainPhase } from "./components/Curtain";
import { Dock } from "./components/Dock";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import { About, Contact, ProjectPage, Work, prefetchAll } from "./routes";
import { getMotion, whenIdle } from "./lib/motion";

const SWAP_AT = 850; // ms after the bars start rising: swap the page while the screen is covered
const OUT_FOR = 800; // ms the bars take to leave

export default function App() {
  const location = useLocation();
  const motion = getMotion();

  /* "shown" is the page on screen; "location" is where the browser is. They differ only during the curtain. */
  const [shown, setShown] = useState(location);
  const [phase, setPhase] = useState<CurtainPhase>("idle");
  const [tick, setTick] = useState(0);
  const latest = useRef(location);
  latest.current = location;
  const shownRef = useRef(location);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (busy.current) return; // clicks are blocked by the curtain; Back/Forward is picked up after the swap below
    const target = latest.current;
    const swap = () => {
      shownRef.current = latest.current; // always the most recently requested route
      setShown(latest.current);
      window.scrollTo(0, 0);
    };
    if (target.pathname === shownRef.current.pathname) {
      if (target !== shownRef.current) { shownRef.current = target; setShown(target); }
      return;
    }
    if (motion === "none") { swap(); return; }

    busy.current = true;
    setPhase("arm");
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("in")));
    timers.current.push(
      window.setTimeout(() => {
        swap();
        setPhase("out");
        timers.current.push(
          window.setTimeout(() => {
            setPhase("idle");
            busy.current = false;
            setTick((t) => t + 1); // if the visitor asked for another route meanwhile, go there now
          }, OUT_FOR),
        );
      }, SWAP_AT),
    );
  }, [location, tick, motion]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /* once the page is idle: warm the other pages and the curtain images so the first transition is instant */
  useEffect(() => {
    whenIdle(() => {
      prefetchAll();
      if (motion !== "none") ["/images/logo.webp", "/images/noise.jpg"].forEach((s) => { new Image().src = s; });
    });
  }, [motion]);

  return (
    <>
      <Background />
      <Curtain phase={phase} />
      <Dock path={shown.pathname} />
      <main>
        <Suspense fallback={null}>
          <Routes location={shown}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:id" element={<ProjectPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
