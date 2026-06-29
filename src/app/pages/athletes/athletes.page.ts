import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-athletes',
  templateUrl: './athletes.page.html',
  styleUrls: ['./athletes.page.scss'],
  standalone: false
})
export class AthletesPage implements OnInit {

  router = inject(Router);
  currentPath: string = '';

  pages = [
    { title: 'Create', url: '/athletes/athlete-create', icon: 'home-outline'},
    { title: 'Details', url: '/athletes/athlete-detail', icon: 'person-outline'},
    { title: 'Edit', url: '/athletes/athlete-edit', icon: 'counter-outline'},
    { title: 'List', url: '/athletes/athlete-list', icon: 'person-outline'}
  ]

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event) this.currentPath = event.url
    })
  }

}
