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

## Live site (GitHub Student Developer Pack)

GitHub Pages is **static** and cannot run API routes. Use pack benefits:

| Pack offer | What we use it for |
| --- | --- |
| **Heroku** ($13/mo credit × 24 months) | Runs the Next.js server (auth, admin, sharing, uploads) |
| **MongoDB Atlas** ($50 credits) | Durable storage for accounts, posts, and files |

### Setup

1. Redeem **Heroku** + **MongoDB Atlas** at [education.github.com/pack](https://education.github.com/pack).
2. In Atlas, create a free/student cluster → Database Access + Network Access (`0.0.0.0/0` for Heroku) → copy `MONGODB_URI`.
3. Create a Heroku app and connect this GitHub repo (**Deploy → GitHub**), or:
   ```bash
   heroku login
   heroku create math12-study
   heroku git:remote -a math12-study
   ```
4. Set Heroku config (Dashboard → Settings → Config Vars, or CLI):
   ```bash
   heroku config:set AUTH_SECRET="$(openssl rand -hex 32)"
   heroku config:set AUTH_URL=https://YOUR_APP.herokuapp.com
   heroku config:set MONGODB_URI="mongodb+srv://..."
   heroku config:set MONGODB_DB=math12
   heroku config:set ADMIN_EMAIL=yui.inadome@gmail.com
   # plus AUTH_GOOGLE_* / AUTH_GITHUB_* if using OAuth
   ```
5. Add OAuth callbacks for `https://YOUR_APP.herokuapp.com/api/auth/callback/google` (and GitHub).
6. Deploy (push to `master`, or Heroku GitHub auto-deploy).
7. In GitHub → Settings → Variables → Actions, set `LIVE_APP_URL=https://YOUR_APP.herokuapp.com`.
8. Re-run **Deploy GitHub Pages bridge**.

Then [https://happypotato9001.github.io/math12/math1/](https://happypotato9001.github.io/math12/math1/) opens the Heroku app with working APIs.

## Access flow (Node server)

1. Student signs up → status `pending`
2. Admin signs in → `/admin` → Accept
3. Student can open Math 1 / Math 2 lessons and classwork

## What’s included

- Math 1 (Units 1–9) and Math 2 (Units 1–3) mapped to your class packets
- Unit PDFs in `public/textbook/`
- Digitized classwork drills on selected lessons
- Approval-gated accounts stored in `data/users.json` (server mode)

