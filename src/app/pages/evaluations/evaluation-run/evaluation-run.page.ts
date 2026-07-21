import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CourtSelection } from '../models/court-selection.model';
import { Throw } from '../models/throw.model';
import { EvaluationSessionService } from 'src/app/services/evaluation-session';
import { ModalController } from '@ionic/angular';
import { ThrowResultModalComponent } from 'src/app/shared/components/throw-result-modal/throw-result-modal.component';
import { Router } from '@angular/router';

import { CourtEngineComponent } from '../components/court-engine/court-engine.component';

@Component({
  selector: 'app-evaluation-run',
  templateUrl: './evaluation-run.page.html',
  styleUrls: ['./evaluation-run.page.scss'],
  standalone: false
})
export class EvaluationRunPage implements OnInit {

  constructor(

  private sessionService: EvaluationSessionService,

  private modalController: ModalController,

  private router: Router

) {}

  @ViewChild('courtEngine')

  courtEngine!: CourtEngineComponent;

  //==============================
  // DATOS DE LA EVALUACIÓN
  //==============================

  athlete = '';

  category = 'BC3';

  evaluation = '';

  distance = 0;

  totalThrows = 0;

  currentThrow = 0;

  //==============================
  // ESTADO
  //==============================

  ballColor: 'red' | 'blue' = 'red';

  lockCourt = false;

  showJackConfirmation = false;

  pendingJack?: {

    x: number;

    y: number;

    quadrant: string;

  };

  showThrowModal = false;

  currentBall?: Throw;

  pendingThrow?: Throw;

  @Input() throws: Throw[] = [];

  selectedBox = 'No seleccionado';

  selectedQuadrant = 'No seleccionado';

  //==========================
  // Asistente
  //==========================

  step = 1;

  boxCompleted = false;

  jackCompleted = false;

  instruction =
  'Seleccione el Box para comenzar la evaluación.';

  //==============================
  // INICIO
  //==============================

  ngOnInit(): void {

    const config = this.sessionService.getConfig();
    console.log('CONFIG:', config);
    if (!config) {
      return;
    }

    this.athlete = config.athleteName;
    this.evaluation = config.evaluationType;
    this.distance = config.distance;
    this.totalThrows = config.throws;

    this.currentThrow = 0;
    this.throws = [];
    this.ballColor = 'red';

  }

  //==============================
  // BOX / JACK
  //==============================

  onSelection(selection: CourtSelection): void {

  if (selection.box) {

    this.selectedBox = 'Box ' + selection.box;

    this.instruction =
    'Coloque el Jack en la cancha.';

    this.sessionService.setSelectedBox(selection.box);

    return;

  }

  if (selection.target) {

    this.selectedQuadrant = selection.quadrant ?? '';

    this.sessionService.setSelectedQuadrant(
      this.selectedQuadrant
    );

    this.sessionService.setJack(

      selection.x,

      selection.y

    );

  }

}

  //==============================
  // LANZAMIENTOS
  //==============================

  onThrowRegistered(ball: Throw): void {

  if (this.evaluationFinished) {
    return;
  }

  this.pendingThrow = ball;

  this.currentBall = ball;

  // Este es el lanzamiento que se está evaluando
  this.currentThrow = this.throws.length + 1;

  this.lockCourt = true;

  this.showThrowModal = true;

}

saveThrowEvaluation(event: any): void {

  if (!this.pendingThrow) {
    return;
  }

  this.pendingThrow.result = event.result;

  this.pendingThrow.observation = event.observation;

  this.throws.push(this.pendingThrow);

  this.sessionService.setThrows(this.throws);

  this.pendingThrow = undefined;

  this.currentBall = undefined;

  this.courtEngine.confirmThrow();

  this.showThrowModal = false;

  this.lockCourt = false;

  if (!this.evaluationFinished) {

    const nextThrow = this.throws.length + 1;

if (nextThrow <= this.totalThrows) {

  this.instruction =
    `Realice el lanzamiento ${nextThrow} de ${this.totalThrows}.`;

} else {

  this.instruction =
    'Evaluación finalizada.';

}

  }

}


private async showThrowResultModal(ball: Throw): Promise<void> {

  const modal = await this.modalController.create({

    component: ThrowResultModalComponent,

    componentProps: {

      throwNumber: ball.throwNumber

    },

    backdropDismiss: false

  });

  modal.onDidDismiss().then(result => {

    if (!result.data) {
      return;
    }

    ball.result = result.data.result;

    ball.observation = result.data.observation;

    this.lockCourt = false;

  });

  await modal.present();

}

  //==============================
  // CAMBIAR COLOR
  //==============================

  private changeBallColor(): void {

    this.ballColor =
      this.ballColor === 'red'
        ? 'blue'
        : 'red';

  }

  //==============================
  // FIN EVALUACIÓN
  //==============================

  finishEvaluation(): void {

  // Guardamos por última vez los lanzamientos
  this.sessionService.setThrows(this.throws);

  // Navegamos al resumen
  this.router.navigate([
    '/main/evaluations/evaluations-detail'
  ]);

}

  //==============================
  // GETTERS
  //==============================

  get progress(): number {

    if (this.totalThrows === 0) {
      return 0;
    }

    return this.currentThrow / this.totalThrows;

  }

  get evaluationFinished(): boolean {

    return this.currentThrow >= this.totalThrows;

  }

  get throwsRemaining(): number {

    return this.totalThrows - this.currentThrow;

  }


  repositionThrow(): void {

    this.courtEngine.cancelThrow();

  this.pendingThrow = undefined;

  this.currentBall = undefined;

  this.showThrowModal = false;

  this.lockCourt = false;

  this.instruction =
  'Vuelva a colocar el lanzamiento.';

}

onJackPending(event: any): void {

  console.log('JACK PENDING', event);

  this.pendingJack = event;

  this.lockCourt = true;

  this.showJackConfirmation = true;

}

confirmJack(): void {

  this.courtEngine.confirmJack();

  this.showJackConfirmation = false;

  this.lockCourt = false;

  this.instruction =
  `Realice el lanzamiento 1 de ${this.totalThrows}.`;

}

repositionJack(): void {

  this.courtEngine.cancelJack();

  this.pendingJack = undefined;

  this.showJackConfirmation = false;

  this.lockCourt = false;

}

get isBoxCompleted(): boolean {

  return this.selectedBox !== 'No seleccionado';

}

get isJackCompleted(): boolean {

  return this.selectedQuadrant !== 'No seleccionado';

}

get isThrowStepActive(): boolean {

  return this.isBoxCompleted && this.isJackCompleted;

}

}