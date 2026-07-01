import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-athlete-create',
  templateUrl: './athlete-create.page.html',
  styleUrls: ['./athlete-create.page.scss'],
  standalone: false
})
export class AthleteCreatePage {

  constructor(
    private fb: FormBuilder
  ) {}

  form = this.fb.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    rut: [''],

    birthDate: [''],

    category: ['', Validators.required],

    club: ['', Validators.required],

    dominantHand: ['', Validators.required],

    email: ['', Validators.email],

    phone: [''],

    observations: [''],

    active: [true]

  });

  readonly categories = [
    'BC1',
    'BC2',
    'BC3',
    'BC4'
  ];

  readonly hands = [
    'Derecha',
    'Izquierda',
    'Ambas'
  ];

  save(){

    console.log(this.form.value);

  }

}