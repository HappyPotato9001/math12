import fs from "fs";
import path from "path";

const BASE = process.env.SMOKE_BASE || "http://localhost:3000";

function walkLessons(root) {
  const out = [];
  function walk(dir, parts = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p, [...parts, ent.name]);
      else if (ent.name === "lesson.md" && parts.length === 3) {
        out.push(`/${parts[0]}/${parts[1]}/${parts[2]}`);
        out.push(`/${parts[0]}/${parts[1]}/${parts[2]}/practice`);
      }
    }
  }
  walk(root);
  return out;
}

function pdfsFromCurriculumFile() {
  const text = fs.readFileSync("src/lib/curriculum.ts", "utf8");
  return [
    ...new Set([...text.matchAll(/pdf:\s*"([^"]+)"/g)].map((m) => m[1])),
  ];
}

function topicSlugsFromCurriculum() {
  const text = fs.readFileSync("src/lib/curriculum.ts", "utf8");
  return [...text.matchAll(/lesson\(\d+,\s*"([^"]+)"/g)].map((m) => m[1]);
}

async function check(url) {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { Accept: "text/html,application/json,*/*" },
    });
    return {
      url,
      status: res.status,
      location: res.headers.get("location"),
    };
  } catch (e) {
    return { url, status: 0, error: e.message };
  }
}

function isProtectedOk(result) {
  if (result.status === 307 || result.status === 302 || result.status === 303) {
    const loc = result.location || "";
    return loc.includes("/login") || loc.includes("/pending");
  }
  return result.status === 200;
}

function isOk(result) {
  return result.status >= 200 && result.status < 400;
}

const cookieJar = new Map();

