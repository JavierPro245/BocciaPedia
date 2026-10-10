import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoutingCreatePageRoutingModule } from './scouting-create-routing.module';

import { ScoutingCreatePage } from './scouting-create.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoutingCreatePageRoutingModule,
    SharedModule
  ],
  declarations: [ScoutingCreatePage]
})
export class ScoutingCreatePageModule {}
