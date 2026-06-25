import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";

// Server-only. Never import this file from a "use client" component —
// it reads the service-account private key from env.
function getAdminApp(): App {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Vercel env vars escape newlines; restore them.
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

/** Verifies a Firebase ID token sent from the client. Throws if invalid/expired. */
export async function verifyIdToken(idToken: string) {
  const app = getAdminApp();
  return getAdminAuth(app).verifyIdToken(idToken);
}
