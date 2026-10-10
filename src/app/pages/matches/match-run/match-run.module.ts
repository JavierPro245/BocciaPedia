import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchRunPageRoutingModule } from './match-run-routing.module';

import { MatchRunPage } from './match-run.page';
import { MatchSettingsModalComponent } from './match-settings-modal/match-settings-modal.component';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchRunPageRoutingModule,
    SharedModule
  ],
  declarations: [MatchRunPage, MatchSettingsModalComponent]
})
export class MatchRunPageModule {}
