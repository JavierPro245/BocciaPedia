import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainerEditPageRoutingModule } from './trainer-edit-routing.module';

import { TrainerEditPage } from './trainer-edit.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainerEditPageRoutingModule,
    SharedModule
  ],
  declarations: [TrainerEditPage]
})
export class TrainerEditPageModule {}
