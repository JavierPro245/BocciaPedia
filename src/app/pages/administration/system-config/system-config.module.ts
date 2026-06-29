import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SystemConfigPageRoutingModule } from './system-config-routing.module';

import { SystemConfigPage } from './system-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SystemConfigPageRoutingModule
  ],
  declarations: [SystemConfigPage]
})
export class SystemConfigPageModule {}
