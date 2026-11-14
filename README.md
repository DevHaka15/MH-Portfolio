# Malambo Hakabwandi — Portfolio (React + TypeScript)

Built with Vite, React and TypeScript. It is a static site: no server, and Vercel hosts the built files.

## Run it on your computer
You need Node 18 or newer. In PowerShell, inside this folder:

```powershell
npm install        # downloads the tools (once)
npm run dev        # starts the site at http://localhost:5173
```

Other commands:

```powershell
npm run build      # checks the code and makes the real site in the dist folder
npm run preview    # opens the built site locally, the way visitors will see it
```

## Add a project
1. Open `src/data/projects.ts`.
2. Copy one block (one line between `{` and `},`) and change the values:
   - `id`: a short unique name with dashes, for example `"menu-design"`
   - `title`, `category` (`"Branding"`, `"Posters"` or `"Social media"`), `description`
   - `behanceId`: the part of the Behance link after `/gallery/`
   - `cover`: Behance's cover file name (optional, see below)
3. Add the cover picture. Easiest: run `npm run covers`. It downloads the cover from Behance and shrinks it into `public/images/work/<id>.webp`.
   If Behance blocks it, save the picture yourself as `public/images/work/<id>.webp` (or `.png` / `.jpg`), then run `npm run covers:optimize`.
4. The first 9 projects in the list appear on the home page, so put new ones where you want them.

**Still missing:** the cover for "Promotional Social Media Posters". Save it as `public/images/work/promotional-social-media-posters.png` (or `.jpg`), then run `npm run covers:optimize`.

## Put it online (Vercel)
One-time change in Vercel: **Project → Settings → Build and Deployment → Framework Preset = Vite** (build command `npm run build`, output folder `dist`). It was "Other" before.

Then, every time you change something:

```powershell
git add .
git commit -m "describe what you changed"
git push
```

Vercel builds and publishes by itself in about a minute. Visitor counts show in Vercel → Analytics.

## How the site stays fast
- Only `transform` and `opacity` are animated (the cheap kind). No blur filters on big layers, no masks on animated layers.
- The page decides how much motion your visitor's device gets, before anything is drawn:
  - **full**: good desktop computers. Everything animates.
  - **lite**: phones, weaker devices, Data Saver or slow connections. Same look, but the background is still, the dot field is drawn once, and the headline does not react to touch.
  - **none**: people who turned on "reduce motion". No animation and no page-transition curtain.
- Pointer movement never goes through React state. Effects write straight to the page once per frame.
- Pages are split into separate small files and download only when needed (and are fetched quietly in the background once the home page is idle).
- Fonts and covers are served from this site, not from Google or Behance. Covers are small WebP files with their size recorded, so nothing jumps while loading.
- The grain image is used in the page-transition curtain only, never on the page background.

## Folder map
```
src/data/projects.ts      the project list (edit this to add work)
src/components/           Dock, Curtain, Background, Hero, GlassKeys, Ticker, ProjectGrid, Reveal, Cover
src/pages/                Home, Work, ProjectPage, About, Contact
src/lib/                  the headline and dot-field effects (plain TypeScript, no React)
src/styles/               tokens.css (colours, fonts) and global.css
public/images/            logo, photo, favicon, noise (curtain only), work/ covers
scripts/                  fetch-covers.mjs and optimize-covers.mjs
legacy/                   the previous plain HTML site, kept for reference. Safe to delete once you are happy.
vercel.json               makes direct links work, plus cache headers
```
