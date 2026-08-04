import { Component, Input } from '@angular/core';
import { UserRole } from 'src/app/models/user.model';

@Component({
  selector: 'app-role-chip',
  templateUrl: './role-chip.component.html',
  styleUrls: ['./role-chip.component.scss'],
  standalone: false
})
export class RoleChipComponent {

  @Input() role!: UserRole;

  get label(): string {

    switch (this.role) {

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
        return this.role;

    }

  }

  get color(): string {

    switch (this.role) {

      case 'admin':
        return 'danger';

      case 'trainer':
        return 'success';

      case 'athlete':
        return 'primary';

      case 'assistant':
        return 'tertiary';

      case 'referee':
        return 'warning';

      default:
        return 'medium';

    }

  }

}