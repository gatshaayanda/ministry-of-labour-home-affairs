"use client";

import { signInAnonymously, type User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

export type MinistryRequestInput = {
  id: string;
  serviceId: string;
  serviceName: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  preferredLanguage: "en" | "tn";
  createdAt: string;
};

export type MinistryCloudRequest = MinistryRequestInput & {
  citizenId: string;
  status: "submitted";
  updatedAt: string;
  channel: "web";
};

const OUTBOX_KEY = "ministry:citizen-request-outbox:v1";
let citizenAuthPromise: Promise<User> | null = null;
let outboxSyncPromise: Promise<{ synced: number; remaining: number; error?: string }> | null = null;

async function ensureCitizen(): Promise<User> {
  if (auth.currentUser) return auth.currentUser;
  if (!citizenAuthPromise) {
    citizenAuthPromise = signInAnonymously(auth).then(credential => credential.user).finally(() => { citizenAuthPromise = null; });
  }
  return citizenAuthPromise;
}

export async function saveMinistryCitizenRequest(input: MinistryRequestInput): Promise<{ uid: string }> {
  const user = await ensureCitizen();
  const now = new Date().toISOString();
  const profileRef = doc(db, "citizens", user.uid);
  const existingProfile = await getDoc(profileRef);
  const existingProfileData = existingProfile.data();
  const existingCreatedAt = typeof existingProfileData?.createdAt === "string"
    ? existingProfileData.createdAt as string
    : now;

  await setDoc(profileRef, {
    uid: user.uid,
    displayName: input.fullName.slice(0, 100),
    email: input.email.slice(0, 254),
    phone: input.phone.slice(0, 40),
    preferredLanguage: input.preferredLanguage,
    createdAt: existingCreatedAt,
    updatedAt: now,
  }, { merge: true });

  const requestRef = doc(db, "serviceRequests", input.id);
  const existingRequest = await getDoc(requestRef);
  const existingRequestData = existingRequest.data();
  if (existingRequest.exists() && existingRequestData?.citizenId === user.uid) return { uid: user.uid };

  const request: MinistryCloudRequest = {
    citizenId: user.uid,
    serviceId: input.serviceId.slice(0, 120),
    serviceName: input.serviceName.slice(0, 160),
    fullName: input.fullName.slice(0, 100),
    email: input.email.slice(0, 254),
    phone: input.phone.slice(0, 40),
    message: input.message.slice(0, 4000),
    preferredLanguage: input.preferredLanguage,
    status: "submitted",
    createdAt: input.createdAt,
    updatedAt: now,
    channel: "web",
  };
  await setDoc(requestRef, request);
  return { uid: user.uid };
}

export function queueMinistryCitizenRequest(input: MinistryRequestInput): void {
  try {
    const raw = window.localStorage.getItem(OUTBOX_KEY);
    const queue = raw ? JSON.parse(raw) as MinistryRequestInput[] : [];
    const safeQueue = Array.isArray(queue) ? queue.filter(item => item && typeof item.id === "string") : [];
    if (!safeQueue.some(item => item.id === input.id)) safeQueue.push(input);
    window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(safeQueue.slice(-100)));
  } catch {
    throw new Error("This browser could not save the request for later synchronisation.");
  }
}

export function syncMinistryCitizenOutbox(): Promise<{ synced: number; remaining: number; error?: string }> {
  if (outboxSyncPromise) return outboxSyncPromise;
  outboxSyncPromise = (async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return { synced: 0, remaining: readOutbox().length, error: "offline" };
    const queue = readOutbox();
    let synced = 0;
    let errorCode: string | undefined;
    for (const item of queue) {
      try {
        await saveMinistryCitizenRequest(item);
        removeFromOutbox(item.id);
        synced += 1;
      } catch (error) {
        errorCode = typeof error === "object" && error && "code" in error ? String(error.code) : "sync-failed";
        // Keep unsent requests locally. A later online event or explicit retry can try again.
        break;
      }
    }
    return { synced, remaining: readOutbox().length, ...(errorCode ? { error: errorCode } : {}) };
  })().finally(() => { outboxSyncPromise = null; });
  return outboxSyncPromise;
}

function readOutbox(): MinistryRequestInput[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(OUTBOX_KEY) || "[]");
    return Array.isArray(value) ? value.filter(item => item && typeof item.id === "string") as MinistryRequestInput[] : [];
  } catch { return []; }
}

function removeFromOutbox(id: string): void {
  try { window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(readOutbox().filter(item => item.id !== id))); } catch {}
}

export async function loadMyMinistryRequests(): Promise<Array<MinistryCloudRequest & { id: string }>> {
  const user = await ensureCitizen();
  const snapshot = await getDocs(query(collection(db, "serviceRequests"), where("citizenId", "==", user.uid)));
  return snapshot.docs.map(item => ({ id: item.id, ...(item.data() as MinistryCloudRequest) }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
