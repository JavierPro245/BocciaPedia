import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AthleteService } from 'src/app/services/athlete.service';

import { SessionService } from 'src/app/services/session.service';
import {
  Athlete,
  AthleteCategory,
  DominantHand
} from 'src/app/models/athlete.model';


@Component({
  selector: 'app-athlete-create',
  templateUrl: './athlete-create.page.html',
  styleUrls: ['./athlete-create.page.scss'],
  standalone: false
})
export class AthleteCreatePage {

  constructor(

  private fb: FormBuilder,

  private athleteService: AthleteService,

  private sessionService: SessionService,

  private router: Router

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

  async save() {

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    return;

  }

  const trainer = this.sessionService.getUser();

  if (!trainer) {

    alert('No existe una sesión activa.');

    return;

  }

  try {

    const athlete: Partial<Athlete> = {

  firstName: this.form.value.firstName ?? '',

  lastName: this.form.value.lastName ?? '',

  rut: this.form.value.rut ?? '',

  birthDate: this.form.value.birthDate
    ? new Date(this.form.value.birthDate)
    : undefined,

  category: this.form.value.category as AthleteCategory,

  club: this.form.value.club ?? '',

  dominantHand: this.form.value.dominantHand as DominantHand,

  email: this.form.value.email ?? '',

  phone: this.form.value.phone ?? '',

  observations: this.form.value.observations ?? '',

  active: this.form.value.active ?? true

};

await this.athleteService.createAthlete(
  athlete,
  trainer.uid
);

    alert('Deportista creado correctamente.');

    this.router.navigate(['/main/athlete-list']);

  } catch (error) {

    console.error(error);

    alert('Error al guardar el deportista.');

  }

}

}