function storeCookies(res) {
  const raw = res.headers.getSetCookie?.() || [];
  for (const c of raw) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) cookieJar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function loginAsAdmin() {
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`, {
    headers: { cookie: cookieHeader() },
  });
  storeCookies(csrfRes);
  const { csrfToken } = await csrfRes.json();

  const body = new URLSearchParams({
    csrfToken,
    email: process.env.ADMIN_EMAIL || "admin@math12.local",
    password: process.env.ADMIN_PASSWORD || "changeme",
    callbackUrl: `${BASE}/learning`,
    json: "true",
  });

  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      cookie: cookieHeader(),
    },
    body,
    redirect: "manual",
  });
  storeCookies(res);
  return res.status;
}

async function checkAuthed(url) {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: {
        Accept: "text/html,*/*",
        cookie: cookieHeader(),
      },
    });
    return {
      url,
      status: res.status,
      location: res.headers.get("location"),
      html: res.status === 200 ? await res.text() : "",
    };
  } catch (e) {
    return { url, status: 0, error: e.message, html: "" };
  }
}

const publicRoutes = ["/", "/login", "/signup", "/pending"];
const protectedRoutes = [
  "/learning",
  "/sharing",
  "/practice-tests",
  "/admin",
  "/math1",
  "/math2",
];

const topicRoutes = walkLessons("content");
const pdfs = pdfsFromCurriculumFile();
const curriculumSlugs = topicSlugsFromCurriculum();
const contentDirs = walkLessons("content")
  .filter((u) => !u.endsWith("/practice"))
  .map((u) => u.split("/").pop());

const broken = [];
const warnings = [];

console.log("Base:", BASE);
console.log("Topics from content:", contentDirs.length);
console.log("Lessons in curriculum.ts:", curriculumSlugs.length);

const missingContent = curriculumSlugs.filter((s) => !contentDirs.includes(s));
const orphanContent = contentDirs.filter((s) => !curriculumSlugs.includes(s));
if (missingContent.length) {
  broken.push({ type: "curriculum-missing-content", items: missingContent });
}
if (orphanContent.length) {
  warnings.push({ type: "orphan-content", items: orphanContent });
}

console.log("\n== Public pages ==");
for (const route of publicRoutes) {
  const r = await check(`${BASE}${route}`);
  const ok =
    (r.status >= 200 && r.status < 400) ||
    ((r.status === 307 || r.status === 302) &&
      (r.location || "").includes("/login"));
  console.log(ok ? "OK" : "FAIL", r.status, route, r.location || "");
  if (!ok) broken.push(r);
}

console.log("\n== Protected pages (logged out) ==");
for (const route of protectedRoutes) {
  const r = await check(`${BASE}${route}`);
  const ok = isProtectedOk(r);
  console.log(ok ? "OK" : "FAIL", r.status, route, r.location || "");
  if (!ok) broken.push(r);
}

console.log("\n== Topic lesson + practice routes (logged out) ==");
let topicFail = 0;
for (const route of topicRoutes) {
  const r = await check(`${BASE}${route}`);
  if (!isProtectedOk(r)) {
    topicFail += 1;
    broken.push(r);
    console.log("FAIL", r.status, route, r.location || r.error || "");
  }
}
console.log(`Checked ${topicRoutes.length}, failures: ${topicFail}`);

console.log("\n== PDF assets ==");
let pdfFail = 0;
for (const pdf of pdfs) {
  const disk = path.join("public", pdf.replace(/^\//, ""));
  const exists = fs.existsSync(disk);
  const r = await check(`${BASE}${pdf}`);
  if (!(exists && r.status === 200)) {
    pdfFail += 1;
    broken.push({ pdf, exists, ...r });
    console.log("FAIL", r.status, pdf, exists ? "" : "(missing on disk)");
  }
}
console.log(`Checked ${pdfs.length} PDFs, failures: ${pdfFail}`);

console.log("\n== Crawl public HTML links ==");
const pageQueue = new Set(["/", "/login", "/signup"]);
const seen = new Set();

async function getHtml(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) return "";
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return "";
  return res.text();
}

while (pageQueue.size) {
  const route = pageQueue.values().next().value;
  pageQueue.delete(route);
  if (seen.has(route)) continue;
  seen.add(route);

  const html = await getHtml(`${BASE}${route}`);
  if (!html) continue;

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    let href = match[1];
    if (
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#") ||
      href.startsWith("javascript:")
    ) {
      continue;
    }
    if (href.startsWith("http")) {
      if (!href.startsWith(BASE)) continue;
      href = href.slice(BASE.length) || "/";
    }
    if (!href.startsWith("/")) continue;
    const pathOnly = href.split("?")[0].split("#")[0];
    if (
      pathOnly.startsWith("/api/") ||
      pathOnly.startsWith("/_next/") ||
      pathOnly.match(/\.(png|jpg|jpeg|svg|ico|css|js)$/)
    ) {
      continue;
    }

    const r = await check(`${BASE}${pathOnly}`);
    const protectedPath = [
      "/math1",
      "/math2",
      "/learning",
      "/sharing",
      "/practice-tests",
      "/admin",
    ].some((p) => pathOnly === p || pathOnly.startsWith(`${p}/`));
    const ok = protectedPath ? isProtectedOk(r) : isOk(r) || isProtectedOk(r);
    if (!ok) {
      broken.push({ from: route, href: pathOnly, ...r });
      console.log("BROKEN LINK", route, "->", pathOnly, r.status);
    } else if (
      !seen.has(pathOnly) &&
      !protectedPath &&
      /^\/(login|signup|pending)?$/.test(pathOnly)
    ) {
      pageQueue.add(pathOnly);
    }
  }
}

console.log("\n== Authenticated admin session ==");
const loginStatus = await loginAsAdmin();
console.log("credentials callback status:", loginStatus);
const meRes = await fetch(`${BASE}/api/auth/me`, {
  headers: { cookie: cookieHeader() },
});
const me = await meRes.json();
console.log("session user:", me.user?.email || me.user || null, me.user?.status);

if (!me.user || me.user.status !== "approved") {
  broken.push({ type: "auth-login-failed", me, loginStatus });
} else {
  const loginPage = await checkAuthed(`${BASE}/login?next=%2Fpractice-tests`);
  const loginRedirectOk =
    (loginPage.status === 307 || loginPage.status === 308) &&
    (loginPage.location || "").includes("/practice-tests");
  console.log(
    loginRedirectOk ? "OK" : "FAIL",
    loginPage.status,
    "/login?next=/practice-tests",
    loginPage.location || "",
  );
  if (!loginRedirectOk) {
    broken.push({ type: "authenticated-login-page", ...loginPage });
  }

  const authedPages = [
    "/learning",
    "/sharing",
    "/practice-tests",
    "/admin",
    "/math1",
    "/math2",
    "/math1/unit-1/growing-dots",
    "/math1/unit-1/growing-dots/practice",
    "/math2/unit-3/inumbers",
    "/math2/unit-3/inumbers/practice",
    "/math1/unit-9/two-way-streets",
    "/math2/unit-2/transformers-shifty-ys",
  ];

  for (const route of authedPages) {
    const r = await checkAuthed(`${BASE}${route}`);
    const redirectedAway =
      (r.status === 307 || r.status === 302) &&
      (r.location || "").includes("/login");
    const ok = r.status === 200 && !redirectedAway;
    console.log(ok ? "OK" : "FAIL", r.status, route, r.location || "");
    if (!ok) broken.push({ type: "authed-page", ...r });

    if (ok && r.html) {
      const hrefs = [...r.html.matchAll(/href="(\/[^"]+)"/g)].map((m) => m[1]);
      for (const href of hrefs) {
        const pathOnly = href.split("?")[0].split("#")[0];
        if (
          pathOnly.startsWith("/api/") ||
          pathOnly.startsWith("/_next/") ||
          pathOnly.match(/\.(png|jpg|jpeg|svg|ico|css|js)$/)
        ) {
          continue;
        }
        const link = await checkAuthed(`${BASE}${pathOnly}`);
        // Allow redirects to other in-app pages
        const softOk =
          link.status === 200 ||
          ((link.status === 307 || link.status === 302) &&
            link.location &&
            !link.location.includes("/login"));
        if (!softOk && link.status === 404) {
          broken.push({ from: route, href: pathOnly, ...link });
          console.log("BROKEN AUTH LINK", route, "->", pathOnly, link.status);
        }
      }
    }
  }

  // Spot-check every topic returns 200 when authed
  let authedTopicFail = 0;
  for (const route of topicRoutes) {
    const r = await checkAuthed(`${BASE}${route}`);
    if (r.status !== 200) {
      authedTopicFail += 1;
      broken.push({ type: "authed-topic", ...r });
      console.log("FAIL AUTH TOPIC", r.status, route, r.location || "");
    }
  }
  console.log(
    `Authed topic routes checked: ${topicRoutes.length}, failures: ${authedTopicFail}`,
  );
}

console.log("\n== Summary ==");
console.log("Broken count:", broken.length);
if (warnings.length) console.log("Warnings:", JSON.stringify(warnings, null, 2));
if (broken.length) {
  console.log(JSON.stringify(broken.slice(0, 40), null, 2));
  process.exit(1);
}
console.log("All checks passed.");
