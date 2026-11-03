/**
 * GitHub Pages cannot run Next.js API routes / auth / middleware.
 * This build emits a tiny static site that forwards every path to the
 * live Node app (Vercel), so https://….github.io/math12/… still works
 * with full APIs.
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
  <title>Math 1/2 — setup needed</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: "Segoe UI", system-ui, sans-serif; background: #f7fbf8; color: #152018; }
    main { max-width: 36rem; padding: 2rem; }
    code { background: #e8f1eb; padding: 0.1em 0.35em; border-radius: 4px; }
    a { color: #1f7a4d; }
  </style>
</head>
<body>
  <main>
    <h1>Connect the live API app</h1>
    <p>GitHub Pages is static and cannot run sign-in, admin, sharing, or uploads by itself.</p>
    <ol>
      <li>Import this repo on <a href="https://vercel.com/new">Vercel</a> (Framework: Next.js).</li>
      <li>Add env vars from <code>.env.example</code> (<code>AUTH_SECRET</code>, OAuth, admin…).</li>
      <li>In the GitHub repo → Settings → Secrets and variables → Actions → Variables, set
        <code>LIVE_APP_URL</code> to your Vercel URL (e.g. <code>https://math12.vercel.app</code>).</li>
      <li>Re-run the <strong>Deploy GitHub Pages bridge</strong> workflow.</li>
    </ol>
    <p>After that, <code>/math12/math1/</code> opens the full app with working APIs.</p>
  </main>
</body>
</html>`;
  write("index.html", setup);
  write("404.html", setup);
  console.log("LIVE_APP_URL unset — published setup instructions on Pages.");
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
  <p>Opening the live Math 1/2 app with APIs… <a href="${live}/">Continue</a></p>
</body>
</html>
`;

write("index.html", html);
write("404.html", html);
console.log(`GitHub Pages bridge → ${live}`);
