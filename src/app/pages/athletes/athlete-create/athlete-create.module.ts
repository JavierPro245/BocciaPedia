import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthleteCreatePageRoutingModule } from './athlete-create-routing.module';

import { AthleteCreatePage } from './athlete-create.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthleteCreatePageRoutingModule,
    SharedModule
  ],
  declarations: [AthleteCreatePage]
})
export class AthleteCreatePageModule {}
