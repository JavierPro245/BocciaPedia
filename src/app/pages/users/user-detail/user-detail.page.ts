import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
  standalone: false
})
export class UserDetailPage implements OnInit {

  user: User | null = null;

  loading = true;

  roles = [

  {
    value:'admin',
    label:'Administrador'
  },

  {
    value:'trainer',
    label:'Entrenador'
  },

  {
    value:'athlete',
    label:'Deportista'
  },

  {
    value:'assistant',
    label:'Asistente'
  },

  {
    value:'referee',
    label:'Árbitro'
  }

];

  constructor(

  private route: ActivatedRoute,

  private userService: UserService,

  private alertController: AlertController

) {}

  async ngOnInit() {

    const uid =
      this.route.snapshot.paramMap.get('uid');

    if (!uid) {

      this.loading = false;

      return;

    }

    this.user =
      await this.userService.getUser(uid);

    this.loading = false;

  }

  async save(){

  if(!this.user){

    return;

  }

  await this.userService.saveUser(this.user);

  const alert =
    await this.alertController.create({

      header:'Correcto',

      message:'Usuario actualizado.',

      buttons:['Aceptar']

    });

  await alert.present();

}

}
