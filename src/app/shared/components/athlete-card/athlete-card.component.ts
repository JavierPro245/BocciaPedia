import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Athlete } from 'src/app/models/athlete.model';

@Component({
  selector: 'app-athlete-card',
  templateUrl: './athlete-card.component.html',
  styleUrls: ['./athlete-card.component.scss'],
  standalone: false
})
export class AthleteCardComponent {

  @Input() athlete!: Athlete;

  @Output() details = new EventEmitter<void>();

  @Output() edit = new EventEmitter<void>();

  @Output() delete = new EventEmitter<void>();

  @Output() evaluations = new EventEmitter<void>();

}