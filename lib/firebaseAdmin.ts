import 'server-only';

import admin from 'firebase-admin';

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

let adminAuth: admin.auth.Auth | null = null;
let adminFirestore: admin.firestore.Firestore | null = null;

if (!admin.apps.length) {
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    // Not initializing admin SDK in environments without credentials (local client dev)
    // Server endpoints should check and fail gracefully if admin not initialized.
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
}

if (admin.apps.length) {
  adminAuth = admin.auth();
  adminFirestore = admin.firestore();
}

export { adminAuth, adminFirestore };
export async function getServerDocuments<T = any>(collectionName: string): Promise<Array<T & { id: string }>> {
  // Check if adminFirestore is initialized, otherwise throw a clear error or return empty array
  if (!adminFirestore) {
    console.error("Firebase Admin SDK is not initialized. Check your environment variables.");
    return [];
  }

  try {
    const snapshot = await adminFirestore.collection(collectionName).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as T),
    }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
}
export function emailToId(email: string) {
  return email.replaceAll('.', ',').replaceAll('@', '-at-');
}

export default admin;
