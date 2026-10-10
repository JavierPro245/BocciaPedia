import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveMatchesPage } from './live-matches.page';

const routes: Routes = [
  {
    path: '',
    component: LiveMatchesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveMatchesPageRoutingModule {}
