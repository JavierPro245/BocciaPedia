import { Injectable } from '@angular/core';

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
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

  return snapshot.data() as Match;

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

        snapshot.data() as Match

      );

    }

  );

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