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

- Math 1 & Math 2 unit maps with ready topics and stubs
- Lesson notes with KaTeX math
- Practice drills (check / hint / reveal) and local progress
- Class rooms saved in the browser (export/import JSON to move between devices)

## Deploy

Pushes to `master`/`main` build and publish to GitHub Pages via `.github/workflows/deploy.yml`.

In the repo settings, set **Pages → Source** to **GitHub Actions**.
