import { lazy } from "react";

/** Each page is its own file that downloads only when needed. Home is bundled with the app. */
const loaders = {
  work: () => import("./pages/Work"),
  project: () => import("./pages/ProjectPage"),
  about: () => import("./pages/About"),
  contact: () => import("./pages/Contact"),
};

export const Work = lazy(loaders.work);
export const ProjectPage = lazy(loaders.project);
export const About = lazy(loaders.about);
export const Contact = lazy(loaders.contact);

/** Start downloading a page before the visitor clicks (on hover / touch / when idle). */
export function prefetchRoute(path: string): void {
  if (path.startsWith("/work/")) void loaders.project();
  else if (path === "/work") void loaders.work();
  else if (path === "/about") void loaders.about();
  else if (path === "/contact") void loaders.contact();
}

export function prefetchAll(): void {
  Object.values(loaders).forEach((l) => void l());
}
