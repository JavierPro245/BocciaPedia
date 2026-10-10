import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComparisionsPageRoutingModule } from './comparisions-routing.module';

import { ComparisionsPage } from './comparisions.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComparisionsPageRoutingModule,
    SharedModule
  ],
  declarations: [ComparisionsPage]
})
export class ComparisionsPageModule {}
