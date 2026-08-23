import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';

import { MediaService } from 'src/app/services/media.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SessionService } from 'src/app/services/session.service';
import { MediaItem } from 'src/app/models/media.models';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
  standalone: false
})
export class VideosPage implements OnInit {

  videos: MediaItem[] = [];

  uploading = false;

  constructor(

    private mediaService: MediaService,

    private permissionService: PermissionService,

    private sessionService: SessionService,

    private alertController: AlertController,

    private toastController: ToastController

  ) { }

  ngOnInit() {

    this.mediaService.listenMedia('video', items => {

      this.videos = items;

    });

  }

  get canManage(): boolean {

    return this.permissionService.hasAnyRole(['admin', 'trainer']);

  }

  async uploadVideo(): Promise<void> {

    const user = this.sessionService.getUser();

    if (!user || this.uploading) {
      return;
    }

    try {

      const result = await FilePicker.pickVideos({

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
          pickedFile.name ?? `video_${Date.now()}.mp4`,
          { type: pickedFile.mimeType ?? 'video/mp4' }
        );

        await this.mediaService.uploadMedia(file, 'video', file.name, user);

      // ANDROID / IOS — se sube el base64 directo, sin pasar por un
      // File intermedio (esa conversión manual, byte a byte, con
      // videos de varios MB nunca terminaba).
      } else if (pickedFile.data) {

        const name = pickedFile.name ?? `video_${Date.now()}.mp4`;

        await this.mediaService.uploadMediaFromBase64(
          pickedFile.data,
          pickedFile.mimeType ?? 'video/mp4',
          'video',
          name,
          user
        );

      } else {

        throw new Error('No fue posible obtener los datos del video.');

      }

    } catch (error) {

      console.error('Error subiendo video:', error);

      const toast = await this.toastController.create({

        message: 'No se pudo subir el video.',

        duration: 2500,

        color: 'danger'

      });

      await toast.present();

    } finally {

      this.uploading = false;

    }

  }

  async renameVideo(item: MediaItem): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Renombrar video',

      inputs: [
        {
          name: 'title',
          type: 'text',
          value: item.title ?? '',
          placeholder: 'Nombre del video'
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

  async deleteVideo(item: MediaItem): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Eliminar video',

      message: '¿Seguro que quieres eliminar este video?',

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
