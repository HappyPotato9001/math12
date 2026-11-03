/**
 * GitHub Pages cannot run Next.js API routes.
 * This emits a static bridge that forwards /math12/… to the live Heroku app
 * (GitHub Student Developer Pack).
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "out");
const live = (process.env.LIVE_APP_URL || "").replace(/\/$/, "");
const pagesPrefix = "/math12";

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

function write(name, body) {
  fs.writeFileSync(path.join(outDir, name), body);
}

if (!live) {
  const setup = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Math 1/2 — Student Pack setup</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: "Segoe UI", system-ui, sans-serif; background: #f7fbf8; color: #152018; }
    main { max-width: 40rem; padding: 2rem; }
    code { background: #e8f1eb; padding: 0.1em 0.35em; border-radius: 4px; }
    a { color: #1f7a4d; }
  </style>
</head>
<body>
  <main>
    <h1>Use the GitHub Student Developer Pack</h1>
    <p>Pages is static. APIs run on <strong>Heroku</strong> + <strong>MongoDB Atlas</strong> from the pack.</p>
    <ol>
      <li>Open <a href="https://education.github.com/pack">education.github.com/pack</a> and redeem <strong>Heroku</strong> + <strong>MongoDB Atlas</strong>.</li>
      <li>Create a free Atlas cluster and copy the connection string.</li>
      <li>Create a Heroku app from this repo (Deploy → GitHub, or <code>heroku create</code>).</li>
      <li>Set Heroku config vars: <code>AUTH_SECRET</code>, <code>AUTH_URL</code>, <code>MONGODB_URI</code>, <code>ADMIN_EMAIL</code>, OAuth keys.</li>
      <li>In GitHub → Settings → Variables → Actions, set <code>LIVE_APP_URL</code> to <code>https://YOUR_APP.herokuapp.com</code>.</li>
      <li>Re-run <strong>Deploy GitHub Pages bridge</strong>.</li>
    </ol>
  </main>
</body>
</html>`;
  write("index.html", setup);
  write("404.html", setup);
  console.log("LIVE_APP_URL unset — published Student Pack setup page.");
  process.exit(0);
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Math 1/2 Study Lab</title>
  <meta http-equiv="refresh" content="0;url=${live}/" />
  <script>
    (function () {
      var live = ${JSON.stringify(live)};
      var prefix = ${JSON.stringify(pagesPrefix)};
      var path = location.pathname || "/";
      if (path.indexOf(prefix) === 0) {
        path = path.slice(prefix.length) || "/";
      }
      if (path.charAt(0) !== "/") path = "/" + path;
      location.replace(live + path + location.search + location.hash);
    })();
  </script>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: "Segoe UI", system-ui, sans-serif;
      background: #f7fbf8;
      color: #152018;
    }
    a { color: #1f7a4d; }
  </style>
</head>
<body>
  <p>Opening the live Math 1/2 app… <a href="${live}/">Continue</a></p>
</body>
</html>
`;

write("index.html", html);
write("404.html", html);
console.log(`GitHub Pages bridge → ${live}`);
