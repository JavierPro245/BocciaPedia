import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Athlete } from 'src/app/models/athlete.model';
import { AthleteService } from 'src/app/services/athlete.service';

@Component({
  selector: 'app-athlete-detail',
  templateUrl: './athlete-detail.page.html',
  styleUrls: ['./athlete-detail.page.scss'],
  standalone: false
})
export class AthleteDetailPage implements OnInit, OnDestroy {

  athlete!: Athlete;

  private unsubscribe: (() => void) | null = null;

  constructor(
    private route: ActivatedRoute,
    private athleteService: AthleteService
  ) {}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.unsubscribe = this.athleteService.listenAthlete(
      id,
      (athlete: Athlete | null) => {

        if (!athlete) {
          return;
        }

        this.athlete = athlete;

      }
    );

  }

  ngOnDestroy(): void {

    if (this.unsubscribe) {
      this.unsubscribe();
    }

  }

}