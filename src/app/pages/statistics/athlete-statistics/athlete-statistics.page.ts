import { Component, OnDestroy, OnInit } from '@angular/core';

import { Athlete } from 'src/app/models/athlete.model';
import { Evaluation } from 'src/app/models/evaluation.model';
import { AthleteService } from 'src/app/services/athlete.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { SessionService } from 'src/app/services/session.service';
import { GeneralStatistics, StatisticsService } from 'src/app/services/statistics';

interface EvaluationTrendPoint {
  date: Date;
  title: string;
  excellentPercent: number;
  throws: number;
}

@Component({
  selector: 'app-athlete-statistics',
  templateUrl: './athlete-statistics.page.html',
  styleUrls: ['./athlete-statistics.page.scss'],
  standalone: false
})
export class AthleteStatisticsPage implements OnInit, OnDestroy {

  athletes: Athlete[] = [];

  selectedAthleteId = '';

  private allEvaluations: Evaluation[] = [];

  athleteEvaluations: Evaluation[] = [];

  stats: GeneralStatistics | null = null;

  trend: EvaluationTrendPoint[] = [];

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

        this.applyFilter();

      }
    );

  }

  ngOnDestroy(): void {

    this.unsubscribeAthletes?.();

    this.unsubscribeEvaluations?.();

  }

  onAthleteChange(): void {

    this.applyFilter();

  }

  private applyFilter(): void {

    if (!this.selectedAthleteId) {

      this.athleteEvaluations = [];

      this.stats = null;

      this.trend = [];

      return;

    }

    this.athleteEvaluations = this.allEvaluations
      .filter(e => e.athleteId === this.selectedAthleteId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.stats = this.statisticsService.getGeneralStatistics(this.athleteEvaluations);

    this.trend = this.athleteEvaluations.map(evaluation => {

      const throws = evaluation.throwList ?? [];

      const excellent = throws.filter(t => t.result === 'excellent').length;

      return {
        date: new Date(evaluation.date),
        title: evaluation.title,
        excellentPercent: throws.length ? (excellent * 100) / throws.length : 0,
        throws: throws.length
      };

    });

  }

}
