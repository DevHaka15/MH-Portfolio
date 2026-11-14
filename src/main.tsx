import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "@fontsource-variable/figtree/wght.css";
import "./styles/tokens.css";
import "./styles/global.css";
import App from "./App";

history.scrollRestoration = "manual";

/* old links like /#work or /#case-christmas-poster still land on the right page */
const legacy = location.hash.slice(1);
if (legacy) {
  const path = legacy === "home" ? "/" : legacy.startsWith("case-") ? `/work/${legacy.slice(5)}` : ["work", "about", "contact"].includes(legacy) ? `/${legacy}` : null;
  if (path) history.replaceState(null, "", path);
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
);
