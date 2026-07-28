import { Component, OnInit } from '@angular/core';
import { Evaluation } from 'src/app/models/evaluation.model';
import { SessionService } from 'src/app/services/session.service';
import {
  StatisticsService,
  GeneralStatistics
} from 'src/app/services/statistics';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {

  evaluations: Evaluation[] = [];

  athletes:any[] = [];

  monthlyStats:any[]=[];

  stats: GeneralStatistics = {

    totalEvaluations:0,

    totalThrows:0,

    excellent:0,

    good:0,

    regular:0,

    bad:0,

    total:0,

    excellentPercent:0,

    goodPercent:0,

    regularPercent:0,

    badPercent:0,

    finishedEvaluations:0

  };

  constructor(

  private session: SessionService,

  private evaluationService: EvaluationService,

  private statisticsService: StatisticsService

) {}

  ngOnInit(): void {

  this.session.currentUser$.subscribe(user => {

    if (!user) {
      return;
    }

    console.log('Usuario logueado:', user);

    this.evaluationService.listenEvaluationsByTrainer(

  user.uid,

  (evaluations: Evaluation[]) => {

    this.evaluations = evaluations;

    this.stats =
  this.statisticsService.getGeneralStatistics(
    evaluations
  );

this.athletes =
  this.statisticsService.getAthleteStatistics(
    evaluations
  );

this.monthlyStats =
  this.statisticsService.getMonthlyStatistics(
    evaluations
  );

  console.log(this.monthlyStats);

  }

);

  });

}

}