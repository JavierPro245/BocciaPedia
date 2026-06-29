import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemConfigPage } from './system-config.page';

const routes: Routes = [
  {
    path: '',
    component: SystemConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigPageRoutingModule {}
