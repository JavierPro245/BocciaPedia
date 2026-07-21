import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainerListPage } from './trainer-list.page';

const routes: Routes = [
  {
    path: '',
    component: TrainerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainerListPageRoutingModule {}
