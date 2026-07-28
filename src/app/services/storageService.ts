import { Injectable } from '@angular/core';

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  async uploadImage(
    file: File,
    folder: string
  ): Promise<string> {

    const fileName =
      `${Date.now()}_${file.name}`;

    const storageRef = ref(
      storage,
      `${folder}/${fileName}`
    );

    await uploadBytes(
      storageRef,
      file
    );

    return await getDownloadURL(
      storageRef
    );

  }

  async deleteImage(imageUrl: string) {

  try {

    const imageRef = ref(storage, imageUrl);

    await deleteObject(imageRef);

  } catch (error) {

    console.warn(
      'No fue posible eliminar la imagen.',
      error
    );

  }

}

}