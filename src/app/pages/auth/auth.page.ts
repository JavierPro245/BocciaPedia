import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false
})
export class AuthPage {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  form = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])

  });

  async submit() {

    if (this.form.invalid) return;

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...'
    });

    await loading.present();

    try {

      await this.authService.login(
        this.form.value.email!,
        this.form.value.password!
      );

      await loading.dismiss();

      this.router.navigateByUrl('/main', {
        replaceUrl: true
      });

    } catch (error: any) {

      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Error',
        message: this.getFirebaseMessage(error.code),
        buttons: ['Aceptar']
      });

      await alert.present();

    }

  }

  async loginGoogle() {

  const loading = await this.loadingController.create({
    message: 'Iniciando sesión con Google...'
  });

  await loading.present();

  try {

    await this.authService.loginGoogle();

    console.log('Google login finalizado');

    await loading.dismiss();

    // await this.router.navigateByUrl('/main', {
      // replaceUrl: true
    // });

  } catch (error: any) {

    console.error('GOOGLE ERROR', error);

    await loading.dismiss();

    const alert = await this.alertController.create({
      header: 'Error',
      message: this.getGoogleErrorMessage(error?.code),
      buttons: ['Aceptar']
    });

    await alert.present();

  }

}

private getGoogleErrorMessage(code: string): string {

  switch (code) {

    case 'auth/popup-closed-by-user':
      return 'Se cerró la ventana de Google antes de completar el inicio de sesión.';

    case 'auth/popup-blocked':
      return 'El navegador bloqueó la ventana emergente de Google.';

    case 'auth/network-request-failed':
      return 'Sin conexión a Internet.';

    case 'auth/cancelled-popup-request':
      return 'Ya existe una solicitud de inicio de sesión en curso.';

    default:
      return 'No fue posible iniciar sesión con Google.';

  }

}

  private getFirebaseMessage(code: string): string {

    switch (code) {

      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos.';

      case 'auth/user-not-found':
        return 'El usuario no existe.';

      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';

      case 'auth/too-many-requests':
        return 'Demasiados intentos. Inténtalo más tarde.';

      case 'auth/network-request-failed':
        return 'Sin conexión a Internet.';

      default:
        return 'Ha ocurrido un error inesperado.';

    }

  }

  

}