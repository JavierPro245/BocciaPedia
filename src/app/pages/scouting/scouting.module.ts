import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoutingPageRoutingModule } from './scouting-routing.module';

import { ScoutingPage } from './scouting.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoutingPageRoutingModule,
    SharedModule
  ],
  declarations: [ScoutingPage]
})
export class ScoutingPageModule {}
