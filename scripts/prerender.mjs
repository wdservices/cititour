/**
 * scripts/prerender.mjs
 *
 * Runs after `vite build`. Serves the built app locally, visits each route
 * in a real headless browser, waits for React to render, and saves the
 * fully-rendered HTML back into the dist folder at the matching path so
 * Vercel serves complete HTML for these routes without requiring the
 * crawler to execute JavaScript.
 *
 * Usage: node scripts/prerender.mjs
 * (wired to run automatically via the "postbuild" npm script)
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import handler from 'serve-handler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PORT = 5005;

// -----------------------------------------------------------------------
// Every route you want fully prerendered.
// Static/known routes go here directly. For content that comes from your
// database (e.g. individual business or event listings), see the optional
// Firestore-fetch block further down.
// -----------------------------------------------------------------------
const STATIC_ROUTES = [
  '/',
  '/nigeria/lagos',
  '/nigeria/abuja',
  '/nigeria/rivers',
  '/nigeria/kano',
  '/nigeria/imo',
  '/nigeria/kaduna',
  '/split-it',
  '/list-your-business',
  '/host-an-event',
  '/docs',
  '/privacy',
  '/terms',
  '/auth',
  '/blog',
];

// Dynamically extract blog post slugs from blogPosts.ts
function getBlogRoutes() {
  const blogPostsPath = path.join(__dirname, '..', 'src', 'content', 'blogPosts.ts');
  if (!fs.existsSync(blogPostsPath)) {
    console.warn('blogPosts.ts not found — skipping blog routes');
    return [];
  }
  const content = fs.readFileSync(blogPostsPath, 'utf-8');
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  const slugs = [];
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  return slugs.map((slug) => `/blog/${slug}`);
}

// Optional — pull dynamic routes from Firestore at build time.
// Requires firebase-admin and a FIREBASE_SERVICE_ACCOUNT env var.
// Uncomment and adapt the collection name / field names to match your schema.
//
// import { initializeApp, cert } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';
//
// async function getDynamicRoutes() {
//   initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
//   const db = getFirestore();
//   const routes = [];
//
//   const businesses = await db.collection('businesses').get();
//   businesses.forEach((doc) => routes.push(`/events/${doc.id}`));
//
//   const events = await db.collection('events').get();
//   events.forEach((doc) => routes.push(`/events/${doc.id}`));
//
//   return routes;
// }

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist/ not found — run `vite build` first.');
    process.exit(1);
  }

  // Skip prerendering on Vercel — headless Chromium isn't reliably available
  if (process.env.VERCEL) {
    console.log('Skipping prerender on Vercel.');
    return;
  }

  // 1. Serve the built app locally so the headless browser can visit it
  const server = createServer((req, res) =>
    handler(req, res, {
      public: DIST_DIR,
      rewrites: [{ source: '**', destination: '/index.html' }],
    })
  );
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Local server running at http://localhost:${PORT}`);

  // 2. Combine static + blog + (optional) dynamic routes.
  let routes = [...STATIC_ROUTES, ...getBlogRoutes()];
  // const dynamicRoutes = await getDynamicRoutes();
  // routes = [...routes, ...dynamicRoutes];

  // 3. Launch headless Chrome once, reuse for every route.
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  for (const route of routes) {
    try {
      const page = await browser.newPage();
      const url = `http://localhost:${PORT}${route}`;
      console.log(`Prerendering ${route} ...`);

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait for React to have mounted content into #root
      await page
        .waitForFunction(
          () => {
            const root = document.querySelector('#root');
            return root && root.children.length > 0 && root.textContent.trim().length > 0;
          },
          { timeout: 10000 }
        )
        .catch(() =>
          console.warn(`  warning: content check timed out for ${route}, saving whatever rendered`)
        );

      // Small extra buffer for late-finishing async state updates
      await new Promise((r) => setTimeout(r, 800));

      const html = await page.content();

      // 4. Write rendered HTML to the matching path in dist/.
      const outputDir = route === '/' ? DIST_DIR : path.join(DIST_DIR, route);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(path.join(outputDir, 'index.html'), html);

      console.log(`  saved -> dist${route === '/' ? '' : route}/index.html`);
      await page.close();
    } catch (err) {
      console.error(`  FAILED prerendering ${route}:`, err.message);
    }
  }

  await browser.close();
  server.close();
  console.log(`\nPrerendering complete — ${routes.length} routes processed.`);
}

main().catch((err) => {
  console.error('Prerender script failed:', err);
  process.exit(1);
});
