import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';

import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-trainer-card',
  templateUrl: './trainer-card.component.html',
  styleUrls: ['./trainer-card.component.scss'],
  standalone: false
})
export class TrainerCardComponent {

  @ViewChild('popover')
  popover!: IonPopover;

  @Input() trainer!: User;

  @Output() details = new EventEmitter<string>();

  @Output() edit = new EventEmitter<string>();

  @Output() delete = new EventEmitter<string>();

  constructor() {}

  async viewDetails() {

  await this.popover.dismiss();

  this.details.emit(this.trainer.uid);

}

async editTrainer() {

  await this.popover.dismiss();

  this.edit.emit(this.trainer.uid);

}

async deleteTrainer() {

  await this.popover.dismiss();

  this.delete.emit(this.trainer.uid);

}

}