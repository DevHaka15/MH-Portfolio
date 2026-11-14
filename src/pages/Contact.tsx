import { useState, type FormEvent } from "react";
import { Reveal } from "../components/Reveal";
import { usePageTitle } from "../hooks/usePageTitle";

const SERVICES = ["Brand identity", "Packaging", "Poster or print", "Social media management", "Something else"];
const WHATSAPP = "260765646089";

export default function Contact() {
  usePageTitle("Hire me");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICES[0] as string);
  const [details, setDetails] = useState("");
  const [msg, setMsg] = useState<{ kind: "error" } | { kind: "sent"; url: string } | null>(null);

  function send(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !details.trim() || phone.replace(/\D/g, "").length < 7) {
      setMsg({ kind: "error" });
      return;
    }
    const text = `Hi Malambo, I'm ${name.trim()}.\nI need: ${service}\n\n${details.trim()}\n\nMy number: ${phone.trim()}`;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setMsg({ kind: "sent", url });
  }

  return (
    <section className="pg-top">
      <div className="wrap contact">
        <div>
          <Reveal><img className="av" src="/images/me-sm.webp" width={84} height={84} alt="Malambo Hakabwandi" /></Reveal>
          <Reveal as="h2" delay={0.1}>Got a brand to build?</Reveal>
          <Reveal as="p" delay={0.15} style={{ maxWidth: "36ch", marginTop: 24, color: "var(--mute)" }}>
            Tell me what you’re working on, when you need it and a rough budget. Add your number and send. WhatsApp opens with your message ready, and I reply there.
          </Reveal>
          <Reveal className="lnk" delay={0.25}>
            <a href="https://wa.me/260765646089" target="_blank" rel="noopener">WhatsApp 076 564 6089</a>
            <a href="mailto:malambohaka15@gmail.com">malambohaka15@gmail.com</a>
            <a href="https://www.behance.net/lambohaka" target="_blank" rel="noopener">Behance portfolio</a>
            <a href="http://linktr.ee/malambohaka" target="_blank" rel="noopener">All my socials</a>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <form onSubmit={send} noValidate>
            <div><label htmlFor="n">Your name</label><input id="n" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label htmlFor="e">Your WhatsApp number</label><input id="e" type="tel" inputMode="tel" autoComplete="tel" placeholder="e.g. 097 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div>
              <label htmlFor="t">What do you need?</label>
              <select id="t" value={service} onChange={(e) => setService(e.target.value)}>
                {SERVICES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label htmlFor="m">Project details</label><textarea id="m" value={details} onChange={(e) => setDetails(e.target.value)} /></div>
            <button className="cta" type="submit">Send on WhatsApp</button>
            <p className="msg" role="status">
              {msg?.kind === "error" && "Add your name, your WhatsApp number and your project details first."}
              {msg?.kind === "sent" && (<>Opening WhatsApp. If nothing happens, <a href={msg.url} target="_blank" rel="noopener">tap here to send</a>.</>)}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
