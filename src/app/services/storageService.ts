import { Injectable } from '@angular/core';

import {
  ref,
  uploadBytes,
  uploadString,
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

  /**
   * Igual que uploadImage, pero además devuelve la ruta dentro de
   * Storage (no solo la URL de descarga) — la necesitan los ítems
   * de Media para poder borrarse después.
   */
  async uploadFile(
    file: File,
    folder: string
  ): Promise<{ url: string; path: string }> {

    const fileName =
      `${Date.now()}_${file.name}`;

    const path = `${folder}/${fileName}`;

    const storageRef = ref(
      storage,
      path
    );

    await uploadBytes(
      storageRef,
      file
    );

    const url = await getDownloadURL(
      storageRef
    );

    return { url, path };

  }

  /**
   * Sube un archivo ya codificado en base64 (sin extensión de datos,
   * el "data:...;base64," ya recortado) directo a Storage. Evita el
   * conversor manual base64 -> Uint8Array carácter por carácter, que
   * para fotos de resolución completa desde el celular (varios MB de
   * texto base64) bloquea el hilo principal el tiempo suficiente para
   * que la subida nunca llegue a completarse.
   */
  async uploadBase64(
    base64: string,
    mimeType: string,
    folder: string,
    nameHint?: string
  ): Promise<{ url: string; path: string }> {

    const extension = mimeType.split('/')[1] ?? 'dat';

    const safeHint = (nameHint ?? 'archivo').replace(/\.[^/.]+$/, '');

    const fileName = `${Date.now()}_${safeHint}.${extension}`;

    const path = `${folder}/${fileName}`;

    const storageRef = ref(
      storage,
      path
    );

    await uploadString(
      storageRef,
      base64,
      'base64',
      { contentType: mimeType }
    );

    const url = await getDownloadURL(
      storageRef
    );

    return { url, path };

  }

  async deleteFile(path: string) {

    try {

      await deleteObject(ref(storage, path));

    } catch (error) {

      console.warn(
        'No fue posible eliminar el archivo.',
        error
      );

    }

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