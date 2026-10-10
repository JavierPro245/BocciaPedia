import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

import { firestore } from '../firebase.config';
import { NotificationSoundService } from './notification-sound.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private registered = false;

  constructor(
    private router: Router,
    private notificationSound: NotificationSoundService
  ) {}

  // Se llama una vez el usuario ya inició sesión (ver app.component.ts).
  async initialize(uid: string): Promise<void> {

    if (!Capacitor.isNativePlatform() || this.registered) {
      return;
    }

    this.registered = true;

    const permission = await PushNotifications.requestPermissions();

    if (permission.receive !== 'granted') {
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', async token => {

      try {

        await updateDoc(doc(firestore, 'users', uid), {
          fcmTokens: arrayUnion(token.value)
        });

      } catch (error) {

        console.error('Error guardando token de push:', error);

      }

    });

    PushNotifications.addListener('registrationError', error => {

      console.error('Error registrando push:', error);

    });

    // Notificación recibida con la app ABIERTA (primer plano): Android
    // no muestra su propio aviso del sistema en ese caso, así que acá
    // es donde tiene sentido sonar con el tono que el usuario eligió
    // en Configuración. Con la app en segundo plano o cerrada, es el
    // sistema operativo el que arma la notificación y suena su propio
    // tono (eso requeriría registrar sonidos nativos por canal al
    // compilar la app, no es algo que se pueda elegir en tiempo real).
    PushNotifications.addListener('pushNotificationReceived', () => {

      this.notificationSound.playSelected();

    });

    // El usuario tocó la notificación (app en segundo plano/cerrada).
    PushNotifications.addListener('pushNotificationActionPerformed', action => {

      const link = action.notification.data?.link;

      if (link) {
        this.router.navigateByUrl(link);
      }

    });

  }

}
