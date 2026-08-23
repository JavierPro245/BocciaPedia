import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false
})
export class ChangePasswordPage {

  saving = false;

  form = new FormGroup({

    currentPassword: new FormControl('', [Validators.required]),

    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

    confirmPassword: new FormControl('', [Validators.required])

  });

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  get hasPasswordProvider(): boolean {

    return this.authService.hasPasswordProvider();

  }

  async submit() {

    if (this.form.invalid || this.saving) return;

    const { currentPassword, newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {

      await this.showToast('Las contraseñas nuevas no coinciden.', 'danger');

      return;

    }

    this.saving = true;

    try {

      await this.authService.changePassword(
        currentPassword!,
        newPassword!
      );

      await this.showToast('Contraseña actualizada correctamente.', 'success');

      this.router.navigateByUrl('/main/settings');

    } catch (error: any) {

      console.error('Error cambiando contraseña:', error);

      const message = error?.code === 'auth/invalid-credential' ||
        error?.code === 'auth/wrong-password'
        ? 'La contraseña actual no es correcta.'
        : 'No se pudo cambiar la contraseña.';

      await this.showToast(message, 'danger');

    } finally {

      this.saving = false;

    }

  }

  private async showToast(message: string, color: string) {

    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color
    });

    await toast.present();

  }

}
