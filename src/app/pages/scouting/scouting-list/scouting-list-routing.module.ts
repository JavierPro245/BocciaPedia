import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoutingListPage } from './scouting-list.page';

const routes: Routes = [
  {
    path: '',
    component: ScoutingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoutingListPageRoutingModule {}
