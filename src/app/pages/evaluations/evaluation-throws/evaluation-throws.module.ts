import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationThrowsPageRoutingModule } from './evaluation-throws-routing.module';

import { EvaluationThrowsPage } from './evaluation-throws.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationThrowsPageRoutingModule,
    SharedModule
  ],
  declarations: [EvaluationThrowsPage]
})
export class EvaluationThrowsPageModule {}
