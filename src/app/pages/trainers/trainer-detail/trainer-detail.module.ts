import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainerDetailPageRoutingModule } from './trainer-detail-routing.module';

import { TrainerDetailPage } from './trainer-detail.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainerDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [TrainerDetailPage]
})
export class TrainerDetailPageModule {}
