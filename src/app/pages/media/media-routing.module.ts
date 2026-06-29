import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediaPage } from './media.page';

const routes: Routes = [
  {
    path: '',
    component: MediaPage,
    children: [
      {
        path: 'photos',
        loadChildren: () => import('./photos/photos.module').then( m => m.PhotosPageModule)
      },
      {
        path: 'videos',
        loadChildren: () => import('./videos/videos.module').then( m => m.VideosPageModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaPageRoutingModule {}
