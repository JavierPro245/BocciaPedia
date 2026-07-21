import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchSummaryPageRoutingModule } from './match-summary-routing.module';

import { MatchSummaryPage } from './match-summary.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchSummaryPageRoutingModule,
    SharedModule
  ],
  declarations: [MatchSummaryPage]
})
export class MatchSummaryPageModule {}
