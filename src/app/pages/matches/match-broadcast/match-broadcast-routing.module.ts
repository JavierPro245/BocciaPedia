import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchBroadcastPage } from './match-broadcast.page';

const routes: Routes = [
  {
    path: '',
    component: MatchBroadcastPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchBroadcastPageRoutingModule {}
