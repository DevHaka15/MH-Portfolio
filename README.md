# Malambo Hakabwandi — Portfolio

Static portfolio site. One `index.html`, no build step.

## Push to GitHub
```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Deploy on Vercel
1. Go to vercel.com/new and import the GitHub repo.
2. Framework Preset: **Other**. Leave build command and output directory empty.
3. Click **Deploy**. Every push to `main` redeploys automatically.

## Add a project
Open `index.html`, find the `const P=[` list and copy a line. `u` is the Behance link after `/gallery/`.
For the cover, use `i` (Behance image file name) or `l` (a file you put in the `images` folder, e.g. `images/my-project.jpg`).
The first 9 projects show on the landing page; all of them show on the Work page.
