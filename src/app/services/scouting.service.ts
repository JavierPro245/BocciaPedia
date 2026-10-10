import { Injectable } from '@angular/core';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

import { firestore } from '../firebase.config';

import { ScoutingPlay, ScoutingReport } from '../models/scouting.model';

@Injectable({
  providedIn: 'root'
})
export class ScoutingService {

  private readonly collectionName = 'scouting';

  private report!: ScoutingReport;

  constructor() {}

  //====================================
  // Compartir reporte entre pantallas
  //====================================

  setReport(report: ScoutingReport) {
    this.report = report;
  }

  getReport() {
    return this.report;
  }

  clearReport() {
    this.report = undefined as any;
  }

  //====================================
  // Escuchar reportes del entrenador
  //====================================

  listenReportsByTrainer(
    trainerId: string,
    callback: (reports: ScoutingReport[]) => void
  ) {

    const ref = collection(firestore, this.collectionName);

    const q = query(
      ref,
      where('trainerId', '==', trainerId)
    );

    return onSnapshot(q, snapshot => {

      const reports: ScoutingReport[] = snapshot.docs.map(docSnap => {

        const data = docSnap.data() as any;

        return {

          id: docSnap.id,

          ...data,

          date: data.date?.toDate ? data.date.toDate() : data.date,

          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : data.updatedAt

        };

      });

      callback(reports);

    });

  }

  //====================================
  // Crear
  //====================================

  async createReport(report: ScoutingReport): Promise<string> {

    const ref = collection(firestore, this.collectionName);

    const docRef = await addDoc(ref, report);

    return docRef.id;

  }

  //====================================
  // Actualizar
  //====================================

  async updateReportFields(
    id: string,
    data: Partial<ScoutingReport>
  ): Promise<void> {

    const ref = doc(firestore, this.collectionName, id);

    await updateDoc(ref, {
      ...data,
      updatedAt: new Date()
    });

  }

  //====================================
  // Jugadas
  //====================================

  async savePlays(id: string, plays: ScoutingPlay[]): Promise<void> {

    const ref = doc(firestore, this.collectionName, id);

    await updateDoc(ref, {
      plays,
      updatedAt: new Date()
    });

  }

  //====================================
  // Eliminar
  //====================================

  async deleteReport(id: string): Promise<void> {

    const ref = doc(firestore, this.collectionName, id);

    await deleteDoc(ref);

  }

}
