import { Injectable } from '@angular/core';

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

import { firestore } from '../firebase.config';
import { Match } from '../pages/matches/models/match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchRepositoryService {

  private matchesRef = collection(
    firestore,
    'matches'
  );

  constructor() {}

  // Partidos guardados antes de agregar la lista de penalizaciones no
  // tienen el campo `penalties` (tenían un único `penalty` suelto).
  // Se normaliza acá para que el resto de la app no tenga que
  // preocuparse por documentos viejos.
  // `id` recibe el id REAL del documento de Firestore, no el que haya
  // quedado guardado como campo dentro del documento: createMatch()
  // no puede conocer su propio id hasta que addDoc() termina, así que
  // ese campo quedaba vacío para siempre si no se corrige acá.
  private normalizeMatch(data: any, id: string): Match {

    return {
      ...data,
      id,
      penalties: Array.isArray(data?.penalties) ? data.penalties : [],
      // Partidos guardados antes de agregar género/bandera/informe no
      // tienen estos campos.
      gender: data?.gender ?? 'mixed',
      redImage: data?.redImage ?? '',
      blueImage: data?.blueImage ?? '',
      reportUrl: data?.reportUrl ?? '',
      reportGeneratedAt: data?.reportGeneratedAt ?? 0,
      // Partidos guardados antes de registrar el tiempo usado por END
      // no tienen esos dos campos en cada elemento de `ends`.
      ends: Array.isArray(data?.ends)
        ? data.ends.map((end: any) => ({
            ...end,
            redTimeUsed: end?.redTimeUsed ?? 0,
            blueTimeUsed: end?.blueTimeUsed ?? 0
          }))
        : []
    } as Match;

  }

  // =====================================
// Crear partido
// =====================================

async createMatch(match: Match): Promise<string> {

  const document = await addDoc(

    this.matchesRef,

    {

      ...match,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp()

    }

  );

  // Recién acá se conoce el id real: se completa el campo `id` del
  // propio documento para que quede consistente de ahora en más
  // (antes quedaba vacío para siempre).
  await updateDoc(document, { id: document.id });

  return document.id;

}

// =====================================
// Actualizar partido
// =====================================

async updateMatch(
  id: string,
  match: Match
) {

  await updateDoc(

    doc(
      firestore,
      'matches',
      id
    ),

    {

      ...match,

      updatedAt: serverTimestamp()

    }

  );

}

// =====================================
// Obtener partido
// =====================================

async getMatch(id: string): Promise<Match | null> {

  const snapshot = await getDoc(

    doc(
      firestore,
      'matches',
      id
    )

  );

  if (!snapshot.exists()) {

    return null;

  }

  return this.normalizeMatch(snapshot.data(), snapshot.id);

}

// =====================================
// Escuchar partido
// =====================================

listenMatch(

  id: string,

  callback: (match: Match | null) => void

) {

  return onSnapshot(

    doc(
      firestore,
      'matches',
      id
    ),

    snapshot => {

      if (!snapshot.exists()) {

        callback(null);

        return;

      }

      callback(

        this.normalizeMatch(snapshot.data(), snapshot.id)

      );

    }

  );

}

// =====================================
// Partidos en curso (para la sección de "en vivo" de deportistas)
// =====================================

listenLiveMatches(
  callback: (matches: Match[]) => void
) {

  const liveQuery = query(
    this.matchesRef,
    where('state', 'in', ['waiting', 'red-turn', 'blue-turn', 'rest'])
  );

  return onSnapshot(liveQuery, snapshot => {

    const matches = snapshot.docs.map(docSnap =>
      this.normalizeMatch(docSnap.data(), docSnap.id)
    );

    callback(matches);

  });

}

// =====================================
// Eliminar partido
// =====================================

async deleteMatch(id: string) {

  await deleteDoc(

    doc(
      firestore,
      'matches',
      id
    )

  );

}

}