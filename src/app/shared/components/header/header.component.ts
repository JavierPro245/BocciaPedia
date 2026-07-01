import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {

  @Input() title!: string;

  @Input() subtitle?: string;

  @Input() icon?: string;

  @Input() showMenu = false;

  @Input() showBackButton = false;

  @Input() showProfile = false;

  @Input() color = 'primary';

  @Input() transparent = false;

  @Input() showNotifications = false;

  @Input() showSearch = false;

  @Input() showSettings = false;

  constructor(
    private location: Location
  ) {}

  goBack() {

    this.location.back();

  }

}