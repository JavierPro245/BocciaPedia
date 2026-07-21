import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchCreatePageRoutingModule } from './match-create-routing.module';

import { MatchCreatePage } from './match-create.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchCreatePageRoutingModule,
    SharedModule
  ],
  declarations: [MatchCreatePage]
})
export class MatchCreatePageModule {}
