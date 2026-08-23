export interface MediaItem {

  id?: string;

  type: 'photo' | 'video';

  url: string;

  // Ruta dentro de Firebase Storage (no la URL), necesaria para
  // poder borrar el archivo después.
  storagePath: string;

  title?: string;

  createdBy: string;

  createdByName?: string;

  createdAt: Date;

}
