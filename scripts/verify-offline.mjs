import fs from "node:fs";

const read = path => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const sw = read("../public/sw.js");
const page = read("../src/app/page.tsx");
const offline = read("../src/app/offline/page.tsx");
const pwaRegister = read("../src/app/pwa-register.tsx");
const pwaCss = read("../src/app/pwa.css");
const manifest = JSON.parse(read("../public/manifest.webmanifest"));
const layout = read("../src/app/layout.tsx");
const media = read("../src/lib/offline-media.ts");
const servicePicker = read("../src/app/ServiceMediaPicker.tsx");
const announcementPicker = read("../src/app/AnnouncementImagePicker.tsx");
const citizenCloud = read("../src/lib/ministry-citizen-cloud.ts");
const account = read("../src/app/AccountWorkspace.tsx");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const shellCache = sw.match(/const CACHE_VERSION = "([^"]+)"/)?.[1];
const mediaCache = sw.match(/const MEDIA_CACHE = "([^"]+)"/)?.[1];
check(shellCache === "ministry-os-shell-v1", "Ministry must use its own versioned app-shell cache, separate from Iteration 13");
check(mediaCache === "ministry-os-media-v1", "Ministry must use its own versioned media cache");
check(page.includes('caches.open("' + shellCache + '")'), "the connectivity indicator must inspect the exact Ministry shell cache");
check(sw.includes('const required = path === "/" || path === "/offline"') && sw.includes("if (required) throw error;"), "home and offline fallback must be stored successfully before the service worker can install");
check(sw.includes("const criticalAssets = [...discovered]") && sw.includes("Required app-shell asset returned") && sw.includes("await shell.put(request, response);"), "Next.js JavaScript and CSS must be precached before installation succeeds");
check(sw.includes("for (const match of html.matchAll") && sw.includes("/_next\\/static\\/"), "the app shell must discover versioned Next.js assets from its HTML");
check(sw.includes("function isSafePublicHtml") && sw.includes("responseOrigin === self.location.origin") && sw.includes("sensitiveQuery.test(key)") && sw.includes("private|no-store"), "only safe same-origin public HTML may be cached");
check(sw.includes("networkFirstNavigation(request, event)") && sw.includes("event.preloadResponse") && sw.includes("navigationPreload.enable()"), "public navigation must use network-first with optional navigation preload");
check(sw.includes('const isPrivate =') && sw.includes('url.pathname.startsWith("/api/")'), "private routes and API endpoints must remain outside public offline caching");
check(sw.includes('return await cache.match(request) || await cache.match("/") || await cache.match("/offline")'), "offline public navigation must fall back to cached content and the offline route");
check(sw.includes('event.waitUntil(self.skipWaiting())') && sw.includes('event.data?.type === "SKIP_WAITING"'), "a waiting update must activate only after the explicit user refresh action");
check(pwaRegister.includes('register("/sw.js", { updateViaCache: "none" })') && pwaRegister.includes("await registration.update()"), "service worker registration and update checks must bypass stale HTTP caching");
check(pwaRegister.includes('window.addEventListener("online", online)') && pwaRegister.includes('document.addEventListener("visibilitychange", visibilityChange)'), "returning online or reopening the app must check for updates");
check(pwaRegister.includes("event.preventDefault()") && pwaRegister.includes("void install()") && pwaRegister.includes("prompt.prompt()"), "native install prompt must be captured and invoked directly from the user's install action");
check(layout.includes("iteration13-early-install-capture") && layout.includes("beforeInteractive") && layout.includes('applicationName:"Iteration 13"'), "protected early install capture and verified PWA application identity must remain intact");
check(manifest.display === "standalone" && manifest.start_url === "/" && manifest.scope === "/" && manifest.name === "Iteration 13 | Service Studio", "installed PWA manifest identity, scope and standalone mode must remain valid");
check(sw.includes('request.destination === "image"') && sw.includes("isApprovedMediaUrl(request.url)") && sw.includes('startsWith("image/")'), "only approved image CDN requests may use the bounded media cache");
check(sw.includes("const MEDIA_LIMIT = 24") && sw.includes("const MEDIA_MAX_BYTES = 4 * 1024 * 1024") && sw.includes('response.type !== "opaque"'), "media caching must enforce entry, byte and readable-response limits");
check(sw.includes("ministry-os-shell-") && sw.includes("ministry-os-media-") && sw.includes('key.startsWith("iteration13-shell-")'), "activation must remove obsolete Ministry and inherited Iteration 13 cache versions");
check(page.includes('window.localStorage.setItem(getStorageKey(STORAGE_KEY), JSON.stringify(data))'), "workspace changes must be persisted locally before success feedback");
check(page.includes('type: "CACHE_MEDIA"') && page.includes("data.services.filter(service => service.mediaType !== \"video\")") && page.includes("data.announcementImage"), "eligible service and announcement images must be prepared for offline use");
check(media.includes("indexedDB.open(DB_NAME,1)") && media.includes("MAX_PENDING_BYTES=64*1024*1024") && media.includes("navigator.storage?.estimate?.()"), "offline media must persist files in bounded IndexedDB storage with quota checks");
check(servicePicker.includes("saveOfflineMedia(file)") && announcementPicker.includes("saveOfflineMedia(file)"), "service and announcement pickers must stage selected files locally while offline");
check(servicePicker.includes("syncOfflineMedia(id") && announcementPicker.includes("syncOfflineMedia(id"), "pending media must retry through UploadThing when connectivity returns and the matching picker is active");
check(citizenCloud.includes("OUTBOX_KEY") && citizenCloud.includes("syncMinistryCitizenOutbox") && citizenCloud.includes("outboxSyncPromise"), "citizen enquiries must remain queued locally and synchronise serially after reconnecting");
check(page.includes("queueMinistryCitizenRequest(cloudRequest)") && page.includes("void syncMinistryCitizenOutbox()"), "citizen submission must save locally first and synchronise without blocking the journey");
check(account.includes("if (!online || !navigator.onLine)") && account.includes("Upload"), "offline account messaging must remain available while remote uploads are blocked");
check(offline.includes("not queued for server delivery") && offline.includes("images") && offline.toLowerCase().includes("video streaming"), "offline guidance must clearly explain cached images, video limits and non-sync boundaries");
check(page.includes("App shell saved") && page.includes("shell.match(\"/offline\")"), "the visible connectivity status must verify both the cached home page and offline fallback");
check(pwaCss.includes(".pwaUpdate{position:fixed") && pwaCss.includes("bottom:auto"), "update-ready prompt must remain compact and clear of bottom navigation/actions");

if (failures.length) {
  console.error("MINISTRY OFFLINE VERIFICATION FAILED");
  failures.forEach(failure => console.error(" - " + failure));
  process.exit(1);
}
console.log("MINISTRY OFFLINE VERIFIED — isolated versioned shell, safe offline navigation, bounded image cache, local enquiry/media persistence, and protected PWA installation.");
