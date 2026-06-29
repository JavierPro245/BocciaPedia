import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: false
})
export class StatisticsPage implements OnInit {

  router = inject(Router);
  currentPath: string = '';

  pages = [
    { title: 'Athlete Statistics', url: '/statistics/athlete-statistics', icon: 'home-outline'},
    { title: 'Comparisions', url: '/statistics/comparisions', icon: 'person-outline'},
    { title: 'Dashboard', url: '/statistics/dashboard', icon: 'counter-outline'},
    { title: 'Reports', url: '/statistics/reports', icon: 'person-outline'}
  ]

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event) this.currentPath = event.url
    })
  }

}
