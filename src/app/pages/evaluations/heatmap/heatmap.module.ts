import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeatmapPageRoutingModule } from './heatmap-routing.module';

import { HeatmapPage } from './heatmap.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeatmapPageRoutingModule,
    SharedModule
  ],
  declarations: [HeatmapPage]
})
export class HeatmapPageModule {}
