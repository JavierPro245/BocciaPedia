import { Component, OnDestroy, OnInit } from '@angular/core';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false
})
export class UsersPage implements OnInit, OnDestroy {

  users: User[] = [];

  loading = true;

  private unsubscribe?: () => void;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {

    this.unsubscribe = this.userService.listenUsers(users => {

      this.users = users;

      this.loading = false;

    });

  }

  ngOnDestroy(): void {

    if (this.unsubscribe) {
      this.unsubscribe();
    }

  }

  getRole(user: User): string {

    if (!user.roles.length) {
      return 'Pendiente';
    }

    return user.roles
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

}