import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Trainer } from 'src/app/models/trainer.model';

@Component({
  selector: 'app-trainer-list',
  templateUrl: './trainer-list.page.html',
  styleUrls: ['./trainer-list.page.scss'],
  standalone: false
})
export class TrainerListPage {

  constructor(
    private router: Router
  ) {}

  trainers: Trainer[] = [

    {
      id:'1',
      firstName:'Carlos',
      lastName:'Pérez',
      email:'carlos@bocciapedia.cl',
      phone:'999999999',
      federation:'Comité Paralímpico de Chile',
      club:'Club Paralímpico Los Ángeles',
      photo:'',
      observations:'',
      active:true
    },

    {
      id:'2',
      firstName:'María',
      lastName:'González',
      email:'maria@bocciapedia.cl',
      phone:'888888888',
      federation:'Federación Colombiana',
      club:'Bogotá Boccia',
      photo:'',
      observations:'',
      active:true
    }

  ];

  viewTrainer(id:string){

    this.router.navigate([
      '/main/trainer-detail',
      id
    ]);

  }

  editTrainer(id:string){

    console.log('Editar',id);

  }

  deleteTrainer(id:string){

    console.log('Eliminar',id);

  }

}
