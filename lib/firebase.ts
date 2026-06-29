import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
}

async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

const linkedInProvider = new OAuthProvider('linkedin.com');
linkedInProvider.addScope('r_liteprofile');
linkedInProvider.addScope('r_emailaddress');

async function getDocuments<T = DocumentData>(collectionName: string): Promise<Array<T & { id: string }>> {
  const querySnapshot = await getDocs(collection(firestore, collectionName));
  return querySnapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as T),
  }));
}

async function getDocument<T = DocumentData>(collectionName: string, documentId: string): Promise<(T & { id: string }) | null> {
  const documentRef = doc(firestore, collectionName, documentId);
  const documentSnapshot = await getDoc(documentRef);

  if (!documentSnapshot.exists()) {
    return null;
  }

  return {
    id: documentSnapshot.id,
    ...(documentSnapshot.data() as T),
  };
}

function emailToId(email: string) {
  return email.replaceAll('.', ',').replaceAll('@', '-at-');
}

async function getUserByEmail<T = DocumentData>(email: string): Promise<((T & { id: string }) | null)> {
  const id = emailToId(email);
  return getDocument<T>('users', id);
}

async function registerUserToFirestore(email: string, displayName?: string, role = 'user'): Promise<string> {
  const id = emailToId(email);
  const data = {
    uid: null,
    email,
    displayName: displayName || null,
    role,
    createdAt: serverTimestamp(),
    authCreated: false,
  } as DocumentData;

  await setDocument('users', id, data);
  return id;
}

async function createDocument<T = DocumentData>(collectionName: string, data: T): Promise<string> {
  const documentRef = await addDoc(collection(firestore, collectionName), data as DocumentData);
  return documentRef.id;
}

async function setDocument<T = DocumentData>(collectionName: string, documentId: string, data: T): Promise<void> {
  const documentRef = doc(firestore, collectionName, documentId);
  await setDoc(documentRef, data as DocumentData, { merge: true });
}

async function updateDocument<T = DocumentData>(collectionName: string, documentId: string, data: Partial<T>): Promise<void> {
  const documentRef = doc(firestore, collectionName, documentId);
  await updateDoc(documentRef, data as Partial<DocumentData>);
}

async function deleteDocument(collectionName: string, documentId: string): Promise<void> {
  // Firestore expects the document id/path segment to be a string.
  // Defensive guard prevents runtime crashes like: "n.indexOf is not a function".
  const safeId = typeof documentId === 'string' ? documentId : String(documentId);
  if (!safeId || safeId === 'undefined' || safeId === 'null') {
    throw new Error(`deleteDocument: invalid documentId for collection "${collectionName}": ${String(documentId)}`);
  }

  const documentRef = doc(firestore, collectionName, safeId);
  await deleteDoc(documentRef);
}

async function signUpWithEmailPassword(email: string, password: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  try {
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        role: 'user',
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    // swallow — user was created in Auth; Firestore write failure shouldn't block signup flow here
    // caller can update Firestore record later
    // eslint-disable-next-line no-console
    console.error('Failed to create Firestore user document:', err);
  }

  return user;
}

async function signInWithEmailPassword(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

async function signOutUser(): Promise<void> {
  await signOut(auth);
}

async function signInWithGoogle(): Promise<User> {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
}

async function signInWithFacebook(): Promise<User> {
  const userCredential = await signInWithPopup(auth, facebookProvider);
  return userCredential.user;
}

async function signInWithLinkedIn(): Promise<User> {
  const userCredential = await signInWithPopup(auth, linkedInProvider);
  return userCredential.user;
}

async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

async function sendUserVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user available for email verification.');
  }
  await sendEmailVerification(user);
}

async function updateUserProfile(profile: { displayName?: string; photoURL?: string }): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user available for profile update.');
  }
  await updateProfile(user, profile);
}

function onAuthStateChange(listener: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, listener);
}

export {
  app,
  auth,
  firestore,
  storage,
  getDocuments,
  getDocument,
  getUserByEmail,
  createDocument,
  setDocument,
  registerUserToFirestore,
  updateDocument,
  deleteDocument,
  signUpWithEmailPassword,
  signInWithEmailPassword,
  signInWithGoogle,
  signInWithFacebook,
  signInWithLinkedIn,
  signOutUser,
  sendPasswordReset,
  sendUserVerificationEmail,
  updateUserProfile,
  onAuthStateChange,
  uploadFile,
  deleteFile
};
