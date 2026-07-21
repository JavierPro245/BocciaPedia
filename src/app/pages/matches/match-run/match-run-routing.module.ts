import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchRunPage } from './match-run.page';

const routes: Routes = [
  {
    path: '',
    component: MatchRunPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchRunPageRoutingModule {}
