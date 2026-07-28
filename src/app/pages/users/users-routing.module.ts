import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersPage } from './users.page';

const routes: Routes = [

  {
    path: '',
    component: UsersPage
  },

  {
    path: ':uid',
    loadChildren: () =>
      import('./user-detail/user-detail.module')
        .then(m => m.UserDetailPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersPageRoutingModule {}