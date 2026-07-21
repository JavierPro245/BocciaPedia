import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationsDetailPageRoutingModule } from './evaluations-detail-routing.module';

import { EvaluationsDetailPage } from './evaluations-detail.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationsDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [EvaluationsDetailPage]
})
export class EvaluationsDetailPageModule {}
