import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ToastController } from '@ionic/angular';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-trainer-edit',
  templateUrl: './trainer-edit.page.html',
  styleUrls: ['./trainer-edit.page.scss'],
  standalone: false
})
export class TrainerEditPage {

  trainer!: User;

  loading = true;

  saving = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastController: ToastController
  ) {

    this.form = this.fb.group({

      phone: [''],

      club: [''],

      federation: [''],

      city: [''],

      specialization: ['']

    });

  }

  async ionViewWillEnter() {

    await this.loadTrainer();

  }

  async loadTrainer() {

    this.loading = true;

    const uid = this.route.snapshot.paramMap.get('uid');

    if (!uid) {

      this.loading = false;

      return;

    }

    const trainer = await this.userService.getTrainer(uid);

    if (!trainer) {

      this.loading = false;

      return;

    }

    this.trainer = trainer;

    this.form.patchValue({

      phone: trainer.trainerProfile?.phone ?? '',

      club: trainer.trainerProfile?.club ?? '',

      federation: trainer.trainerProfile?.federation ?? '',

      city: trainer.trainerProfile?.city ?? '',

      specialization: trainer.trainerProfile?.specialization ?? ''

    });

    this.loading = false;

  }

  async save() {

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    const toast = await this.toastController.create({
      message: 'Revisa los campos marcados en rojo antes de guardar.',
      duration: 2500,
      color: 'warning'
    });

    await toast.present();

    return;

  }

  this.saving = true;

  try {

    await this.userService.updateTrainerProfile(
      this.trainer.uid,
      this.form.value
    );

    const toast = await this.toastController.create({
      message: 'Entrenador actualizado correctamente.',
      color: 'success',
      duration: 2000
    });

    await toast.present();

    await this.router.navigate(
  ['/trainers/trainer-detail', this.trainer.uid],
  {
    replaceUrl: true
  }
);

  } catch (error) {

    console.error('Error al actualizar entrenador:', error);

    const toast = await this.toastController.create({
      message: 'No fue posible guardar los cambios.',
      color: 'danger',
      duration: 3000
    });

    await toast.present();

  } finally {

    this.saving = false;

  }

}

}