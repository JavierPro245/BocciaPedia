import { Component } from '@angular/core';

import { NotificationSoundService, NotificationSoundOption } from 'src/app/services/notification-sound.service';

@Component({
  selector: 'app-notification-sound',
  templateUrl: './notification-sound.page.html',
  styleUrls: ['./notification-sound.page.scss'],
  standalone: false
})
export class NotificationSoundPage {

  selected: string;

  constructor(private soundService: NotificationSoundService) {

    this.selected = this.soundService.getSelected();

  }

  get sounds(): NotificationSoundOption[] {

    return this.soundService.sounds;

  }

  // Al tocar una fila: la selecciona Y la reproduce al toque, igual
  // que el selector de tonos de notificación de WhatsApp.
  choose(option: NotificationSoundOption): void {

    this.selected = option.id;

    this.soundService.setSelected(option.id);

    this.soundService.play(option.id);

  }

}
