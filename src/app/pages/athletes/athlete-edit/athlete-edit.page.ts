import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from 'src/app/services/storageService';

import { AthleteService } from 'src/app/services/athlete.service';

import {
  Athlete,
  AthleteCategory,
  DominantHand
} from 'src/app/models/athlete.model';

@Component({
  selector: 'app-athlete-edit',
  templateUrl: './athlete-edit.page.html',
  styleUrls: ['./athlete-edit.page.scss'],
  standalone: false
})
export class AthleteEditPage implements OnInit {

  athleteId!: string;

  athlete: Athlete | null = null;

  selectedPhoto: File | null = null;

  constructor(

    private fb: FormBuilder,

    private athleteService: AthleteService,

    private storageService: StorageService,

    private route: ActivatedRoute,

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

  async ngOnInit() {

  this.athleteId =
    this.route.snapshot.paramMap.get('id') ?? '';

  const athlete = await this.athleteService.getAthlete(
    this.athleteId
  );

  if (!athlete) {

    alert('No se encontró el deportista.');

    this.router.navigate(['/main/athlete-list']);

    return;

  }

  this.athlete = athlete;

  this.form.patchValue({

    firstName: athlete.firstName,

    lastName: athlete.lastName,

    rut: athlete.rut,

    birthDate: athlete.birthDate
      ? new Date(athlete.birthDate).toISOString().substring(0, 10)
      : '',

    category: athlete.category,

    club: athlete.club,

    dominantHand: athlete.dominantHand,

    email: athlete.email,

    phone: athlete.phone,

    observations: athlete.observations,

    active: athlete.active

  });

}

async save() {

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    return;

  }

  if (!this.athlete) {

    alert('No se encontró el deportista.');

    return;

  }

  try {

    let photoUrl = this.athlete.photo;

// Si el usuario seleccionó una nueva foto
if (this.selectedPhoto) {

  photoUrl = await this.storageService.uploadImage(

    this.selectedPhoto,

    'athletes'

  );

}

    const athlete: Partial<Athlete> = {

  firstName: this.form.value.firstName ?? '',

  lastName: this.form.value.lastName ?? '',

  fullName: `${this.form.value.firstName} ${this.form.value.lastName}`,

  photo: photoUrl,

  rut: this.form.value.rut ?? '',

  category: this.form.value.category as AthleteCategory,

  club: this.form.value.club ?? '',

  dominantHand: this.form.value.dominantHand as DominantHand,

  email: this.form.value.email ?? '',

  phone: this.form.value.phone ?? '',

  observations: this.form.value.observations ?? '',

  active: this.form.value.active ?? true,

  updatedAt: new Date()

};

if (this.form.value.birthDate) {

  athlete.birthDate = new Date(this.form.value.birthDate);

}

    await this.athleteService.updateAthlete(

      this.athleteId,

      athlete

    );

    alert('Deportista actualizado correctamente.');

    this.router.navigate([
      '/main/athlete-list'
    ]);

  } catch (error) {

    console.error(error);

    alert('Error al actualizar el deportista.');

  }

}

onPhotoSelected(file: File) {

  this.selectedPhoto = file;

}

}