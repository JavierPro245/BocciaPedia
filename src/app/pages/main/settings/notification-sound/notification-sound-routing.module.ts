import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationSoundPage } from './notification-sound.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationSoundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationSoundPageRoutingModule {}
