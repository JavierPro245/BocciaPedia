import { Component } from '@angular/core';
import { EvaluationConfig } from '../models/evaluation-config.model';
import { Router } from '@angular/router';

import { EvaluationService } from 'src/app/services/evaluation.service';
import { EvaluationSessionService } from 'src/app/services/evaluation-session';
import { Evaluation, EvaluationType } from 'src/app/models/evaluation.model';
import { AlertController } from '@ionic/angular';
import { Athlete } from 'src/app/models/athlete.model';
import { AthleteService } from 'src/app/services/athlete.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-evaluations-create',
  templateUrl: './evaluations-create.page.html',
  styleUrls: ['./evaluations-create.page.scss'],
  standalone: false
})
export class EvaluationsCreatePage {

  constructor(

  private router: Router,

  private evaluationService: EvaluationService,

  private sessionService: EvaluationSessionService,

  private alertController: AlertController,

  private athleteService: AthleteService,

  private authService: AuthService

){}

  config: EvaluationConfig = {

  title: '',

  athleteId: '',

  athleteName: '',

  evaluationType: 'First Ball',

  throws: 6,

  distance: 3,

  notes: ''

};

  athletes: Athlete[] = [];

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

  ngOnInit() {

  this.authService.listenAuthState(user => {

    if (!user) {
      return;
    }

    this.athleteService.listenAthletesByTrainer(

      user.uid,

      athletes => {

        this.athletes = athletes;

      }

    );

  });

}

  increaseThrows(){

    this.config.throws++;

  }

  decreaseThrows(){

    if(this.config.throws>1){

      this.config.throws--;

    }

  }

  async continue() {

    if (this.config.distance > 10) {

  const alert = await this.alertController.create({

    header: 'Distancia inválida',

    message: 'La distancia máxima permitida para una evaluación es de 10 metros.',

    buttons: ['Aceptar']

  });

  await alert.present();

  return;

}

  const athlete = this.athletes.find(
    a => a.id === this.config.athleteId
  );

  if (!athlete) {
    return;
  }

  this.config.athleteName = athlete.fullName;

  const currentUser = this.authService.getCurrentUser();

  if (!currentUser) {
    return;
  }

  const evaluation: Evaluation = {

    title: this.config.title,

  trainerId: currentUser.uid,

  athleteId: this.config.athleteId,

  athleteName: this.config.athleteName,

  evaluationType: this.config.evaluationType,

  category: athlete.category,

  throws: this.config.throws,

  currentThrow: 0,

  distance: this.config.distance,

  notes: this.config.notes,

  date: new Date(),

  status: 'config',

  throwList: [],

  statistics: {

    excellent: 0,

    good: 0,

    regular: 0,

    bad: 0

  }

};

  try {

    const evaluationId =
  await this.evaluationService.createEvaluation(evaluation);

this.evaluationService.setEvaluation({
  id: evaluationId,
  ...evaluation
});

    this.sessionService.setConfig(this.config);

    this.router.navigate([
      '/main/evaluations/evaluation-run'
    ]);

  } catch (error) {

    console.error(error);

  }

}

}