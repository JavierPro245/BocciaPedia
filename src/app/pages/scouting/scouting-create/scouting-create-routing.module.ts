import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoutingCreatePage } from './scouting-create.page';

const routes: Routes = [
  {
    path: '',
    component: ScoutingCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoutingCreatePageRoutingModule {}
