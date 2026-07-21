import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchSummaryPage } from './match-summary.page';

const routes: Routes = [
  {
    path: '',
    component: MatchSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchSummaryPageRoutingModule {}
