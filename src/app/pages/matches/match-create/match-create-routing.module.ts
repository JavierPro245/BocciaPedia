import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchCreatePage } from './match-create.page';

const routes: Routes = [
  {
    path: '',
    component: MatchCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchCreatePageRoutingModule {}
