import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthleteEditPageRoutingModule } from './athlete-edit-routing.module';

import { AthleteEditPage } from './athlete-edit.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthleteEditPageRoutingModule,
    SharedModule
  ],
  declarations: [AthleteEditPage]
})
export class AthleteEditPageModule {}
