import { Reveal } from "../components/Reveal";
import { usePageTitle } from "../hooks/usePageTitle";

export default function About() {
  usePageTitle("About");
  return (
    <section className="pg-top">
      <div className="wrap about">
        <Reveal>
          <div className="portrait">
            <img src="/images/me.webp" width={720} height={1008} alt="Malambo Hakabwandi holding a camera in front of his face" decoding="async" />
            <span>Malambo Hakabwandi</span>
          </div>
        </Reveal>
        <div>
          <Reveal as="h2">What’s up, I’m Malambo.</Reveal>
          <Reveal as="p" className="lead" delay={0.1}>I’m a graphic designer and the founder of MH Design Studio, where creativity meets purpose.</Reveal>
          <Reveal as="p" delay={0.2} style={{ color: "var(--mute)" }}>
            I specialise in logos, professional flyers and visual content that help brands stand out and connect with their audience. I also manage social media for brands, so the visuals and the posting stay consistent. When I’m not on client projects, I explore new design trends and turn concepts into visuals that get brands remembered.
          </Reveal>
          <Reveal className="rows" delay={0.3}>
            <div className="row"><b>Services</b><span>Logo and brand identity, flyers and posters, social media graphics, social media management</span></div>
            <div className="row"><b>Studio</b><span>MH Design Studio, Lusaka, Zambia</span></div>
            <div className="row"><b>Availability</b><span>Open to freelance work, commissions and partnerships</span></div>
          </Reveal>
          <Reveal className="lnk" delay={0.4}>
            <a href="https://www.behance.net/lambohaka" target="_blank" rel="noopener">Behance portfolio</a>
            <a href="http://linktr.ee/malambohaka" target="_blank" rel="noopener">All my socials</a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
