import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationsListPage } from './evaluations-list.page';

const routes: Routes = [
  {
    path: '',
    component: EvaluationsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationsListPageRoutingModule {}
