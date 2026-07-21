import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  @Input() showAction = false;

@Input() actionIcon = 'tv-outline';

@Output() action = new EventEmitter<void>();

  constructor(
    private location: Location
  ) {}

  goBack() {

    this.location.back();

  }

  onAction(){

    this.action.emit();

}

}