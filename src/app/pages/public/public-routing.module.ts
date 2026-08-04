import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicPage } from './public.page';

const routes: Routes = [

  {

    path:'',

    component:PublicPage,

    children:[

      {

        path:'broadcast/:id',

        loadChildren:()=>

          import('./broadcast/broadcast.module')

          .then(m=>m.BroadcastPageModule)

      }

    ]

  }

];

@NgModule({

  imports:[RouterModule.forChild(routes)],

  exports:[RouterModule]

})

export class PublicRoutingModule{}