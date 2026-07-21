import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainerEditPageRoutingModule } from './trainer-edit-routing.module';

import { TrainerEditPage } from './trainer-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainerEditPageRoutingModule
  ],
  declarations: [TrainerEditPage]
})
export class TrainerEditPageModule {}
