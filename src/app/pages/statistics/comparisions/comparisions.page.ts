import { Component, OnDestroy, OnInit } from '@angular/core';

import { Athlete } from 'src/app/models/athlete.model';
import { Evaluation } from 'src/app/models/evaluation.model';
import { AthleteService } from 'src/app/services/athlete.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { SessionService } from 'src/app/services/session.service';
import { GeneralStatistics, StatisticsService } from 'src/app/services/statistics';

interface AthleteComparison {
  athlete: Athlete;
  stats: GeneralStatistics;
}

@Component({
  selector: 'app-comparisions',
  templateUrl: './comparisions.page.html',
  styleUrls: ['./comparisions.page.scss'],
  standalone: false
})
export class ComparisionsPage implements OnInit, OnDestroy {

  athletes: Athlete[] = [];

  athleteAId = '';

  athleteBId = '';

  comparisonA: AthleteComparison | null = null;

  comparisonB: AthleteComparison | null = null;

  private allEvaluations: Evaluation[] = [];

  private unsubscribeAthletes: (() => void) | null = null;

  private unsubscribeEvaluations: (() => void) | null = null;

  constructor(
    private sessionService: SessionService,
    private athleteService: AthleteService,
    private evaluationService: EvaluationService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {

    const user = this.sessionService.getUser();

    if (!user) {
      return;
    }

    this.unsubscribeAthletes = this.athleteService.listenAthletesByTrainer(
      user.uid,
      athletes => {
        this.athletes = athletes;
      }
    );

    this.unsubscribeEvaluations = this.evaluationService.listenEvaluationsByTrainer(
      user.uid,
      evaluations => {

        this.allEvaluations = evaluations;

        this.buildComparison();

      }
    );

  }

  ngOnDestroy(): void {

    this.unsubscribeAthletes?.();

    this.unsubscribeEvaluations?.();

  }

  onChange(): void {

    this.buildComparison();

  }

  private buildComparison(): void {

    this.comparisonA = this.buildFor(this.athleteAId);

    this.comparisonB = this.buildFor(this.athleteBId);

  }

  private buildFor(athleteId: string): AthleteComparison | null {

    const athlete = this.athletes.find(a => a.id === athleteId);

    if (!athlete) {
      return null;
    }

    const evaluations = this.allEvaluations.filter(e => e.athleteId === athleteId);

    return {
      athlete,
      stats: this.statisticsService.getGeneralStatistics(evaluations)
    };

  }

}
