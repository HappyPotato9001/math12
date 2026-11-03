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

## Live site (Vercel + GitHub Pages)

GitHub Pages is **static** and cannot run API routes. The full app (auth, admin, sharing, uploads) runs on **Vercel**. The Pages URL forwards there so `/math12/math1/` bookmarks still work.

### Setup

1. Import this repo at [vercel.com/new](https://vercel.com/new/import?s=https://github.com/HappyPotato9001/math12) (Next.js defaults are fine).
2. In Vercel → Project → **Settings → Environment Variables**, add (Production + Preview):
   - `AUTH_SECRET` — long random string
   - `AUTH_URL` — `https://YOUR_PROJECT.vercel.app`
   - `ADMIN_EMAIL` — e.g. `yui.inadome@gmail.com`
   - `ADMIN_PASSWORD` — if using email/password admin
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` (optional)
   - `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` (optional)
   - **Recommended:** `MONGODB_URI` + `MONGODB_DB=math12` so accounts survive cold starts (Atlas free tier is fine)
3. Add OAuth callback URLs:
   - `https://YOUR_PROJECT.vercel.app/api/auth/callback/google`
   - `https://YOUR_PROJECT.vercel.app/api/auth/callback/github`
4. Deploy (Vercel deploys on every push to `master`).
5. In GitHub → **Settings → Secrets and variables → Actions → Variables**, set:
   - `LIVE_APP_URL` = `https://YOUR_PROJECT.vercel.app` (no trailing slash)
6. Re-run the **Deploy GitHub Pages bridge** workflow (or push again).

Then [https://happypotato9001.github.io/math12/math1/](https://happypotato9001.github.io/math12/math1/) opens the Vercel app with working APIs.

Optional CI deploy secrets (if you use the Vercel Actions workflow): `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

## Access flow (Node server)

1. Student signs up → status `pending`
2. Admin signs in → `/admin` → Accept
3. Student can open Math 1 / Math 2 lessons and classwork

## What’s included

- Math 1 (Units 1–9) and Math 2 (Units 1–3) mapped to your class packets
- Unit PDFs in `public/textbook/`
- Digitized classwork drills on selected lessons
- Approval-gated accounts (MongoDB when `MONGODB_URI` is set; otherwise local/`/tmp` files)
