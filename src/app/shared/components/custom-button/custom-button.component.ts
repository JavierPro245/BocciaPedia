import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
  standalone: false
})
export class CustomButtonComponent {

  @Input() label = '';

  @Input() icon?: string;

  @Input() color = 'primary';

  @Input() fill: 'solid' | 'outline' | 'clear' = 'solid';

  @Input() expand: 'block' | 'full' | undefined = 'block';

  @Input() disabled = false;

  @Input() type: 'button' | 'submit' = 'button';

  @Output() press = new EventEmitter<void>();

  onClick(): void {

    if (this.disabled) return;

    this.press.emit();

  }

}
