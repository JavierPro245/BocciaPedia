import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainersPage } from './trainers.page';

const routes: Routes = [
  {
    path: '',
    component: TrainersPage,
    children: [
  {
    path: 'trainer-create',
    loadChildren: () => import('./trainer-create/trainer-create.module').then( m => m.TrainerCreatePageModule)
  },
  {
    path: 'trainer-detail',
    loadChildren: () => import('./trainer-detail/trainer-detail.module').then( m => m.TrainerDetailPageModule)
  },
  {
    path: 'trainer-edit',
    loadChildren: () => import('./trainer-edit/trainer-edit.module').then( m => m.TrainerEditPageModule)
  },
  {
    path: 'trainer-list',
    loadChildren: () => import('./trainer-list/trainer-list.module').then( m => m.TrainerListPageModule)
  },

    ]
  },

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainersPageRoutingModule {}
