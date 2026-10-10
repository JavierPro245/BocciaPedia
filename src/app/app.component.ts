import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { ThemeService } from './services/theme.service';
import { ConnectivityService } from './services/connectivity.service';
import { PushNotificationService } from './services/push-notification.service';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(
  private authService: AuthService,
  private sessionService: SessionService,
  private themeService: ThemeService,
  public connectivityService: ConnectivityService,
  private pushNotificationService: PushNotificationService,
  private router: Router
) {
  this.themeService.init();
  this.initializeGoogleSignIn();
  this.listenSession();
}

  private async initializeGoogleSignIn() {
  await GoogleSignIn.initialize({
    clientId: '940484393399-8llae5tt526r9lgvf9668dqh31le42o6.apps.googleusercontent.com'
  });
}

  private listenSession() {

  this.authService.listenAuthState(user => {

    if (user) {

  this.sessionService.setUser(user);

  this.pushNotificationService.initialize(user.uid);

  // Solo navegar automáticamente
  // cuando la aplicación se abre desde la raíz.

  const currentUrl = this.router.url;

  if (
    currentUrl === '/' ||
    currentUrl === '/auth'
  ) {

    this.router.navigateByUrl(
      '/main/home',
      {
        replaceUrl: true
      }
    );

  }

} else {

  this.sessionService.clear();

  // Las rutas /public/** (ej. broadcast para TV) son de acceso
  // libre y no deben expulsar al usuario a /auth. Se usa
  // window.location.pathname (no this.router.url) porque en un
  // arranque en frío el estado de Auth puede resolver antes de
  // que el Router termine de procesar la navegación inicial.
  if (!window.location.pathname.startsWith('/public')) {

    this.router.navigateByUrl(
      '/auth',
      {
        replaceUrl: true
      }
    );

  }

}

  });

}

}