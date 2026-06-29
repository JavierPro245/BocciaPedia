import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.page.html',
  styleUrls: ['./administration.page.scss'],
  standalone: false
})
export class AdministrationPage implements OnInit {

  router = inject(Router);
  currentPath: string = '';

  pages = [
    { title: 'Roles', url: '/administration/roles', icon: 'home-outline'},
    { title: 'System Config', url: '/administration/system-config', icon: 'person-outline'},
    { title: 'Trainers', url: '/administration/trainers', icon: 'counter-outline'},
    { title: 'Users', url: '/administration/users', icon: 'person-outline'}
  ]

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event) this.currentPath = event.url
    })
  }

}
