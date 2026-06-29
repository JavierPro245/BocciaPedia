import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
  standalone: false
})
export class DashboardCardComponent  implements OnInit {

  @Input() icon!: string;

  @Input() title!: string;

  @Input() value!: number;

  @Input() color = 'primary';

  @Input() route?: string;

  constructor() { }

  ngOnInit() {}

}
