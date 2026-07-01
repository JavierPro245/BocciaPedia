import { Component } from '@angular/core';
import { Athlete } from 'src/app/models/athlete.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-athlete-list',
  templateUrl: './athlete-list.page.html',
  styleUrls: ['./athlete-list.page.scss'],
  standalone: false
})
export class AthleteListPage {

  constructor(
    private router: Router
  ) {}

  athletes: Athlete[] = [

    {
      id: '1',
      firstName: 'Javier',
      lastName: 'Bastias',
      rut: '11111111-1',
      email: 'javier@bocciapp.cl',
      phone: '999999999',
      birthDate: new Date(1998,5,10),
      category: 'BC2',
      club: 'Club Paralímpico Los Ángeles',
      photo: '',
      observations: '',
      active: true,
    
    },

    {
      id: '2',
      firstName: 'María',
      lastName: 'Soto',
      rut: '22222222-2',
      email: 'maria@bocciapp.cl',
      phone: '888888888',
      birthDate: new Date(2000,8,15),
      category: 'BC2',
      club: 'Club Santiago',
      photo: '',
      observations: '',
      active: true
    }

  ];

  viewAthlete(id: string) {

  this.router.navigate([
    '/main/athlete-detail',
    id
  ]);

}

editAthlete(id: string) {

  console.log('Editar', id);

}

deleteAthlete(id: string) {

  console.log('Eliminar', id);

}

openEvaluations(id: string) {

  console.log('Evaluaciones', id);

}

}