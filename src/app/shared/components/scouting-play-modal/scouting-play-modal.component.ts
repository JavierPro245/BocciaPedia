import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ScoutingPlayAction, ScoutingPlayOutcome } from 'src/app/models/scouting.model';

@Component({
  selector: 'app-scouting-play-modal',
  templateUrl: './scouting-play-modal.component.html',
  styleUrls: ['./scouting-play-modal.component.scss'],
  standalone: false
})
export class ScoutingPlayModalComponent {

  actions: ScoutingPlayAction[] = [
    'First Ball',
    'Placement',
    'Push On',
    'Push Off',
    'Ricochet',
    'Smash',
    'Bochada',
    'Otro'
  ];

  action: ScoutingPlayAction = 'Placement';

  outcome: ScoutingPlayOutcome = 'success';

  note = '';

  constructor(private modalController: ModalController) {}

  cancel(): void {

    this.modalController.dismiss();

  }

  save(): void {

    this.modalController.dismiss({

      action: this.action,

      outcome: this.outcome,

      note: this.note.trim()

    });

  }

}
