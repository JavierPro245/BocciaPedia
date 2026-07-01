import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
  standalone: false
})
export class ActionMenuComponent {

  constructor(
    private popoverCtrl: PopoverController
  ) {}

  select(action: string) {

    this.popoverCtrl.dismiss({
      action
    });

  }

}