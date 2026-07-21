import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainerCreatePageRoutingModule } from './trainer-create-routing.module';

import { TrainerCreatePage } from './trainer-create.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainerCreatePageRoutingModule,
    SharedModule
  ],
  declarations: [TrainerCreatePage]
})
export class TrainerCreatePageModule {}
