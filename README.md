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

## GitHub Pages

Pushes to `master`/`main` build a static export and deploy to:

[https://happypotato9001.github.io/math12/](https://happypotato9001.github.io/math12/)

```bash
npm run build:pages
```

Lessons, classwork, and PDFs work on Pages. Sign-in, admin approval, sharing uploads, and practice-test uploads need the Node server (`npm run dev` / `npm start`).

## Access flow (Node server)

1. Student signs up → status `pending`
2. Admin signs in → `/admin` → Accept
3. Student can open Math 1 / Math 2 lessons and classwork

## What’s included

- Math 1 (Units 1–9) and Math 2 (Units 1–3) mapped to your class packets
- Unit PDFs in `public/textbook/`
- Digitized classwork drills on selected lessons
- Approval-gated accounts stored in `data/users.json` (server mode)

