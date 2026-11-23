import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="orderPage">
      <div className="orderWrap">
        <div className="orderHeader">
          <Link href="/" className="logo"><span className="logoMark">13</span><span>Ministry OS</span></Link>
        </div>
        <section className="orderCard confirm">
          <div className="confirmIcon">📶</div>
          <span className="kicker">Offline mode</span>
          <h1>Ministry OS is still here.</h1>
          <p>After the service worker has installed successfully while online, the public Ministry app shell—including the landing page, service guidance, Next.js scripts and styles—and this offline screen are cached together. A newer shell is prepared in the background and waits for your Refresh choice before replacing the active version. Some previously viewed service images may also be retained when their host permits a size-checked download within the cache budget. Video streaming and playback are not cached for offline use; uncached or unsupported media still need internet. Cached public guidance can be out of date, and the browser may clear it to free device storage.</p>
          <p>Citizen service requests submitted while connected are saved to Firebase and can be retrieved by the same guest session when online. If you submit a request while offline, it is saved in this browser's local outbox and will be sent to Firebase after connectivity returns. Keep the app installed and reopen it online to allow synchronisation. The guest session is device-bound and is not legal identity verification. Staff Briefcase edits, messages, and other prototype-only records remain browser-local until their role-protected cloud workflows are implemented.</p>
          <p>Service images already cached can be viewed offline. New UploadThing uploads can be staged locally: selected images (4 MB) and videos (16 MB) are stored in IndexedDB and marked Pending Sync. When you reconnect with the matching media field open, the app uploads them to UploadThing and replaces the local reference only after confirmation. Pending media is device-specific, capped at 64 MB, and is not guaranteed to sync while the app is closed. External links, remote Firebase features and other server-dependent actions still need internet. Other offline text edits and Briefcase demo changes remain browser-local and are not queued for server delivery.</p>
          <p><strong>Before going offline:</strong> open Ministry OS while connected, visit the important service guidance and images, then reload once while still online so the latest app shell and eligible images can be prepared.</p>
          <div className="actions centered">
            <Link className="button buttonPrimary" href="/?view=account#service-order">Try citizen journey</Link>
            <Link className="button buttonLight" href="/">Open Ministry OS</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
