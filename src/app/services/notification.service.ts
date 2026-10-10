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
import { AppNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly collectionName = 'notifications';

  constructor() {}

  listenByUser(
    userId: string,
    callback: (notifications: AppNotification[]) => void
  ) {

    const ref = collection(firestore, this.collectionName);

    const q = query(ref, where('userId', '==', userId));

    return onSnapshot(q, snapshot => {

      const notifications: AppNotification[] = snapshot.docs.map(docSnap => {

        const data = docSnap.data() as any;

        return {

          id: docSnap.id,

          ...data,

          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt

        };

      });

      notifications.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      callback(notifications);

    });

  }

  async create(notification: Omit<AppNotification, 'id'>): Promise<void> {

    const ref = collection(firestore, this.collectionName);

    await addDoc(ref, notification);

  }

  async markAsRead(id: string): Promise<void> {

    const ref = doc(firestore, this.collectionName, id);

    await updateDoc(ref, { read: true });

  }

  async delete(id: string): Promise<void> {

    const ref = doc(firestore, this.collectionName, id);

    await deleteDoc(ref);

  }

}
