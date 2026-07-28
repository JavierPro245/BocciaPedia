import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatisticsPage } from './statistics.page';

const routes: Routes = [
  {
    path: '',
    component: StatisticsPage,
    children: [
    //   {
    //     path: 'athlete-statistics',
    //     loadChildren: () => import('./athlete-statistics/athlete-statistics.module').then( m => m.AthleteStatisticsPageModule)
    //   },
    //   {
    //     path: 'comparisions',
    //     loadChildren: () => import('./comparisions/comparisions.module').then( m => m.ComparisionsPageModule)
    //   },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
    //   {
    //     path: 'reports',
    //     loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
    //   }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsPageRoutingModule {}
