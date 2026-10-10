import { Component, Input } from '@angular/core';

// Estaba sin implementar (el html literal decía "empty-state works!"),
// a pesar de usarse en 6 pantallas distintas con nombres de input que
// no coincidían entre sí (`subtitle` en unas, `message` en otras) —
// se soportan ambos para no tener que tocar cada pantalla que ya lo usa.
@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: false
})
export class EmptyStateComponent {

  @Input() icon = 'file-tray-outline';

  @Input() title = 'Nada por aquí todavía';

  @Input() subtitle?: string;

  @Input() message?: string;

  get description(): string | undefined {

    return this.subtitle ?? this.message;

  }

}
