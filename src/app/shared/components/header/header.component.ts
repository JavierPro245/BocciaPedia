import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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

  @Input()
backRoute?: string;

@Input() actionIcon = 'tv-outline';

@Output() action = new EventEmitter<void>();

@Output() back = new EventEmitter<void>();

  constructor(
    private location: Location,
     private router: Router
  ) {}

  goBack() {

  if (this.backRoute) {

    this.router.navigate([this.backRoute]);

    return;

  }

  this.location.back();

}

  onAction(){

    this.action.emit();

}

}