import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrationPage } from './administration.page';

const routes: Routes = [
  {
    path: '',
    component: AdministrationPage,
    children: [
      {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then( m => m.RolesPageModule)
      },
      {
        path: 'system-config',
        loadChildren: () => import('./system-config/system-config.module').then( m => m.SystemConfigPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
      }
    ]
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationPageRoutingModule {}
