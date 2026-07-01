import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  standalone: false
})
export class ImagePickerComponent {

  @Input() image = 'assets/avatars/avatar.png';

  @Input() editable = true;

  @Output() imageChange = new EventEmitter<File>();


  onFileSelected(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    this.imageChange.emit(file);

    const reader = new FileReader();

    reader.onload = () => {

      this.image = reader.result as string;

    };

    reader.readAsDataURL(file);

  }

}