import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthleteEditPage } from './athlete-edit.page';

const routes: Routes = [
  {
    path: '',
    component: AthleteEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthleteEditPageRoutingModule {}
