export type CurtainPhase = "idle" | "arm" | "in" | "out";

/** Five bars that wipe over the page while the route changes. The noise texture lives only here. */
export function Curtain({ phase }: { phase: CurtainPhase }) {
  const cls = ["curtain", phase !== "idle" && "on", phase === "in" && "cv", phase === "out" && "out"].filter(Boolean).join(" ");
  return (
    <div className={cls} aria-hidden="true">
      <b /><b /><b /><b /><b />
    </div>
  );
}
