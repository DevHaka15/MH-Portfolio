# Malambo Hakabwandi — Portfolio

Static site, no build step.

```
index.html          page structure
css/style.css       all styling
js/projects.js      your project list (edit this to add work)
js/app.js           animations, navigation, WhatsApp form
images/             logo, grain, photo, favicon (+ images/work for covers)
scripts/fetch-covers.mjs   optional: download Behance covers into the site
vercel.json         caching headers
```

## Update the site
Edit files on GitHub (pencil icon) or locally, commit to `main`. Vercel redeploys automatically.

## Add a project
In `js/projects.js` copy a line. `u` is the Behance link after `/gallery/`. Cover: `i` = Behance image file name, or `l` = a file in `images/`.
The first 9 show on the landing page.

## Faster covers (recommended)
On your computer with Node 18+, from this folder: `node scripts/fetch-covers.mjs`, then commit `images/work` and `js/projects.js`.
