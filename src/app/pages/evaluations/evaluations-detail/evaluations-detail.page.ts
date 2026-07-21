import { Component, OnInit } from '@angular/core';
import { EvaluationSessionService } from 'src/app/services/evaluation-session';
import { Throw } from '../models/throw.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluations-detail',
  templateUrl: './evaluations-detail.page.html',
  styleUrls: ['./evaluations-detail.page.scss'],
  standalone: false
})
export class EvaluationsDetailPage implements OnInit {

  athlete = '';

  evaluation = '';

  distance = 0;

  throws: Throw[] = [];

  excellent = 0;

  good = 0;

  regular = 0;

  bad = 0;

  selectedBox?: number;

  selectedQuadrant?: string;

  constructor(
    private sessionService: EvaluationSessionService,
    private router: Router
  ) {}
  ngOnInit(): void {

    const config = this.sessionService.getConfig();

    if (config) {

      this.athlete = config.athleteName;

      this.evaluation = config.evaluationType;

      this.distance = config.distance;

    }

    this.throws = this.sessionService.getThrows();

    this.selectedBox = this.sessionService.getSelectedBox();

    this.selectedQuadrant = this.sessionService.getSelectedQuadrant();

    this.calculateStatistics();

  }

  private calculateStatistics(): void {

  this.excellent =
    this.throws.filter(t => t.result === 'excellent').length;

  this.good =
    this.throws.filter(t => t.result === 'good').length;

  this.regular =
    this.throws.filter(t => t.result === 'regular').length;

  this.bad =
    this.throws.filter(t => t.result === 'bad').length;

}

  get totalThrows(): number {

    return this.throws.length;

  }

  get precision(): number {

    if (this.totalThrows === 0) {
      return 0;
    }

    return Number(
      (
        ((this.excellent + this.good) / this.totalThrows) * 100
      ).toFixed(1)
    );

  }

  get excellentPercent(): number {

  if (!this.totalThrows) {
    return 0;
  }

  return Number(
    ((this.excellent / this.totalThrows) * 100).toFixed(1)
  );

}

get goodPercent(): number {

  if (!this.totalThrows) {
    return 0;
  }

  return Number(
    ((this.good / this.totalThrows) * 100).toFixed(1)
  );

}

get regularPercent(): number {

  if (!this.totalThrows) {
    return 0;
  }

  return Number(
    ((this.regular / this.totalThrows) * 100).toFixed(1)
  );

}

get badPercent(): number {

  if (!this.totalThrows) {
    return 0;
  }

  return Number(
    ((this.bad / this.totalThrows) * 100).toFixed(1)
  );

}

goToHeatMap(): void {

  this.router.navigate([
    '/main/evaluations/heatmap'
  ]);

}

openThrows(){

this.router.navigate([

'/main/evaluations/evaluation-throws'

]);

}

}