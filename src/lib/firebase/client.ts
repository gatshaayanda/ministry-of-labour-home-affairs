import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "min-of-labour-home-affairs";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDjG_5c-Kzm0sa4JrctNgXq15TCx_320pY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "min-of-labour-home-affairs.firebaseapp.com",
  projectId: firebaseProjectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "min-of-labour-home-affairs.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "4299012209",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:4299012209:web:fc3fd40b128492c81383d0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-C4F6J6Y7KE",
};
export const hasFirebaseWebConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId && firebaseConfig.messagingSenderId);
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Existing conversation attachments still use the Firebase Storage SDK.
// New Ministry media uploads should use the approved UploadThing flow.
export const storage = getStorage(app);
export const db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
export { app };
