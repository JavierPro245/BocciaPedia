import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainerEditPage } from './trainer-edit.page';

const routes: Routes = [
  {
    path: '',
    component: TrainerEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainerEditPageRoutingModule {}
