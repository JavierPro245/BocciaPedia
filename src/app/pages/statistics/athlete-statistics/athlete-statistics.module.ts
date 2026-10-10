import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthleteStatisticsPageRoutingModule } from './athlete-statistics-routing.module';

import { AthleteStatisticsPage } from './athlete-statistics.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthleteStatisticsPageRoutingModule,
    SharedModule
  ],
  declarations: [AthleteStatisticsPage]
})
export class AthleteStatisticsPageModule {}
