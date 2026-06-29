import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;

  @Input() subtitle?: string;

  @Input() icon?: string;

  @Input() showMenu!: boolean;

  @Input() showBackButton = false;

  @Input() showProfile = false;

  @Input() color = 'primary';

  @Input() transparent = false;
  
  @Input() showNotifications = false;
  
  @Input() showSearch = false;
  
  @Input() showSettings = false;

  constructor() { }

  ngOnInit() {}

}
