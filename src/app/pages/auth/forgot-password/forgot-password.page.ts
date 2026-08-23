import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage {

  sending = false;

  form = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])

  });

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async submit() {

    if (this.form.invalid || this.sending) return;

    this.sending = true;

    try {

      await this.authService.resetPassword(this.form.value.email!);

      const toast = await this.toastController.create({
        message: 'Te enviamos un correo con el enlace para restablecer tu contraseña.',
        duration: 3500,
        color: 'success'
      });

      await toast.present();

      this.router.navigateByUrl('/auth');

    } catch (error) {

      console.error('Error enviando correo de recuperación:', error);

      const toast = await this.toastController.create({
        message: 'No pudimos enviar el correo. Verifica que la dirección sea correcta.',
        duration: 3000,
        color: 'danger'
      });

      await toast.present();

    } finally {

      this.sending = false;

    }

  }

}