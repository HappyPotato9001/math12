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

Live app: [https://math12-nu.vercel.app/](https://math12-nu.vercel.app/)  
GitHub Pages: [https://happypotato9001.github.io/math12/](https://happypotato9001.github.io/math12/) → forwards to Vercel.

In Vercel → **Settings → Environment Variables**, make sure these are set (Production):

- `AUTH_SECRET` — long random string  
- `AUTH_URL` — `https://math12-nu.vercel.app`  
- `ADMIN_EMAIL` — e.g. `yui.inadome@gmail.com`  
- OAuth keys if you use Google/GitHub sign-in  
- **Recommended:** `MONGODB_URI` + `MONGODB_DB=math12` so accounts survive cold starts  

OAuth callbacks:

- `https://math12-nu.vercel.app/api/auth/callback/google`
- `https://math12-nu.vercel.app/api/auth/callback/github`


## Access flow (Node server)

1. Student signs up → status `pending`
2. Admin signs in → `/admin` → Accept
3. Student can open Math 1 / Math 2 lessons and classwork

## What’s included

- Math 1 (Units 1–9) and Math 2 (Units 1–3) mapped to your class packets
- Unit PDFs in `public/textbook/`
- Digitized classwork drills on selected lessons
- Approval-gated accounts (MongoDB when `MONGODB_URI` is set; otherwise local/`/tmp` files)
