import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainerDetailPageRoutingModule } from './trainer-detail-routing.module';

import { TrainerDetailPage } from './trainer-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainerDetailPageRoutingModule
  ],
  declarations: [TrainerDetailPage]
})
export class TrainerDetailPageModule {}
