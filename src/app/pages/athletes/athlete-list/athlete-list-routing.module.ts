import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthleteListPage } from './athlete-list.page';

const routes: Routes = [
  {
    path: '',
    component: AthleteListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthleteListPageRoutingModule {}
