import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BroadcastPageRoutingModule } from './broadcast-routing.module';

import { BroadcastPage } from './broadcast.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BroadcastPageRoutingModule,
    SharedModule
  ],
  declarations: [BroadcastPage]
})
export class BroadcastPageModule {}
