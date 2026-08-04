import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';

import { PublicPage } from './public.page';

@NgModule({

  declarations: [

    PublicPage

  ],

  imports: [

    CommonModule,

    PublicRoutingModule

  ]

})

export class PublicPageModule {}