import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthleteCreatePageRoutingModule } from './athlete-create-routing.module';

import { AthleteCreatePage } from './athlete-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthleteCreatePageRoutingModule
  ],
  declarations: [AthleteCreatePage]
})
export class AthleteCreatePageModule {}
