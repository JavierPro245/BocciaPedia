import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Athlete } from 'src/app/models/athlete.model';
import { ActionMenuComponent } from '../action-menu/action-menu.component';

@Component({
  selector: 'app-athlete-card',
  templateUrl: './athlete-card.component.html',
  styleUrls: ['./athlete-card.component.scss'],
  standalone: false
})
export class AthleteCardComponent {

  constructor(
    private popoverCtrl: PopoverController
  ) {}

  @Input() athlete!: Athlete;

  @Output() details = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() evaluations = new EventEmitter<string>();

  async openMenu(ev: Event) {

    const popover = await this.popoverCtrl.create({

      component: ActionMenuComponent,

      event: ev,

      side: 'bottom',

      alignment: 'end'

    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (!data || !this.athlete.id) return;

    switch (data.action) {

      case 'detail':
        this.details.emit(this.athlete.id);
        break;

      case 'edit':
        this.edit.emit(this.athlete.id);
        break;

      case 'evaluation':
        this.evaluations.emit(this.athlete.id);
        break;

      case 'delete':
        this.delete.emit(this.athlete.id);
        break;

    }

  }

}