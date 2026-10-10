import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoutingDetailPage } from './scouting-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ScoutingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoutingDetailPageRoutingModule {}
