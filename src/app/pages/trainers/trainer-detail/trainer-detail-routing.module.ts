import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainerDetailPage } from './trainer-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TrainerDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainerDetailPageRoutingModule {}
