import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-avatar',
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss'],
  standalone: false
})
export class ProfileAvatarComponent {

  @Input() image = 'assets/avatar.png';

  @Input() name = 'Usuario';

  @Input() role = '';

  @Input() online = false;

  @Input() editable = false;

}