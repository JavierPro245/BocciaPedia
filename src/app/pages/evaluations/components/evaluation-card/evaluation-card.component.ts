import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  openEvaluation(): void {

    this.open.emit(this.evaluation);

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