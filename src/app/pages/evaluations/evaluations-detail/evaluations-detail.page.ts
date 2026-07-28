import { Component, OnInit } from '@angular/core';
import { EvaluationSessionService } from 'src/app/services/evaluation-session';
import { Throw } from '../models/throw.model';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { SessionService } from '../../../services/session.service';

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

  viewMode: 'preview' | 'finish' = 'preview';

  constructor(

  private evaluationService: EvaluationService,
  
  private sessionService: SessionService,

  private toastController: ToastController,

  private router: Router

) {}
  ngOnInit(): void {

    this.viewMode = this.evaluationService.getDetailViewMode();

  const evaluation = this.evaluationService.getEvaluation();

  if (!evaluation) {
    return;
  }

  this.athlete = evaluation.athleteName;

  this.evaluation = evaluation.evaluationType;

  this.distance = evaluation.distance;

  this.throws = evaluation.throwList ?? [];

  this.selectedBox = evaluation.selectedBox;

  this.selectedQuadrant = evaluation.selectedQuadrant;

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

async finishEvaluation(): Promise<void> {

  const evaluation =
    this.evaluationService.getEvaluation();

  if (evaluation?.id) {

    await this.evaluationService.updateEvaluationFields(

      evaluation.id,

      {

        status: 'finished'

      }

    );

  }

  const toast =
    await this.toastController.create({

      message:
        'Evaluación finalizada correctamente.',

      duration: 2000,

      color: 'success',

      position: 'bottom'

    });

  await toast.present();

  await this.router.navigate([

    '/main/evaluations'

  ]);

}

}