import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthleteDetailPageRoutingModule } from './athlete-detail-routing.module';

import { AthleteDetailPage } from './athlete-detail.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthleteDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [AthleteDetailPage]
})
export class AthleteDetailPageModule {}
