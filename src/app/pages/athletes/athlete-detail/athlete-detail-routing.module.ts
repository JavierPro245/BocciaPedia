import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthleteDetailPage } from './athlete-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AthleteDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthleteDetailPageRoutingModule {}
