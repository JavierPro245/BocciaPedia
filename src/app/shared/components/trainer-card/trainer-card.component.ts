import { Component, EventEmitter, Input, Output } from '@angular/core';

import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-trainer-card',
  templateUrl: './trainer-card.component.html',
  styleUrls: ['./trainer-card.component.scss'],
  standalone: false
})
export class TrainerCardComponent {

  @Input() trainer!: User;

  @Output() details = new EventEmitter<string>();

  @Output() edit = new EventEmitter<string>();

  @Output() delete = new EventEmitter<string>();

  constructor() {}

  viewDetails() {
    this.details.emit(this.trainer.uid);
  }

  editTrainer() {
    this.edit.emit(this.trainer.uid);
  }

  deleteTrainer() {
    this.delete.emit(this.trainer.uid);
  }

}