import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainersPageRoutingModule } from './trainers-routing.module';

import { TrainersPage } from './trainers.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainersPageRoutingModule,
    SharedModule
  ],
  declarations: [TrainersPage]
})
export class TrainersPageModule {}
