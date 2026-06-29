import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationsPage } from './evaluations.page';

const routes: Routes = [
  {
    path: '',
    component: EvaluationsPage,
    children: [
      {
        path: 'evaluations-config',
        loadChildren: () => import('./evaluations-config/evaluations-config.module').then( m => m.EvaluationsConfigPageModule)
      },
      {
        path: 'evaluations-create',
        loadChildren: () => import('./evaluations-create/evaluations-create.module').then( m => m.EvaluationsCreatePageModule)
      },
      {
        path: 'evaluations-detail',
        loadChildren: () => import('./evaluations-detail/evaluations-detail.module').then( m => m.EvaluationsDetailPageModule)
      },
      {
        path: 'evaluations-list',
        loadChildren: () => import('./evaluations-list/evaluations-list.module').then( m => m.EvaluationsListPageModule)
      },
      {
        path: 'heatmap',
        loadChildren: () => import('./heatmap/heatmap.module').then( m => m.HeatmapPageModule)
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationsPageRoutingModule {}
