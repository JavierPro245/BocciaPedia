import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';

import { MediaService } from 'src/app/services/media.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SessionService } from 'src/app/services/session.service';
import { MediaItem } from 'src/app/models/media.models';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
  standalone: false
})
export class PhotosPage implements OnInit {

  photos: MediaItem[] = [];

  uploading = false;

  previewItem: MediaItem | null = null;

  constructor(

    private mediaService: MediaService,

    private permissionService: PermissionService,

    private sessionService: SessionService,

    private alertController: AlertController,

    private toastController: ToastController

  ) { }

  ngOnInit() {

    this.mediaService.listenMedia('photo', items => {

      this.photos = items;

    });

  }

  get canManage(): boolean {

    return this.permissionService.hasAnyRole(['admin', 'trainer']);

  }

  openPreview(item: MediaItem): void {

    this.previewItem = item;

  }

  closePreview(): void {

    this.previewItem = null;

  }

  async uploadPhoto(): Promise<void> {

    const user = this.sessionService.getUser();

    if (!user || this.uploading) {
      return;
    }

    try {

      const result = await FilePicker.pickImages({

        limit: 1,

        readData: true

      });

      if (!result.files.length) {
        return;
      }

      const pickedFile = result.files[0];

      this.uploading = true;

      // WEB
      if (pickedFile.blob) {

        const file = new File(
          [pickedFile.blob],
          pickedFile.name ?? `foto_${Date.now()}.jpg`,
          { type: pickedFile.mimeType ?? 'image/jpeg' }
        );

        await this.mediaService.uploadMedia(file, 'photo', file.name, user);

      // ANDROID / IOS — se sube el base64 directo, sin pasar por un
      // File intermedio (esa conversión manual, byte a byte, con
      // fotos de resolución completa nunca terminaba).
      } else if (pickedFile.data) {

        const name = pickedFile.name ?? `foto_${Date.now()}.jpg`;

        await this.mediaService.uploadMediaFromBase64(
          pickedFile.data,
          pickedFile.mimeType ?? 'image/jpeg',
          'photo',
          name,
          user
        );

      } else {

        throw new Error('No fue posible obtener los datos de la foto.');

      }

    } catch (error) {

      console.error('Error subiendo foto:', error);

      const toast = await this.toastController.create({

        message: 'No se pudo subir la foto.',

        duration: 2500,

        color: 'danger'

      });

      await toast.present();

    } finally {

      this.uploading = false;

    }

  }

  async renamePhoto(item: MediaItem): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Renombrar foto',

      inputs: [
        {
          name: 'title',
          type: 'text',
          value: item.title ?? '',
          placeholder: 'Nombre de la foto'
        }
      ],

      buttons: [

        { text: 'Cancelar', role: 'cancel' },

        {

          text: 'Guardar',

          handler: async (data) => {

            const title = (data.title ?? '').trim();

            if (!title) {
              return;
            }

            await this.mediaService.renameMedia(item, title);

          }

        }

      ]

    });

    await alert.present();

  }

  async deletePhoto(item: MediaItem): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Eliminar foto',

      message: '¿Seguro que quieres eliminar esta foto?',

      buttons: [

        { text: 'Cancelar', role: 'cancel' },

        {

          text: 'Eliminar',

          role: 'destructive',

          handler: async () => {

            await this.mediaService.deleteMedia(item);

          }

        }

      ]

    });

    await alert.present();

  }

}
