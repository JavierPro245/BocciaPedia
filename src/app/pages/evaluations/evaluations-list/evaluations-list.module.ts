import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationsListPageRoutingModule } from './evaluations-list-routing.module';

import { EvaluationsListPage } from './evaluations-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationsListPageRoutingModule
  ],
  declarations: [EvaluationsListPage]
})
export class EvaluationsListPageModule {}
