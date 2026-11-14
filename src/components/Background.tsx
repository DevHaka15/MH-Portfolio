/** Fixed backdrop: drifting blue glow, soft light beam, floating glass slabs, bottom fade. No grain or noise. */
export function Background() {
  return (
    <>
      <div className="bg" aria-hidden="true">
        <i /><i /><i />
        <s /><s /><s /><s /><s />
      </div>
      <div className="fade" aria-hidden="true" />
    </>
  );
}
