import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/user.model';
import { SessionService } from 'src/app/services/session.service';
import { PermissionService } from 'src/app/services/permission.service';

import { StorageService } from 'src/app/services/storageService';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { LinkPasswordModalComponent } from 'src/app/shared/components/link-password-modal/link-password-modal.component';

import { FilePicker } from '@capawesome/capacitor-file-picker';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  user: User | null = null;

  constructor(

  private sessionService: SessionService,

  private authService: AuthService,

  private modalController: ModalController,

  private storageService: StorageService,

  private userService: UserService,

  private permissionService: PermissionService

) {}

  ngOnInit() {

    this.sessionService.currentUser$
      .subscribe(user => {

        this.user = user;

      });

  }

  get role(): string {

    if (!this.user?.roles?.length) {
      return 'Pendiente de asignación';
    }

    return this.user.roles
      .map(role => this.translateRole(role))
      .join(', ');

  }

  private translateRole(role: string): string {

    switch (role) {

      case 'admin':
        return 'Administrador';

      case 'trainer':
        return 'Entrenador';

      case 'athlete':
        return 'Deportista';

      case 'assistant':
        return 'Asistente';

      case 'referee':
        return 'Árbitro';

      default:
        return role;

    }

  }

  isAdmin(): boolean {

  return this.permissionService.hasRole('admin');

}

async changePhoto() {

  if (!this.user) {
    return;
  }

  try {

    const result = await FilePicker.pickImages({
      limit: 1,
      readData: true
    });

    if (!result.files.length) {
      return;
    }

    const pickedFile = result.files[0];

    console.log('Archivo seleccionado:', pickedFile);

    let file: File;

    // WEB
    if (pickedFile.blob) {

      file = new File(
        [pickedFile.blob],
        pickedFile.name ?? `profile_${Date.now()}.jpg`,
        {
          type: pickedFile.mimeType ?? 'image/jpeg'
        }
      );

    }
    // ANDROID / IOS
    else if (pickedFile.data) {

      const binary = atob(pickedFile.data);

      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      file = new File(
        [bytes],
        pickedFile.name ?? `profile_${Date.now()}.jpg`,
        {
          type: pickedFile.mimeType ?? 'image/jpeg'
        }
      );

    } else {

      throw new Error(
        'No fue posible obtener los datos de la imagen.'
      );

    }

    // Eliminar foto anterior
    if (
      this.user.photoURL &&
      !this.user.photoURL.includes('assets/')
    ) {

      await this.storageService.deleteImage(
        this.user.photoURL
      );

    }

    const photoURL = await this.storageService.uploadImage(
      file,
      'profiles'
    );

    await this.userService.updateUser(
      this.user.uid,
      {
        photoURL,
        updatedAt: Date.now()
      }
    );

    const updatedUser = {
      ...this.user,
      photoURL,
      updatedAt: Date.now()
    };

    this.sessionService.setUser(updatedUser);

    this.user = updatedUser;

    alert('Foto actualizada correctamente.');

  } catch (error: any) {

    console.error(error);

    alert(
      `Código: ${error?.code ?? 'Sin código'}\n\n` +
      `Mensaje: ${error?.message ?? error}`
    );

  }

  }

  get hasGoogle(): boolean {

    return this.authService.hasGoogleProvider();

  }

  get hasPassword(): boolean {

    return this.authService.hasPasswordProvider();

  }

  async linkPassword() {

  if (!this.user?.email) {
    return;
  }

  const modal = await this.modalController.create({

    component: LinkPasswordModalComponent,

    componentProps: {

      email: this.user.email

    }

  });

  await modal.present();

  const { data } = await modal.onDidDismiss();

  if (!data) {
    return;
  }

  try {

    await this.authService.linkEmailPassword(

      data.email,

      data.password

    );

    await this.authService.reloadCurrentUser();

    alert(
      'Contraseña vinculada correctamente.'
    );

  } catch (error: any) {

    console.error(error);

    alert(
      error?.message ??
      'No fue posible vincular la contraseña.'
    );

  }

}
}