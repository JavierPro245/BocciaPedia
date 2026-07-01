import { Component } from '@angular/core';
import { EvaluationConfig } from '../models/evaluation-config.model';
import { Router } from '@angular/router';

import { EvaluationService } from 'src/app/services/evaluation';
import { EvaluationSessionService } from 'src/app/services/evaluation-session';
import { EvaluationType } from 'src/app/models/evaluation.model';

@Component({
  selector: 'app-evaluations-create',
  templateUrl: './evaluations-create.page.html',
  styleUrls: ['./evaluations-create.page.scss'],
  standalone: false
})
export class EvaluationsCreatePage {

  constructor(

    private router:Router,

    private evaluationService:EvaluationService,

    private sessionService: EvaluationSessionService

  ){}

  config: EvaluationConfig = {

  athleteId: '',

  athleteName: '',

  evaluationType: 'First Ball',

  throws: 6,

  distance: 3,

  notes: ''

};

  athletes = [

    {
      id: '1',
      name: 'Javier Bastias'
    },

    {
      id: '2',
      name: 'María Soto'
    }

  ];

  evaluations: EvaluationType[] = [

  'First Ball',

  'Placement',

  'Push On',

  'Push Off',

  'Ricochet',

  'Smash',

  'Bochada'

];

  distances = [3,5,7,9];

  increaseThrows(){

    this.config.throws++;

  }

  decreaseThrows(){

    if(this.config.throws>1){

      this.config.throws--;

    }

  }

  continue() {

  const athlete = this.athletes.find(
    a => a.id === this.config.athleteId
  );

  this.config.athleteName = athlete?.name ?? '';

  this.evaluationService.setEvaluation({

    athleteId: this.config.athleteId,

    athleteName: this.config.athleteName,

    evaluationType: this.config.evaluationType,

    throws: this.config.throws,

    currentThrow: 1,

    distance: this.config.distance,

    date: new Date(),

    status: 'config',

    notes: this.config.notes

  });

  this.sessionService.setConfig(this.config);

  this.router.navigate([
    '/main/evaluations/evaluation-run'
  ]);

}

}