import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { env } from './env';

const buildFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  if (env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };

    return initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
    });
  }

  return initializeApp();
};

export const firestore = getFirestore(buildFirebaseApp());
