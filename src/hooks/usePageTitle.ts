import { useEffect } from "react";

const SITE = "Malambo Hakabwandi — Graphic Designer";

export function usePageTitle(page?: string): void {
  useEffect(() => {
    document.title = page ? `${page} — ${SITE}` : SITE;
  }, [page]);
}
