import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationThrowsPage } from './evaluation-throws.page';

const routes: Routes = [
  {
    path: '',
    component: EvaluationThrowsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationThrowsPageRoutingModule {}
