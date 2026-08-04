import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-trainer-create',
  templateUrl: './trainer-create.page.html',
  styleUrls: ['./trainer-create.page.scss'],
  standalone: false
})
export class TrainerCreatePage implements OnInit {

  users: User[] = [];

  filteredUsers: User[] = [];

  loading = true;

  searchText = '';

  constructor(
    private userService: UserService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {

    await this.loadUsers();

  }

  async ionViewWillEnter() {

    await this.loadUsers();

  }

  async loadUsers() {

    this.loading = true;

    const users = await this.userService.getUsers();

    this.users = users.filter(user =>
      !(user.roles ?? []).includes('trainer')
    );

    this.filteredUsers = [...this.users];

    this.loading = false;

  }

  filterUsers() {

    const text = this.searchText.toLowerCase().trim();

    this.filteredUsers = this.users.filter(user =>

      user.displayName.toLowerCase().includes(text) ||

      user.email.toLowerCase().includes(text)

    );

  }

  async convertToTrainer(user: User) {

    await this.userService.addRole(
      user.uid,
      'trainer'
    );

    const toast = await this.toastController.create({

      message: `${user.displayName} ahora es entrenador.`,

      duration: 2000,

      color: 'success',

      position: 'bottom'

    });

    await toast.present();

    await this.loadUsers();

  }

}