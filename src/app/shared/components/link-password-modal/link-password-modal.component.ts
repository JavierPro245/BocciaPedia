import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-link-password-modal',
  templateUrl: './link-password-modal.component.html',
  styleUrls: ['./link-password-modal.component.scss'],
  standalone: false
})
export class LinkPasswordModalComponent {

  @Input() email = '';

  password = '';

  confirmPassword = '';

  constructor(
    private modalController: ModalController
  ) {}

  cancel() {

    this.modalController.dismiss();

  }

  save() {

    if (!this.password.trim()) {

      alert('Ingrese una contraseña.');

      return;

    }

    if (this.password.length < 6) {

      alert('La contraseña debe tener al menos 6 caracteres.');

      return;

    }

    if (this.password !== this.confirmPassword) {

      alert('Las contraseñas no coinciden.');

      return;

    }

    this.modalController.dismiss({

      email: this.email,

      password: this.password

    });

  }

}