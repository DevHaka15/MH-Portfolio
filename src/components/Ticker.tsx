const PHRASE = "Logos ● Flyers ● Posters ● Social media management ● Brand identity ● ";

export function Ticker() {
  const half = PHRASE.repeat(4);
  return (
    <div className="ticker" aria-hidden="true">
      <div>
        <span>{half}</span>
        <span>{half}</span>
      </div>
    </div>
  );
}
