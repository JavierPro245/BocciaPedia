import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/models/user.model';
import { AthleteService } from 'src/app/services/athlete.service';
import { UserService } from 'src/app/services/user.service';
import { Athlete } from 'src/app/models/athlete.model';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.page.html',
  styleUrls: ['./select-user.page.scss'],
  standalone: false
})
export class SelectUserPage implements OnInit, OnDestroy {

  athleteId!: string;

  currentUserId: string | null = null;

  users: User[] = [];

  private unsubscribe: (() => void) | null = null;

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private userService: UserService,
  private athleteService: AthleteService,
  private alertController: AlertController
) {}
  ngOnInit() {

    this.athleteId =
      this.route.snapshot.paramMap.get('athleteId') ?? '';

      this.athleteService.listenAthlete(
  this.athleteId,
  (athlete: Athlete | null) => {

    if (!athlete) {
      return;
    }

    this.currentUserId = athlete.linkedUserId;

  }
);

    this.unsubscribe =
      this.userService.listenAvailableUsers(

        (users: User[]) => {

          this.users = users;

        }

      );

  }

  ngOnDestroy(): void {

    if (this.unsubscribe) {

      this.unsubscribe();

    }

  }

  async selectUser(user: User) {

  try {

    // Si ya tiene una cuenta vinculada, pedir confirmación
    if (this.currentUserId) {

      const confirmed = await this.confirmReplace(user);

      if (!confirmed) {
        return;
      }

    }

    // Vincular el usuario al deportista
    await this.userService.linkAthlete(
      user.uid,
      this.athleteId
    );

    // Si ya había una cuenta vinculada, desvincularla
if (this.currentUserId) {

  await this.userService.unlinkAthlete(
    this.currentUserId
  );

}

    // Vincular el deportista al usuario
    await this.athleteService.linkUserToAthlete(
      this.athleteId,
      user.uid
    );

    console.log('Cuenta vinculada correctamente');

    this.router.navigate([
      '/main/athlete-detail',
      this.athleteId
    ]);

  } catch (error) {

    console.error(error);

  }

}

private async confirmReplace(user: User): Promise<boolean> {

  const alert = await this.alertController.create({

    header: 'Cambiar cuenta',

    message:
      'Este deportista ya tiene una cuenta vinculada. ¿Deseas reemplazarla por la cuenta seleccionada?',

    buttons: [

      {
        text: 'Cancelar',
        role: 'cancel'
      },

      {
        text: 'Cambiar',
        role: 'confirm'
      }

    ]

  });

  await alert.present();

  const result = await alert.onDidDismiss();

  return result.role === 'confirm';

}

}