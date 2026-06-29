import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationsConfigPageRoutingModule } from './evaluations-config-routing.module';

import { EvaluationsConfigPage } from './evaluations-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationsConfigPageRoutingModule
  ],
  declarations: [EvaluationsConfigPage]
})
export class EvaluationsConfigPageModule {}
