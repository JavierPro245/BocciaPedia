import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthletesPageRoutingModule } from './athletes-routing.module';

import { AthletesPage } from './athletes.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthletesPageRoutingModule,
    SharedModule
  ],
  declarations: [AthletesPage]
})
export class AthletesPageModule {}
