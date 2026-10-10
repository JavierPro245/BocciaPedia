import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoutingDetailPageRoutingModule } from './scouting-detail-routing.module';

import { ScoutingDetailPage } from './scouting-detail.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoutingDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [ScoutingDetailPage]
})
export class ScoutingDetailPageModule {}
