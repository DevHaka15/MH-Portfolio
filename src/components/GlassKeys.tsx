/** Three glass keys. The centre one is lit and holds the logo; a stylus presses it every 6 s (CSS only). */
export function GlassKeys() {
  const icon = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <>
      <div className="beam" />
      <div className="keys">
        <div className="key k1">
          <svg {...icon}><path d="M12 3l5 9-5 9-5-9z" /><circle cx="12" cy="12" r="1.6" /><path d="M12 3v7.4" /></svg>
        </div>
        <div className="key k2"><i className="mk" /></div>
        <div className="key k3">
          <svg {...icon}><path d="M3 19L8.5 5 14 19M5 14.5h7M16 19l2.6-6.5L21 19M16.9 17h3.4" /></svg>
        </div>
      </div>
      <div className="stylus" />
    </>
  );
}
