import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'athlete-list',
    loadChildren: () => import('./pages/athletes/athlete-list/athlete-list.module').then( m => m.AthleteListPageModule)
  },
  {
    path: 'athlete-create',
    loadChildren: () => import('./pages/athletes/athlete-create/athlete-create.module').then( m => m.AthleteCreatePageModule)
  },
  {
    path: 'athlete-detail',
    loadChildren: () => import('./pages/athletes/athlete-detail/athlete-detail.module').then( m => m.AthleteDetailPageModule)
  },
  {
    path: 'athlete-edit',
    loadChildren: () => import('./pages/athletes/athlete-edit/athlete-edit.module').then( m => m.AthleteEditPageModule)
  },
  {
    path: 'evaluations-list',
    loadChildren: () => import('./pages/evaluations/evaluations-list/evaluations-list.module').then( m => m.EvaluationsListPageModule)
  },
  {
    path: 'evaluations-create',
    loadChildren: () => import('./pages/evaluations/evaluations-create/evaluations-create.module').then( m => m.EvaluationsCreatePageModule)
  },
  {
    path: 'evaluations-detail',
    loadChildren: () => import('./pages/evaluations/evaluations-detail/evaluations-detail.module').then( m => m.EvaluationsDetailPageModule)
  },
  {
    path: 'evaluations-config',
    loadChildren: () => import('./pages/evaluations/evaluations-config/evaluations-config.module').then( m => m.EvaluationsConfigPageModule)
  },
  {
    path: 'heatmap',
    loadChildren: () => import('./pages/evaluations/heatmap/heatmap.module').then( m => m.HeatmapPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/statistics/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'athlete-statistics',
    loadChildren: () => import('./pages/statistics/athlete-statistics/athlete-statistics.module').then( m => m.AthleteStatisticsPageModule)
  },
  {
    path: 'comparisions',
    loadChildren: () => import('./pages/statistics/comparisions/comparisions.module').then( m => m.ComparisionsPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/statistics/reports/reports.module').then( m => m.ReportsPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/administration/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'trainers',
    loadChildren: () => import('./pages/administration/trainers/trainers.module').then( m => m.TrainersPageModule)
  },
  {
    path: 'roles',
    loadChildren: () => import('./pages/administration/roles/roles.module').then( m => m.RolesPageModule)
  },
  {
    path: 'system-config',
    loadChildren: () => import('./pages/administration/system-config/system-config.module').then( m => m.SystemConfigPageModule)
  },
  {
    path: 'photos',
    loadChildren: () => import('./pages/media/photos/photos.module').then( m => m.PhotosPageModule)
  },
  {
    path: 'videos',
    loadChildren: () => import('./pages/media/videos/videos.module').then( m => m.VideosPageModule)
  },
  {
    path: 'administration',
    loadChildren: () => import('./pages/administration/administration.module').then( m => m.AdministrationPageModule)
  },
  {
    path: 'athletes',
    loadChildren: () => import('./pages/athletes/athletes.module').then( m => m.AthletesPageModule)
  },
  {
    path: 'evaluations',
    loadChildren: () => import('./pages/evaluations/evaluations.module').then( m => m.EvaluationsPageModule)
  },
  {
    path: 'media',
    loadChildren: () => import('./pages/media/media.module').then( m => m.MediaPageModule)
  },
  {
    path: 'statistics',
    loadChildren: () => import('./pages/statistics/statistics.module').then( m => m.StatisticsPageModule)
  },

  {
  path: 'evaluation-run',
  loadChildren: () =>
    import('./pages/evaluations/evaluation-run/evaluation-run.module')
      .then(m => m.EvaluationRunPageModule)
},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
