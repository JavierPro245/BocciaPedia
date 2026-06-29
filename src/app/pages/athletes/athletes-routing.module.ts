import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthletesPage } from './athletes.page';

const routes: Routes = [
  {
    path: '',
    component: AthletesPage,
    children: [
      {
        path: 'athlete-create',
        loadChildren: () => import('./athlete-create/athlete-create.module').then( m => m.AthleteCreatePageModule)
      },
      {
        path: 'athlete-detail',
        loadChildren: () => import('./athlete-detail/athlete-detail.module').then( m => m.AthleteDetailPageModule)
      },
      {
        path: 'athlete-edit',
        loadChildren: () => import('./athlete-edit/athlete-edit.module').then( m => m.AthleteEditPageModule)
      },
      {
        path: 'athlete-list',
        loadChildren: () => import('./athlete-list/athlete-list.module').then( m => m.AthleteListPageModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthletesPageRoutingModule {}
