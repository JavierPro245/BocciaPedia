import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthleteStatisticsPage } from './athlete-statistics.page';

const routes: Routes = [
  {
    path: '',
    component: AthleteStatisticsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthleteStatisticsPageRoutingModule {}
