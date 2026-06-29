import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-item',
  templateUrl: './settings-item.component.html',
  styleUrls: ['./settings-item.component.scss'],
  standalone: false
})
export class SettingsItemComponent {

  @Input() icon = '';

  @Input() title = '';

  @Input() subtitle = '';

  @Input() route = '';

  @Input() color = 'primary';

}