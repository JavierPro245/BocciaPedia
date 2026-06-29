import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.page.html',
  styleUrls: ['./evaluations.page.scss'],
  standalone: false
})
export class EvaluationsPage implements OnInit {

  router = inject(Router);
  currentPath: string = '';

  pages = [
    { title: 'Evaluations Config', url: '/evaluations/evaluations-config', icon: 'home-outline'},
    { title: 'Evaluations Crete', url: '/evaluations/evaluations-create', icon: 'person-outline'},
    { title: 'Evaluations Detail', url: '/evaluations/evaluations-detail', icon: 'counter-outline'},
    { title: 'Evaluations List', url: '/evaluations/evaluations-list', icon: 'person-outline'},
    { title: 'Heat Map', url: '/evaluations/heatmap', icon: 'person-outline'}
  ]

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event) this.currentPath = event.url
    })
  }

}
