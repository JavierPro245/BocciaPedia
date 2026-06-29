import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthleteEditPageRoutingModule } from './athlete-edit-routing.module';

import { AthleteEditPage } from './athlete-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthleteEditPageRoutingModule
  ],
  declarations: [AthleteEditPage]
})
export class AthleteEditPageModule {}
