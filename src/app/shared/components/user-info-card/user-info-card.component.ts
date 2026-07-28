import { Component, Input } from '@angular/core';

import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss'],
  standalone: false
})
export class UserInfoCardComponent {

  @Input() user!: User;

  get role(): string {

    if (!this.user.roles.length) {
      return 'Pendiente de asignación';
    }

    return this.user.roles
      .map(r => this.translateRole(r))
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