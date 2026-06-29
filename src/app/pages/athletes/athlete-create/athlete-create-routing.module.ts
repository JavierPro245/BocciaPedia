import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthleteCreatePage } from './athlete-create.page';

const routes: Routes = [
  {
    path: '',
    component: AthleteCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthleteCreatePageRoutingModule {}
