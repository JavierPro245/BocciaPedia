import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Athlete } from 'src/app/models/athlete.model';

@Component({
  selector: 'app-athlete-detail',
  templateUrl: './athlete-detail.page.html',
  styleUrls: ['./athlete-detail.page.scss'],
  standalone: false
})
export class AthleteDetailPage implements OnInit {

  athlete!: Athlete;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id') || '';

    console.log('ID recibido:', id);

    this.athlete = {

      id,

      firstName: 'Javier',

      lastName: 'Bastias',

      rut: '12.345.678-9',

      email: 'javier@bocciapp.cl',

      phone: '+56 9 12345678',

      birthDate: new Date(1998,4,10),

      category: 'BC3',

      dominantHand: 'Derecha',

      club: 'Club Paralímpico Los Ángeles',

      photo: 'assets/avatars/athlete.png',

      observations: 'Deportista de prueba.',

      active: true

    };

  }

}