import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchesPage } from './matches.page';

const routes: Routes = [
  {
    path: '',
    component: MatchesPage
  },
  {
    path: 'match-create',
    loadChildren: () => import('./match-create/match-create.module').then( m => m.MatchCreatePageModule)
  },
  {
    path: 'match-run',
    loadChildren: () => import('./match-run/match-run.module').then( m => m.MatchRunPageModule)
  },
  {
    path: 'match-broadcast/:id',
    loadChildren: () => import('./match-broadcast/match-broadcast.module').then( m => m.MatchBroadcastPageModule)
  },
  {
    path: 'match-summary',
    loadChildren: () => import('./match-summary/match-summary.module').then( m => m.MatchSummaryPageModule)
  },
  {
    path: 'live',
    loadChildren: () => import('./live-matches/live-matches.module').then( m => m.LiveMatchesPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchesPageRoutingModule {}
