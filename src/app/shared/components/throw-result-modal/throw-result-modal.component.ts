import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ThrowResult } from 'src/app/pages/evaluations/models/throw.model';

@Component({
  selector: 'app-throw-result-modal',
  templateUrl: './throw-result-modal.component.html',
  styleUrls: ['./throw-result-modal.component.scss'],
  standalone: false
})
export class ThrowResultModalComponent implements OnChanges{

  @Input() throwNumber = 1;

  @Input() distanceLabel?: string;

  @Input() lineDistanceLabel?: string;

  @Output() save =
    new EventEmitter<{
      result: ThrowResult;
      observation: string;
    }>();

  @Output()
  reposition = new EventEmitter<void>();

  selectedResult: ThrowResult = 'good';

  observation = '';

  ngOnChanges(changes: SimpleChanges): void {

  this.selectedResult = 'good';

  this.observation = '';

}

  repositionThrow(): void {

  this.selectedResult = 'good';

  this.observation = '';

  this.reposition.emit();

}

  saveResult() {

  this.save.emit({

    result: this.selectedResult,

    observation: this.observation

  });

  // Reiniciar para el siguiente lanzamiento
  this.selectedResult = 'good';
  this.observation = '';

}

}