import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationRunPage } from './evaluation-run.page';

const routes: Routes = [
  {
    path: '',
    component: EvaluationRunPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationRunPageRoutingModule {}
