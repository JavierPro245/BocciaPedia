import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { RoleGuard } from 'src/app/guards/role.guard';

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
        canActivate:[RoleGuard],

    data:{
        roles:['admin','trainer']
    },
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
        path: 'athlete-edit/:id',
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
  path: 'select-user/:athleteId',
  loadChildren: () =>
    import('../athletes/select-user/select-user.module')
      .then(m => m.SelectUserPageModule)
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
  path: 'users',

  canActivate: [RoleGuard],

  data: {
    roles: ['admin']
  },

  loadChildren: () =>
    import('../users/users.module')
      .then(m => m.UsersPageModule)
},

{
  path: 'trainer-detail/:id',
  loadChildren: () =>
    import('../trainers/trainer-detail/trainer-detail.module')
      .then(m => m.TrainerDetailPageModule)
},

// ======================
// MATCHES / STATISTICS / MEDIA
// (antes solo existían como rutas de nivel superior, fuera del
// ion-menu lateral — por eso el botón de menú no abría nada al
// llegar a ellas desde el propio menú)
// ======================

{
  path: 'matches',
  loadChildren: () =>
    import('../matches/matches.module')
      .then(m => m.MatchesPageModule)
},

{
  path: 'statistics',
  loadChildren: () =>
    import('../statistics/statistics.module')
      .then(m => m.StatisticsPageModule)
},

{
  path: 'media',
  loadChildren: () =>
    import('../media/media.module')
      .then(m => m.MediaPageModule)
},

{
  path: 'scouting',
  loadChildren: () =>
    import('../scouting/scouting.module')
      .then(m => m.ScoutingPageModule)
},

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }

    ]

  },

  {
    path: 'match-broadcast/:id',
    loadChildren: () => import('../matches/match-broadcast/match-broadcast.module').then( m => m.MatchBroadcastPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}