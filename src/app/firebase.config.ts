import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { environment } from '../environments/environment';

const app = initializeApp(environment.firebase);

export const auth = getAuth(app);

// Cache local persistente (IndexedDB): permite leer datos ya vistos
// (evaluaciones, partidos) y seguir guardando lanzamientos/cambios sin
// conexión — Firestore encola los cambios y los sincroniza solo al
// recuperar internet, sin necesidad de lógica de sync manual.
export const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({})
  })
});

export const storage = getStorage(app);