import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchBroadcastPageRoutingModule } from './match-broadcast-routing.module';

import { MatchBroadcastPage } from './match-broadcast.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchBroadcastPageRoutingModule,
    SharedModule
  ],
  declarations: [MatchBroadcastPage]
})
export class MatchBroadcastPageModule {}
