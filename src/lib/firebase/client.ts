import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseProjectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "min-of-labour-home-affairs";

const firebaseConfig = {
  // Firebase Web App credentials are supplied from this Ministry project's
  // Firebase Console settings. The project ID is known; never guess API keys.
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "build-placeholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${firebaseProjectId}.firebaseapp.com`,
  projectId: firebaseProjectId,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "build-placeholder",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "build-placeholder",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const hasFirebaseWebConfig = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
export { app };
