import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthleteListPageRoutingModule } from './athlete-list-routing.module';

import { AthleteListPage } from './athlete-list.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthleteListPageRoutingModule,
    SharedModule
  ],
  declarations: [AthleteListPage]
})
export class AthleteListPageModule {}
