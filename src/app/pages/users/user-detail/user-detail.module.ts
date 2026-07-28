import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDetailPageRoutingModule } from './user-detail-routing.module';

import { UserDetailPage } from './user-detail.page';
import { SharedModule } from 'src/app/shared/shared-module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [UserDetailPage]
})
export class UserDetailPageModule {}
