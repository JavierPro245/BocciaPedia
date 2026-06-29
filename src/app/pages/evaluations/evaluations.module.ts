import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationsPageRoutingModule } from './evaluations-routing.module';

import { EvaluationsPage } from './evaluations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationsPageRoutingModule
  ],
  declarations: [EvaluationsPage]
})
export class EvaluationsPageModule {}
