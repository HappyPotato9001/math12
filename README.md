# Math 1/2 Study Lab

Study site for Integrated Math 1 and 2, centered on your class textbook units, with digitized classwork and instant feedback.

Accounts can sign up freely, but **an admin must accept them** before Math 1/2 unlocks.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default admin (created automatically):

- Email: `admin@math12.local`
- Password: `changeme`

Override with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` (see `.env.example`).

## Live site (APIs + GitHub Pages)

GitHub Pages is **static** — it cannot execute Next.js API routes. The full app (auth, admin, sharing, practice tests, notebooks) runs on **Vercel**. The Pages URL forwards there so bookmarks like `/math12/math1/` keep working.

1. Import this repo at [vercel.com/new](https://vercel.com/new) (Next.js defaults are fine).
2. In Vercel → Project → Settings → Environment Variables, copy values from `.env.example` / `.env.local` (`AUTH_SECRET`, OAuth, `ADMIN_EMAIL`, …).
3. Add OAuth callback URLs for `https://YOUR_PROJECT.vercel.app/api/auth/callback/google` (and GitHub).
4. In GitHub → Settings → Secrets and variables → Actions → **Variables**, set `LIVE_APP_URL` to `https://YOUR_PROJECT.vercel.app` (no trailing slash).
5. Optional CI deploy: add secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (from `npx vercel link` / Vercel tokens).

After the Pages workflow runs, [https://happypotato9001.github.io/math12/math1/](https://happypotato9001.github.io/math12/math1/) opens the live API-backed app.

```bash
npm run build:pages   # requires LIVE_APP_URL
```

## Access flow (Node server)

1. Student signs up → status `pending`
2. Admin signs in → `/admin` → Accept
3. Student can open Math 1 / Math 2 lessons and classwork

## What’s included

- Math 1 (Units 1–9) and Math 2 (Units 1–3) mapped to your class packets
- Unit PDFs in `public/textbook/`
- Digitized classwork drills on selected lessons
- Approval-gated accounts stored in `data/users.json` (server mode)

