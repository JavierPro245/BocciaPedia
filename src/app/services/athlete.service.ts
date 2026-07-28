import { Injectable } from '@angular/core';

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

import { firestore } from '../firebase.config';
import { Athlete } from '../models/athlete.model';

@Injectable({
  providedIn: 'root'
})
export class AthleteService {

  private readonly collectionName = 'athletes';

  constructor() {}

  // =====================================
  // Escuchar deportistas del entrenador
  // =====================================

  listenAthletesByTrainer(
    trainerId: string,
    callback: (athletes: Athlete[]) => void
  ) {

    const ref = collection(
      firestore,
      this.collectionName
    );

    const q = query(
      ref,
      where('trainerId', '==', trainerId)
    );

    return onSnapshot(q, snapshot => {

      const athletes: Athlete[] = snapshot.docs.map(doc => ({

        id: doc.id,

        ...(doc.data() as Omit<Athlete, 'id'>)

      }));

      callback(athletes);

    });

  }

  // =====================================
// Escuchar un deportista
// =====================================

listenAthlete(
  id: string,
  callback: (athlete: Athlete | null) => void
) {

  const ref = doc(
    firestore,
    this.collectionName,
    id
  );

  return onSnapshot(ref, snapshot => {

    if (!snapshot.exists()) {

      callback(null);

      return;

    }

    callback({

      id: snapshot.id,

      ...(snapshot.data() as Omit<Athlete, 'id'>)

    });

  });

}

  // =====================================
  // Obtener uno
  // =====================================

  async getAthlete(id: string): Promise<Athlete | null> {

    const ref = doc(
      firestore,
      this.collectionName,
      id
    );

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<Athlete, 'id'>)
    };

  }

  // =====================================
  // Crear
  // =====================================

  async createAthlete(
    data: Partial<Athlete>,
    trainerId: string
  ) {

    const ref = collection(
      firestore,
      this.collectionName
    );

    const athlete: any = {

      rut: data.rut ?? '',

      firstName: data.firstName ?? '',

      lastName: data.lastName ?? '',

      fullName: `${data.firstName} ${data.lastName}`,

      trainerId,

      linkedUserId: null,

      email: data.email ?? '',

      phone: data.phone ?? '',

      club: data.club ?? '',

      category: data.category,

      dominantHand: data.dominantHand,

      observations: data.observations ?? '',

      active: data.active ?? true,

      createdAt: new Date(),

      updatedAt: new Date()

    };

    if (data.birthDate) athlete.birthDate = data.birthDate;
    if (data.gender) athlete.gender = data.gender;
    if (data.photo) athlete.photo = data.photo;
    if (data.nationality) athlete.nationality = data.nationality;
    if (data.city) athlete.city = data.city;
    if (data.federation) athlete.federation = data.federation;
    if (data.ranking !== undefined) athlete.ranking = data.ranking;

    return await addDoc(ref, athlete);

  }

  // =====================================
  // Actualizar
  // =====================================

  async updateAthlete(
    id: string,
    athlete: Partial<Athlete>
  ) {

    const ref = doc(
      firestore,
      this.collectionName,
      id
    );

    return await updateDoc(ref, athlete);

  }


  // =====================================
// Vincular usuario
// =====================================

async linkUserToAthlete(
  athleteId: string,
  userUid: string
) {

  const ref = doc(
    firestore,
    this.collectionName,
    athleteId
  );

  await updateDoc(ref, {

    linkedUserId: userUid,

    updatedAt: new Date()

  });

}

  // =====================================
  // Eliminar
  // =====================================

  async deleteAthlete(id: string) {

    const ref = doc(
      firestore,
      this.collectionName,
      id
    );

    return await deleteDoc(ref);

  }

}