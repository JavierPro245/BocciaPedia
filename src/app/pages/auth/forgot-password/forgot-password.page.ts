import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage {

  form = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])

  });

  submit() {

    if (this.form.invalid) return;

    console.log(this.form.value);

  }

}