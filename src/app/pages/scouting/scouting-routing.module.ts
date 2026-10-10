import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoutingPage } from './scouting.page';

const routes: Routes = [
  {
    path: '',
    component: ScoutingPage,
    children: [
      {
        path: '',
        redirectTo: 'scouting-list',
        pathMatch: 'full'
      },
      {
        path: 'scouting-list',
        loadChildren: () => import('./scouting-list/scouting-list.module').then(m => m.ScoutingListPageModule)
      },
      {
        path: 'scouting-create',
        loadChildren: () => import('./scouting-create/scouting-create.module').then(m => m.ScoutingCreatePageModule)
      },
      {
        path: 'scouting-detail',
        loadChildren: () => import('./scouting-detail/scouting-detail.module').then(m => m.ScoutingDetailPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoutingPageRoutingModule {}
