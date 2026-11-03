# Math 1/2 Study Lab

Study site for Integrated Math 1 and 2: short lessons, topic drills with instant feedback, and class rooms for sharing worked attempts.

## Live site

https://happypotato9001.github.io/math12/

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a GitHub Pages-style build with the `/math12` base path:

```bash
NEXT_PUBLIC_BASE_PATH=/math12 npm run build
```

Static files are written to `out/`.

## What's included

- Math 1 (Units 1–9) and Math 2 (Units 1–3) mapped to your class textbook lessons
- Unit PDFs in `public/textbook/`
- Digitized classwork drills on selected lessons (Jump Start / Classwork style)
- Class rooms with photo sharing (browser storage + export/import)

## Deploy

Pushes to `master`/`main` build and publish to GitHub Pages via `.github/workflows/deploy.yml`.

In the repo settings, set **Pages → Source** to **GitHub Actions**.
