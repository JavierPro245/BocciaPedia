import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainerListPageRoutingModule } from './trainer-list-routing.module';

import { TrainerListPage } from './trainer-list.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainerListPageRoutingModule,
    SharedModule
  ],
  declarations: [TrainerListPage]
})
export class TrainerListPageModule {}
