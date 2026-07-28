import { Injectable } from '@angular/core';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

import { firestore } from '../firebase.config';

import { Evaluation } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private readonly collectionName = 'evaluations';

  private evaluation!: Evaluation;

  constructor() {}

  //====================================
  // Compartir evaluación entre pantallas
  //====================================

  setEvaluation(evaluation: Evaluation) {
    this.evaluation = evaluation;
  }

  getEvaluation() {
    return this.evaluation;
  }

  //====================================
  // Escuchar evaluaciones del entrenador
  //====================================

  listenEvaluationsByTrainer(
    trainerId: string,
    callback: (evaluations: Evaluation[]) => void
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

      const evaluations: Evaluation[] = snapshot.docs.map(doc => {

  const data = doc.data() as any;

  return {

    id: doc.id,

    ...data,

    date: data.date?.toDate ? data.date.toDate() : data.date,

    updatedAt: data.updatedAt?.toDate
      ? data.updatedAt.toDate()
      : data.updatedAt

  };

});

      callback(evaluations);

    });

  }

  //====================================
// Escuchar evaluaciones del deportista
//====================================

listenEvaluationsByAthlete(
  athleteId: string,
  callback: (evaluations: Evaluation[]) => void
) {

  const ref = collection(
    firestore,
    this.collectionName
  );

  const q = query(
    ref,
    where('athleteId', '==', athleteId)
  );

  return onSnapshot(q, snapshot => {

    const evaluations: Evaluation[] = snapshot.docs.map(doc => {

      const data = doc.data() as any;

      return {

        id: doc.id,

        ...data,

        date: data.date?.toDate
          ? data.date.toDate()
          : data.date,

        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : data.updatedAt

      };

    });

    callback(evaluations);

  });

}

  //====================================
  // Escuchar una evaluación
  //====================================

  listenEvaluation(
    id: string,
    callback: (evaluation: Evaluation | null) => void
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

        ...(snapshot.data() as Omit<Evaluation, 'id'>)

      });

    });

  }

  //====================================
  // Obtener una evaluación
  //====================================

  async getEvaluationById(id: string): Promise<Evaluation | null> {

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

      ...(snapshot.data() as Omit<Evaluation, 'id'>)

    };

  }

  //====================================
  // Crear
  //====================================

  async createEvaluation(
  evaluation: Evaluation
): Promise<string> {

  const ref = collection(
    firestore,
    this.collectionName
  );

  const docRef = await addDoc(
    ref,
    evaluation
  );

  return docRef.id;

}

  //====================================
  // Actualizar
  //====================================

  async updateEvaluation(
    id: string,
    evaluation: Partial<Evaluation>
  ) {

    const ref = doc(
      firestore,
      this.collectionName,
      id
    );

    return await updateDoc(ref, evaluation);

  }

  //====================================
// Guardar lanzamientos
//====================================

async saveThrows(
  evaluationId: string,
  throws: any[]
) {

  const ref = doc(
    firestore,
    this.collectionName,
    evaluationId
  );

  return await updateDoc(ref, {

    throwList: throws,

    currentThrow: throws.length,

    updatedAt: new Date()

  });

}

async updateEvaluationFields(
  evaluationId: string,
  data: Partial<Evaluation>
): Promise<void> {

  const ref = doc(
    firestore,
    this.collectionName,
    evaluationId
  );

  await updateDoc(ref, {
    ...data,
    updatedAt: new Date()
  });

}

  //====================================
  // Eliminar
  //====================================

  async deleteEvaluation(id: string) {

    const ref = doc(
      firestore,
      this.collectionName,
      id
    );

    return await deleteDoc(ref);

  }

  private detailViewMode: 'preview' | 'finish' = 'preview';

setDetailViewMode(mode: 'preview' | 'finish') {
  this.detailViewMode = mode;
}

getDetailViewMode(): 'preview' | 'finish' {
  return this.detailViewMode;
}

}