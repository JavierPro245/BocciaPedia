import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

import { Evaluation } from 'src/app/models/evaluation.model';

@Component({
  selector: 'app-evaluation-card',
  templateUrl: './evaluation-card.component.html',
  styleUrls: ['./evaluation-card.component.scss'],
  standalone: false
})
export class EvaluationCardComponent {

  @Input()
  evaluation!: Evaluation;

  @Output()
  open = new EventEmitter<Evaluation>();

  @Output()
  edit = new EventEmitter<Evaluation>();

  @Output()
  delete = new EventEmitter<Evaluation>();

  @Input()
  currentUserId = '';

  constructor(

    private actionSheet: ActionSheetController

  ) {}

  openEvaluation() {

    this.open.emit(this.evaluation);

  }

  async showMenu(event: Event) {

    event.stopPropagation();

    const sheet = await this.actionSheet.create({

      header: 'Evaluación',

      buttons: [

        {

          text: 'Editar',

          icon: 'create-outline',

          handler: () => {

            this.edit.emit(this.evaluation);

          }

        },

        {

          text: 'Eliminar',

          role: 'destructive',

          icon: 'trash-outline',

          handler: () => {

            this.delete.emit(this.evaluation);

          }

        },

        {

          text: 'Cancelar',

          role: 'cancel'

        }

      ]

    });

    await sheet.present();

  }

  get canManage(): boolean {

  return this.currentUserId === this.evaluation.trainerId;

}

  getIcon(): string {

    switch (this.evaluation.evaluationType) {

      case 'First Ball':
        return 'radio-button-on';

      case 'Placement':
        return 'locate';

      case 'Push On':
        return 'arrow-forward-circle';

      case 'Push Off':
        return 'arrow-back-circle';

      case 'Ricochet':
        return 'reload-circle';

      case 'Smash':
        return 'flash';

      case 'Bochada':
        return 'ellipse';

      default:
        return 'clipboard';

    }

  }

  getColorClass(): string {

    switch (this.evaluation.evaluationType) {

      case 'First Ball':
        return 'green';

      case 'Placement':
        return 'blue';

      case 'Push On':
        return 'purple';

      case 'Push Off':
        return 'orange';

      case 'Smash':
        return 'red';

      case 'Ricochet':
        return 'gray';

      default:
        return 'green';

    }

  }

}