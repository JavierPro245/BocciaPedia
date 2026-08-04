import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  standalone: false
})
export class UserAvatarComponent {

  @Input() photoURL: string | null = null;

  @Input() size = 72;

}