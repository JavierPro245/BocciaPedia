import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Trainer } from 'src/app/models/trainer.model';

@Component({
  selector: 'app-trainer-card',
  templateUrl: './trainer-card.component.html',
  styleUrls: ['./trainer-card.component.scss'],
  standalone: false
})
export class TrainerCardComponent {

  @Input() trainer!: Trainer;

  @Output() details = new EventEmitter<string>();

  @Output() edit = new EventEmitter<string>();

  @Output() delete = new EventEmitter<string>();

  constructor() {}

  viewDetails() {

    this.details.emit(this.trainer.id);

  }

  editTrainer() {

    this.edit.emit(this.trainer.id);

  }

  deleteTrainer() {

    this.delete.emit(this.trainer.id);

  }

}