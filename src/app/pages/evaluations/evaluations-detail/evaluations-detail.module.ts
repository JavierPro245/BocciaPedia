import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationsDetailPageRoutingModule } from './evaluations-detail-routing.module';

import { EvaluationsDetailPage } from './evaluations-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationsDetailPageRoutingModule
  ],
  declarations: [EvaluationsDetailPage]
})
export class EvaluationsDetailPageModule {}
