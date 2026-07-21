import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.page.html',
  styleUrls: ['./trainers.page.scss'],
  standalone: false
})
export class TrainersPage implements OnInit {

  router = inject(Router);
  currentPath: string = '';

  pages = [
    { title: 'Create', url: '/trainers/trainer-create', icon: 'home-outline'},
    { title: 'Details', url: '/trainers/trainer-detail', icon: 'person-outline'},
    { title: 'Edit', url: '/trainers/trainer-edit', icon: 'counter-outline'},
    { title: 'List', url: '/trainers/trainer-list', icon: 'person-outline'}
  ]

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event) this.currentPath = event.url
    })
  }


}
