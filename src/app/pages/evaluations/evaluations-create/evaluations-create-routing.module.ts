import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationsCreatePage } from './evaluations-create.page';

const routes: Routes = [
  {
    path: '',
    component: EvaluationsCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationsCreatePageRoutingModule {}
