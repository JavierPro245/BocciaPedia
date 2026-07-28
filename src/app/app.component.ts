import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  this.router.navigateByUrl('/main/home', {
    replaceUrl: true
  });

} else {

  this.sessionService.clear();

  console.log('No hay usuario autenticado');

  this.router.navigateByUrl('/auth', {
    replaceUrl: true
  });

}

    });

  }

}