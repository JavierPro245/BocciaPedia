import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationRunPageRoutingModule } from './evaluation-run-routing.module';

import { EvaluationRunPage } from './evaluation-run.page';
import { SharedModule } from 'src/app/shared/shared-module';
import { CourtEngineComponent } from '../components/court-engine/court-engine.component';
import { ThrowResultModalComponent } from 'src/app/shared/components/throw-result-modal/throw-result-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationRunPageRoutingModule,
    SharedModule
  ],
  declarations: [EvaluationRunPage, CourtEngineComponent]
})
export class EvaluationRunPageModule {}
