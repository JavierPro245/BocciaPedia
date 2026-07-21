import {
  Component,
  Input,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'app-countdown-circle',
  templateUrl: './countdown-circle.component.html',
  styleUrls: ['./countdown-circle.component.scss'],
  standalone: false
})
export class CountdownCircleComponent implements OnChanges {

  @Input() penaltyMode = false;

@Input() team: 'red' | 'blue' | undefined;

  @Input() totalSeconds = 60;

  @Input() seconds = 60;

  @Input() label = 'DESCANSO';

  @Input() subtitle = 'Próximo END';

  progress = 100;

  colorClass = 'green';

  pulseClass = '';

  ngOnChanges(): void {

    this.updateProgress();

  }

  private updateProgress(): void {

    const s = Math.max(0, Math.min(this.seconds, this.totalSeconds));

    this.progress = (s / this.totalSeconds) * 100;

    this.updateColor(s);

  }

  private updateColor(s: number): void {

  // Penalización
  if (this.penaltyMode) {

    this.colorClass = 'orange';
    this.pulseClass = '';

    return;

  }

  // Descanso
  if (s > 30) {

    this.colorClass = 'green';
    this.pulseClass = '';

  }
  else if (s > 10) {

    this.colorClass = 'yellow';
    this.pulseClass = '';

  }
  else {

    this.colorClass = 'red';
    this.pulseClass = 'pulse';

  }

}

  formatTime(): string {

    const m = Math.floor(this.seconds / 60);

    const s = this.seconds % 60;

    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;

}

}