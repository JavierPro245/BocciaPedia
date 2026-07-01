import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationsCreatePageRoutingModule } from './evaluations-create-routing.module';

import { EvaluationsCreatePage } from './evaluations-create.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationsCreatePageRoutingModule,
    SharedModule
  ],
  declarations: [EvaluationsCreatePage]
})
export class EvaluationsCreatePageModule {}
