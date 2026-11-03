# Math 1/2 Study Lab

Study site for Integrated Math 1 and 2, centered on your class textbook units, with digitized classwork and a **server-backed class room** for sharing notes and work photos.

## Run locally (with server storage)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Shared class data is written under:

- `data/store.json` — rooms, members, posts, comments
- `data/images/` — uploaded work photos

Production:

```bash
npm run build
npm run start
```

## What’s included

- Math 1 (Units 1–9) and Math 2 (Units 1–3) mapped to your class packets
- Unit PDFs in `public/textbook/`
- Digitized classwork on selected lessons
- Server APIs for rooms / posts / comments / images so classmates share one feed

## API

- `POST /api/rooms` — create or join
- `GET /api/rooms/:code` — room + posts
- `POST /api/rooms/:code/posts` — share work
- `GET /api/rooms/:code/posts/:id` — one post + comments
- `POST /api/rooms/:code/posts/:id/comments`
- `POST /api/images` — upload compressed image data URL
- `GET /api/images/:id` — fetch image bytes

## Deploy note

GitHub Pages is static-only, so this app needs a Node host (`npm run start`) such as Railway, Render, Fly.io, or a school VPS with a persistent disk for the `data/` folder.
