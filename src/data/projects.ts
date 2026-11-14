import sizes from "./cover-sizes.json";

export type Category = "Branding" | "Posters" | "Social media";

export interface Project {
  id: string;
  title: string;
  category: Category;
  /** The part of the Behance link after /gallery/ */
  behanceId: string;
  /** Behance's cover file name. Only used as a fallback if the local cover is missing. Leave out if unknown. */
  cover?: string;
  description: string;
}

/**
 * ADD A PROJECT: copy one block below, change the values, save.
 * Put its cover at  public/images/work/<id>.webp  (or run: npm run covers).
 * The first 9 projects show on the home page.
 */
export const projects: Project[] = [
  { id: "auto-iq-diagnostics", title: "Auto IQ Diagnostics Brand Logo", category: "Branding", behanceId: "232415757/Auto-IQ-DIagnostics-Brand-Logo", cover: "6f471b232415757.Y3JvcCwzMDAwLDIzNDYsMCw1MTk.png", description: "Logo and brand identity for Auto IQ Diagnostics." },
  { id: "perfume-vault-brand", title: "The Perfume Vault Brand", category: "Branding", behanceId: "232416789/The-Perfume-Vault-Brand", cover: "dbc37c232416789.Y3JvcCwxMDgwLDg0NCwwLDE5Nw.png", description: "Brand identity for The Perfume Vault." },
  { id: "promotional-social-media-posters", title: "Promotional Social Media Posters", category: "Social media", behanceId: "237300993/Promotional-Social-Media-Posters", description: "A set of promotional posters made for social media." },
  { id: "hiring-poster-promotion", title: "Hiring Poster Promotion", category: "Social media", behanceId: "249581351/Hiring-Poster-Promotion", cover: "483c74249581351.Y3JvcCwxNjQ3LDEyODgsMCwxOTE.png", description: "A promotional poster for a hiring campaign." },
  { id: "good-friday-poster", title: "Good Friday Poster", category: "Posters", behanceId: "249581103/Good-Friday-Poster", cover: "6e87af249581103.Y3JvcCwxMDgwLDg0NCwwLDIxMQ.png", description: "Poster design for Good Friday." },
  { id: "laundry-advertising-posters", title: "Laundry Advertising Posters", category: "Social media", behanceId: "249582007/Laundry-Advertising-Posters", cover: "6e6637249582007.Y3JvcCwxOTk5LDE1NjQsMCwyMTc.png", description: "Advertising posters for a laundry business." },
  { id: "new-year-poster", title: "New Year Poster (Perfume Vault)", category: "Posters", behanceId: "249582115/New-Year-Poster-(Perfume-Vault)", cover: "41258a249582115.Y3JvcCwyNTAwLDE5NTUsMCwzMjE.png", description: "New Year campaign poster for The Perfume Vault." },
  { id: "sales-promotional-poster", title: "Sales Promotional Social Media Poster", category: "Social media", behanceId: "237440799/Sales-Promotional-Social-Media-Poster", cover: "dfed71237440799.Y3JvcCwyMDg0LDE2MzAsMCw1ODI.png", description: "A sales promotion poster made for social media." },
  { id: "christmas-poster", title: "Christmas Poster", category: "Posters", behanceId: "249582261/Christmas-Poster", cover: "0ee81d249582261.Y3JvcCwyNTAwLDE5NTUsMCwzMjE.png", description: "Poster design for Christmas." },
  { id: "soccer-event-posters", title: "Soccer Event Posters", category: "Posters", behanceId: "249581477/Soccer-Event-Posters", cover: "2a096f249581477.Y3JvcCwxMTQ4LDg5NywwLDI1OA.png", description: "A set of posters for a soccer event." },
  { id: "kk-day-poster", title: "KK Day Poster", category: "Posters", behanceId: "249581577/KK-Day-Poster", cover: "6859bb249581577.6a2165ae06830.jpg", description: "Poster design for KK Day." },
  { id: "church-background-fb", title: "Church Background FB Image", category: "Social media", behanceId: "249580939/Church-Background-FB-Image", cover: "2b143f249580939.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png", description: "A Facebook background image for a church." },
  { id: "independence-poster-2025", title: "2025 Independence Poster Project", category: "Posters", behanceId: "240061583/2025-Independence-Poster-Project", cover: "4dcde1240061583.6936e225c7957.png", description: "Poster project for Independence Day 2025." },
];

export const categories: Array<"All" | Category> = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

export const BEHANCE_GALLERY = "https://www.behance.net/gallery/";
const BEHANCE_CDN = "https://mir-s3-cdn-cf.behance.net/projects/404/";

export const behanceUrl = (p: Project): string => BEHANCE_GALLERY + p.behanceId;
export const localCover = (p: Project): string | null => ((sizes as Record<string, unknown>)[p.id] ? `/images/work/${p.id}.webp` : null);
export const remoteCover = (p: Project): string | null => (p.cover ? BEHANCE_CDN + p.cover : null);

/** Real pixel size of the local cover, so the browser can reserve space (no layout shift). */
export function coverSize(p: Project): { w: number; h: number } {
  const s = (sizes as Record<string, { w: number; h: number } | undefined>)[p.id];
  return s ?? { w: 404, h: 316 };
}

export const findProject = (id: string | undefined): Project | undefined => projects.find((p) => p.id === id);
export const nextProject = (p: Project): Project => {
  const i = projects.findIndex((x) => x.id === p.id);
  return projects[(i + 1) % projects.length] as Project;
};
