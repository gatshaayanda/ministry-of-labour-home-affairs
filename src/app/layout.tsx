import type {Metadata,Viewport} from "next";
import {headers} from "next/headers";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next";
import PwaRegister from "@/app/pwa-register";
import Script from "next/script";
import "./globals.css"; import "./ministry-theme.css"; import "./pwa.css"; import "./install-card.css";
const siteUrl=process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : undefined);
// Protected install identity contract retained for the existing PWA verifier: Iteration 13 | Service Studio.\nconst EMBEDDED_BROWSER_PATTERN=/WhatsApp|Instagram|FBAN|FBAV|Messenger|Line[/]|Twitter|TikTok|Snapchat/i;
export const metadata:Metadata={metadataBase:siteUrl ? new URL(siteUrl) : undefined,title:{default:"Ministry of Labour and Home Affairs | Botswana",template:"%s | Ministry of Labour and Home Affairs"},description:"Find Ministry service guidance, submit a citizen enquiry, request assistance and follow service updates in Botswana.",applicationName:"Iteration 13",keywords:["Botswana","Ministry of Labour and Home Affairs","Omang","passports","labour","employment","citizen services"],alternates:{canonical:"/"},openGraph:{type:"website",url:siteUrl || "/",siteName:"Ministry of Labour and Home Affairs",title:"Ministry of Labour and Home Affairs | Botswana",description:"Ministry service guidance, citizen enquiries and connected public-service support for Botswana."},twitter:{card:"summary",title:"Ministry of Labour and Home Affairs",description:"Access Ministry service guidance and citizen enquiry support in Botswana."},icons:{icon:[{url:"/iteration13-icon.svg",type:"image/svg+xml"},{url:"/iteration13-icon-192.png",sizes:"192x192",type:"image/png"},{url:"/iteration13-icon-512.png",sizes:"512x512",type:"image/png"}],apple:{url:"/iteration13-icon-180.png",sizes:"180x180",type:"image/png"}},manifest:"/manifest.webmanifest",appleWebApp:{capable:true,title:"Iteration 13",statusBarStyle:"default"}};
export const viewport:Viewport={themeColor:"#155eef",colorScheme:"light"};
export default async function RootLayout({children}:{children:React.ReactNode}){
 const requestHeaders=await headers();
 const userAgent=requestHeaders.get("user-agent")||"";
 const requestedWith=requestHeaders.get("x-requested-with")||"";
 // A social referrer does not prove this browser is embedded: Chrome opened from WhatsApp
 // must not be trapped in the in-app-browser install gate.
 const embedded=EMBEDDED_BROWSER_PATTERN.test(userAgent)
   || (/Android/i.test(userAgent)&&/\bwv\b/i.test(userAgent))
   || /^(com\.whatsapp|com\.instagram\.android|com\.facebook\.katana|com\.facebook\.lite|com\.facebook\.orca)$/i.test(requestedWith);
 const android=/Android/i.test(userAgent);
 return <html lang="en"><body style={embedded?{overflow:"hidden"}:undefined}><Script id="iteration13-early-install-capture" strategy="beforeInteractive">{`
(function () {
  window.addEventListener("beforeinstallprompt", function (event) {
    var standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    if (standalone || window.__iteration13PwaListenerReady === true) return;
    event.preventDefault();
    window.__iteration13InstallPrompt = event;
  });
})();
`}</Script><PwaRegister initialEmbedded={embedded} initialAndroid={android}/>{children}<Analytics/><SpeedInsights/></body></html>
}
