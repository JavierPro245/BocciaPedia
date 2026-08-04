import { Component } from '@angular/core';
import { Router, NavigationStart} from '@angular/router';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
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
  private router: Router
) {
  this.initializeGoogleSignIn();
  this.listenSession();
  this.router.events.subscribe(event => {

  if (event instanceof NavigationStart) {

    console.log('====================');

    console.log('NAVEGANDO A');

    console.log(event.url);

    console.trace();

  }

});
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

  console.log('Usuario autenticado');

  console.log(user);

  // Solo navegar automáticamente
  // cuando la aplicación se abre desde la raíz.

  const currentUrl = this.router.url;

  console.log('URL actual:', currentUrl);

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

  console.log('No hay usuario autenticado');

  this.router.navigateByUrl(
    '/auth',
    {
      replaceUrl: true
    }
  );

}

  });

}

}