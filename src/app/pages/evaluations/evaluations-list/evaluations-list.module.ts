import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationsListPageRoutingModule } from './evaluations-list-routing.module';

import { EvaluationsListPage } from './evaluations-list.page';
import { SharedModule } from 'src/app/shared/shared-module';
import { EvaluationCardComponent } from '../components/evaluation-card/evaluation-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationsListPageRoutingModule,
    SharedModule
  ],
  declarations: [EvaluationsListPage, EvaluationCardComponent]
})
export class EvaluationsListPageModule {}
