import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: false
})
export class SignUpPage {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  form = new FormGroup({

    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

    confirmPassword: new FormControl('', [
      Validators.required
    ]),

    acceptTerms: new FormControl(false, [
      Validators.requiredTrue
    ])

  });

  async submit() {

    if (this.form.invalid) return;

    if (this.form.value.password !== this.form.value.confirmPassword) {

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;

    }

    const loading = await this.loadingController.create({
      message: 'Creando cuenta...'
    });

    await loading.present();

    try {

      await this.authService.register(
        this.form.value.fullName!,
        this.form.value.email!,
        this.form.value.password!
      );

      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Cuenta creada',
        message: 'Tu cuenta fue creada correctamente.',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.router.navigateByUrl('/main', {
              replaceUrl: true
            });
          }
        }]
      });

      await alert.present();

    } catch (error: any) {

      console.log(error);
  console.log(error.code);
  console.log(error.message);

  await loading.dismiss();

      let message = 'Ha ocurrido un error.';

      switch (error.code) {

        case 'auth/email-already-in-use':
          message = 'El correo ya está registrado.';
          break;

        case 'auth/weak-password':
          message = 'La contraseña es demasiado débil.';
          break;

        case 'auth/invalid-email':
          message = 'Correo electrónico inválido.';
          break;

      }

      const alert = await this.alertController.create({
        header: 'Error',
        message,
        buttons: ['Aceptar']
      });

      await alert.present();

    }

  }

}