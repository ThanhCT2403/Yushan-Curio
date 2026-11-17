import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { sanitizeCollectorProfilePayload } from '../utils/storeLogic';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

if (typeof window !== 'undefined') {
  void testConnection();
}

export interface RemoteCollectorProfile {
  uid: string;
  email: string;
  displayName: string;
  wishlistIds: string[];
  recentProductIds: string[];
}

export function subscribeCollectorProfile(
  user: User,
  validProductIds: Set<string>,
  onProfile: (profile: RemoteCollectorProfile | null) => void,
  onPermissionError?: (err: Error) => void,
): Unsubscribe {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);

  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        onProfile(null);
        return;
      }
      const raw = snapshot.data();
      const sanitized = sanitizeCollectorProfilePayload(
        {
          uid: typeof raw.uid === 'string' ? raw.uid : user.uid,
          email: typeof raw.email === 'string' ? raw.email : (user.email ?? ''),
          displayName:
            typeof raw.displayName === 'string' ? raw.displayName : (user.displayName ?? ''),
          wishlistIds: Array.isArray(raw.wishlistIds) ? raw.wishlistIds : [],
          recentProductIds: Array.isArray(raw.recentProductIds) ? raw.recentProductIds : [],
        },
        validProductIds,
      );
      onProfile(sanitized);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (wrapped) {
        if (onPermissionError && wrapped instanceof Error) {
          onPermissionError(wrapped);
        }
      }
    },
  );
}

export async function syncCollectorProfile(
  user: User,
  wishlistIds: string[],
  recentProductIds: string[],
  validProductIds: Set<string>,
): Promise<void> {
  if (!user.emailVerified || !user.email) {
    return;
  }

  const sanitized = sanitizeCollectorProfilePayload(
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? user.email.split('@')[0] ?? 'Collector',
      wishlistIds,
      recentProductIds,
    },
    validProductIds,
  );

  if (!sanitized.uid || !sanitized.email) {
    return;
  }

  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);

  try {
    const existingSnap = await getDoc(ref);
    if (!existingSnap.exists()) {
      await setDoc(ref, {
        uid: sanitized.uid,
        email: sanitized.email,
        displayName: sanitized.displayName,
        wishlistIds: sanitized.wishlistIds,
        recentProductIds: sanitized.recentProductIds,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        email: sanitized.email,
        displayName: sanitized.displayName,
        wishlistIds: sanitized.wishlistIds,
        recentProductIds: sanitized.recentProductIds,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
