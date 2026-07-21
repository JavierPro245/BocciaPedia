import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/user.model';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  user: User | null = null;

  constructor(
    private sessionService: SessionService
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

}