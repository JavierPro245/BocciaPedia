import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComparisionsPageRoutingModule } from './comparisions-routing.module';

import { ComparisionsPage } from './comparisions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComparisionsPageRoutingModule
  ],
  declarations: [ComparisionsPage]
})
export class ComparisionsPageModule {}
