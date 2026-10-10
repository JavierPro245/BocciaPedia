import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-input',
  templateUrl: './login-input.component.html',
  styleUrls: ['./login-input.component.scss'],
  standalone: false
})
export class LoginInputComponent {

  @Input() label = '';

  @Input() placeholder = '';

  @Input() icon = '';

  @Input() type = 'text';

  @Input() maxlength: number | null = null;

  @Input() readonly = false;

  @Input() autocomplete = '';

  @Input({ required: true })
  control!: FormControl;

  showPassword = false;

  get inputType(): string {

    if (this.type !== 'password') {
      return this.type;
    }

    return this.showPassword ? 'text' : 'password';

  }

  togglePassword() {

    this.showPassword = !this.showPassword;

  }

  get hasError(): boolean {

    return !!this.control &&
           this.control.invalid &&
           (this.control.dirty || this.control.touched);

  }

  get errorMessage(): string {

    if (!this.control?.errors) return '';

    if (this.control.errors['required'])
      return 'Este campo es obligatorio';

    if (this.control.errors['email'])
      return 'Correo electrónico inválido';

    if (this.control.errors['minlength'])
      return `Debe contener al menos ${this.control.errors['minlength'].requiredLength} caracteres`;

    if (this.control.errors['maxlength'])
      return `Máximo ${this.control.errors['maxlength'].requiredLength} caracteres`;

    return 'Campo inválido';

  }

}