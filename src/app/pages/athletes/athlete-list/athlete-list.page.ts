import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Athlete } from 'src/app/models/athlete.model';

import { AthleteService } from 'src/app/services/athlete.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-athlete-list',
  templateUrl: './athlete-list.page.html',
  styleUrls: ['./athlete-list.page.scss'],
  standalone: false
})
export class AthleteListPage implements OnInit, OnDestroy {

  athletes: Athlete[] = [];

  filteredAthletes: Athlete[] = [];

  searchText = '';

  selectedCategory = '';

  private unsubscribe: (() => void) | null = null;

  constructor(
    private router: Router,
    private athleteService: AthleteService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {

    const trainer = this.sessionService.getUser();

    if (!trainer) {
      return;
    }

    this.unsubscribe = this.athleteService.listenAthletesByTrainer(
      trainer.uid,
      athletes => {

        this.athletes = athletes;

        this.filteredAthletes = athletes;

      }
    );

  }

  ngOnDestroy(): void {

    if (this.unsubscribe) {
      this.unsubscribe();
    }

  }

  viewAthlete(id: string) {

    this.router.navigate([
      '/main/athlete-detail',
      id
    ]);

  }

  editAthlete(id: string) {

    console.log('Editar', id);

  }

  deleteAthlete(id: string) {

    console.log('Eliminar', id);

  }

  openEvaluations(id: string) {

    console.log('Evaluaciones', id);

  }

  filterAthletes() {

  const search = this.searchText
    .toLowerCase()
    .trim();

  this.filteredAthletes = this.athletes.filter(athlete => {

    const matchesSearch =

      !search ||

      athlete.fullName?.toLowerCase().includes(search) ||

      athlete.firstName?.toLowerCase().includes(search) ||

      athlete.lastName?.toLowerCase().includes(search) ||

      athlete.rut?.toLowerCase().includes(search) ||

      athlete.category?.toLowerCase().includes(search) ||

      athlete.club?.toLowerCase().includes(search);

    const matchesCategory =

      !this.selectedCategory ||

      athlete.category === this.selectedCategory;

    return matchesSearch && matchesCategory;

  });

}

selectCategory(category: string) {

  this.selectedCategory = category;

  this.filterAthletes();

}

}