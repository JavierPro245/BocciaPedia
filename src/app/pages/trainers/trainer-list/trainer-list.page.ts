import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-trainer-list',
  templateUrl: './trainer-list.page.html',
  styleUrls: ['./trainer-list.page.scss'],
  standalone: false
})
export class TrainerListPage implements OnInit {

  trainers: User[] = [];

  loading = true;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadTrainers();
  }

  async ionViewWillEnter() {
    await this.loadTrainers();
  }

  async loadTrainers() {

    this.loading = true;

    const users = await this.userService.getUsers();

    this.trainers = users.filter((user: User) =>
      (user.roles ?? []).includes('trainer')
    );

    this.loading = false;

  }

  viewTrainer(uid: string) {

    this.router.navigate([
      '/trainers/trainer-detail',
      uid
    ]);

  }

  editTrainer(uid: string) {

    this.router.navigate([
      '/trainers/trainer-edit',
      uid
    ]);

  }

  deleteTrainer(uid: string) {

    console.log('Eliminar entrenador:', uid);

    // Lo implementaremos cuando construyamos la pantalla de eliminación
    // o la opción de quitar el rol trainer.

  }

}