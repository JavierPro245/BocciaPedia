import { Component, EventEmitter, Input, Output } from '@angular/core';

// Nota: cumple el mismo rol que app-confirmation-modal (también sin
// usar en ninguna pantalla). Se implementa igual por consistencia,
// sin fusionarlos: unificarlos es una decisión de arquitectura que
// excede un ajuste estético.
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: false
})
export class ConfirmDialogComponent {

  @Input() icon = 'help-circle';

  @Input() title = 'Confirmación';

  @Input() message = '';

  @Input() confirmText = 'Aceptar';

  @Input() cancelText = 'Cancelar';

  @Input() confirmColor:
    | 'primary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'medium' = 'primary';

  @Output() confirm = new EventEmitter<void>();

  @Output() cancel = new EventEmitter<void>();

}
