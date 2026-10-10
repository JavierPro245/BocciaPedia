import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationSoundPageRoutingModule } from './notification-sound-routing.module';

import { NotificationSoundPage } from './notification-sound.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationSoundPageRoutingModule,
    SharedModule
  ],
  declarations: [NotificationSoundPage]
})
export class NotificationSoundPageModule {}
