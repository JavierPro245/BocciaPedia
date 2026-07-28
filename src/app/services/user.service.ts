import { Injectable } from '@angular/core';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';

import { firestore } from '../firebase.config';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersRef = collection(firestore, 'users');

  constructor() {}

  // =====================================
  // Obtener todos
  // =====================================

  async getUsers(): Promise<User[]> {

    const q = query(
      this.usersRef,
      orderBy('displayName')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => doc.data() as User);

  }

  // =====================================
  // Escuchar todos
  // =====================================

  listenUsers(callback: (users: User[]) => void) {

    const q = query(
      this.usersRef,
      orderBy('displayName')
    );

    return onSnapshot(q, snapshot => {

      const users = snapshot.docs.map(doc => doc.data() as User);

      callback(users);

    });

  }

  // =====================================
  // Escuchar usuarios disponibles
  // =====================================

  listenAvailableUsers(callback: (users: User[]) => void) {

  const q = query(
    this.usersRef,
    where('athleteId', '==', null)
  );

  return onSnapshot(q, snapshot => {

    const users = snapshot.docs.map(doc => doc.data() as User);

    callback(users);

  });

}

  // =====================================
  // Obtener uno
  // =====================================

  async getUser(uid: string): Promise<User | null> {

    const document = await getDoc(
      doc(firestore, 'users', uid)
    );

    if (!document.exists()) {
      return null;
    }

    return document.data() as User;

  }

  // =====================================
  // Actualizar
  // =====================================

  async updateUser(
    uid: string,
    data: Partial<User>
  ) {

    await updateDoc(
      doc(firestore, 'users', uid),
      data
    );

  }

  // =====================================
  // Guardar cambios
  // =====================================

  async saveUser(user: User) {

    await updateDoc(

      doc(firestore, 'users', user.uid),

      {

        roles: user.roles,

        approved: user.approved,

        active: user.active,

        updatedAt: serverTimestamp()

      }

    );

  }

  // =====================================
// Vincular deportista
// =====================================

async linkAthlete(
  uid: string,
  athleteId: string
) {

  await updateDoc(
    doc(firestore, 'users', uid),
    {
      athleteId,
      updatedAt: serverTimestamp()
    }
  );

}

// =====================================
// Desvincular deportista
// =====================================

async unlinkAthlete(uid: string) {

  await updateDoc(
    doc(firestore, 'users', uid),
    {
      athleteId: null,
      updatedAt: serverTimestamp()
    }
  );

}

}