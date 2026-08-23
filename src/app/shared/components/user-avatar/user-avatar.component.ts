import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  standalone: false
})
export class UserAvatarComponent implements OnChanges {

  @Input() photoURL: string | null = null;

  @Input() size = 72;

  loadFailed = false;

  ngOnChanges(): void {

    this.loadFailed = false;

  }

  onImageError(): void {

    console.warn('[UserAvatar] No se pudo cargar la foto:', this.photoURL);

    this.loadFailed = true;

  }

}