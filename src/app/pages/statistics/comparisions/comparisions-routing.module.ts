import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComparisionsPage } from './comparisions.page';

const routes: Routes = [
  {
    path: '',
    component: ComparisionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComparisionsPageRoutingModule {}
