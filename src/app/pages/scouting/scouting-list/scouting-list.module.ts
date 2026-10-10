import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoutingListPageRoutingModule } from './scouting-list-routing.module';

import { ScoutingListPage } from './scouting-list.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoutingListPageRoutingModule,
    SharedModule
  ],
  declarations: [ScoutingListPage]
})
export class ScoutingListPageModule {}
