import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [

  {

    path: '',

    component: MainPage,

    children: [

      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then(m => m.HomePageModule)
      },

      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then(m => m.ProfilePageModule)
      },

      {
        path: 'notifications',
        loadChildren: () =>
          import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
      },

      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then(m => m.SettingsPageModule)
      },

      // ======================
      // ATHLETES
      // ======================

      {
        path: 'athlete-list',
        loadChildren: () =>
          import('../athletes/athlete-list/athlete-list.module')
            .then(m => m.AthleteListPageModule)
      },

      {
        path: 'athlete-create',
        loadChildren: () =>
          import('../athletes/athlete-create/athlete-create.module')
            .then(m => m.AthleteCreatePageModule)
      },

      {
        path: 'athlete-edit',
        loadChildren: () =>
          import('../athletes/athlete-edit/athlete-edit.module')
            .then(m => m.AthleteEditPageModule)
      },

      {
        path: 'athlete-detail/:id',
        loadChildren: () =>
        import('../athletes/athlete-detail/athlete-detail.module')
        .then(m => m.AthleteDetailPageModule)
      },

      {
  path: 'evaluations',
  loadChildren: () =>
    import('../evaluations/evaluations.module')
      .then(m => m.EvaluationsPageModule)
},

// ======================
// TRAINERS
// ======================

{
  path: 'trainer-list',
  loadChildren: () =>
    import('../trainers/trainer-list/trainer-list.module')
      .then(m => m.TrainerListPageModule)
},

{
  path: 'trainer-create',
  loadChildren: () =>
    import('../trainers/trainer-create/trainer-create.module')
      .then(m => m.TrainerCreatePageModule)
},

{
  path: 'trainer-edit',
  loadChildren: () =>
    import('../trainers/trainer-edit/trainer-edit.module')
      .then(m => m.TrainerEditPageModule)
},

{
  path: 'trainer-detail/:id',
  loadChildren: () =>
    import('../trainers/trainer-detail/trainer-detail.module')
      .then(m => m.TrainerDetailPageModule)
},

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }

    ]

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}