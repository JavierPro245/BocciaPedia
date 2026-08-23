import { Injectable } from '@angular/core';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';

import { firestore } from '../firebase.config';
import { StorageService } from './storageService';
import { MediaItem } from '../models/media.models';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private readonly collectionName = 'media';

  constructor(private storageService: StorageService) {}

  listenMedia(
    type: 'photo' | 'video',
    callback: (items: MediaItem[]) => void
  ) {

    const ref = collection(firestore, this.collectionName);

    const q = query(
      ref,
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, snapshot => {

      const items: MediaItem[] = snapshot.docs.map(docSnap => {

        const data = docSnap.data() as any;

        return {

          id: docSnap.id,

          ...data,

          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt

        };

      });

      callback(items);

    });

  }

  async uploadMedia(
    file: File,
    type: 'photo' | 'video',
    title: string | undefined,
    user: User
  ): Promise<void> {

    const { url, path } = await this.storageService.uploadFile(
      file,
      `media/${type}s`
    );

    await this.saveMediaRecord(url, path, type, title, user);

  }

  /**
   * Igual que uploadMedia, pero recibe el archivo en base64 y lo sube
   * directo con StorageService.uploadBase64 — se usa en Android/iOS
   * para evitar armar un File con una conversión manual de bytes que,
   * para fotos/videos grandes, es demasiado lenta y nunca termina.
   */
  async uploadMediaFromBase64(
    base64: string,
    mimeType: string,
    type: 'photo' | 'video',
    title: string | undefined,
    user: User
  ): Promise<void> {

    const { url, path } = await this.storageService.uploadBase64(
      base64,
      mimeType,
      `media/${type}s`,
      title
    );

    await this.saveMediaRecord(url, path, type, title, user);

  }

  private async saveMediaRecord(
    url: string,
    path: string,
    type: 'photo' | 'video',
    title: string | undefined,
    user: User
  ): Promise<void> {

    const item: MediaItem = {

      type,

      url,

      storagePath: path,

      title,

      createdBy: user.uid,

      createdByName: user.displayName ?? undefined,

      createdAt: new Date()

    };

    const ref = collection(firestore, this.collectionName);

    await addDoc(ref, item);

  }

  async renameMedia(item: MediaItem, title: string): Promise<void> {

    if (!item.id) {
      return;
    }

    await updateDoc(
      doc(firestore, this.collectionName, item.id),
      { title }
    );

  }

  async deleteMedia(item: MediaItem): Promise<void> {

    if (item.storagePath) {

      await this.storageService.deleteFile(item.storagePath);

    }

    if (item.id) {

      await deleteDoc(doc(firestore, this.collectionName, item.id));

    }

  }

}
