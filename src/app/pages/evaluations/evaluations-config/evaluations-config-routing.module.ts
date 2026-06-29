import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationsConfigPage } from './evaluations-config.page';

const routes: Routes = [
  {
    path: '',
    component: EvaluationsConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationsConfigPageRoutingModule {}
