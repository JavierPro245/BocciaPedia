import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CourtSelection } from '../models/court-selection.model';
import { Throw } from '../models/throw.model';
import { EvaluationSessionService } from 'src/app/services/evaluation-session';
import { ModalController } from '@ionic/angular';
import { ThrowResultModalComponent } from 'src/app/shared/components/throw-result-modal/throw-result-modal.component';
import { Router } from '@angular/router';

import { CourtEngineComponent } from '../components/court-engine/court-engine.component';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { EvaluationFlow } from
'../engine/evaluation-flow';
import { CourtMode } from '../models/court-mode.model';
import { pixelDistanceToMeters, formatCourtDistance, metersFromThrowLine } from '../engine/physics/court-scale';
import { AthleteService } from 'src/app/services/athlete.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-evaluation-run',
  templateUrl: './evaluation-run.page.html',
  styleUrls: ['./evaluation-run.page.scss'],
  standalone: false
})
export class EvaluationRunPage implements OnInit {

  viewMode: 'preview' | 'finish' = 'preview';

  flow!: EvaluationFlow;

  courtMode: CourtMode = 'placement';

  constructor(

  private sessionService: EvaluationSessionService,
  private evaluationService: EvaluationService,
  private athleteService: AthleteService,
  private notificationService: NotificationService,

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

  evaluationId = '';

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

  showOpponentConfirmation = false;

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

  instruction = '';

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

  //------------------------------------------------
  // MODO DE LA CANCHA
  //------------------------------------------------

  switch (config.evaluationType) {

    case 'First Ball':

      this.courtMode = 'first-ball';

      break;

    case 'Placement':

      this.courtMode = 'placement';

      break;

    case 'Smash':

      this.courtMode = 'smash';

      break;

    case 'Push On':

      this.courtMode = 'push-on';

      break;

    case 'Push Off':

      this.courtMode = 'push-off';

      break;

    case 'Ricochet':

      this.courtMode = 'ricochet';

      break;

    case 'Bochada':

      this.courtMode = 'bochada';

      break;

    case 'Custom':

      this.courtMode = 'custom';

      break;

    default:

      this.courtMode = 'placement';

      break;

  }

  //------------------------------------------------

  const evaluation =

    this.evaluationService.getEvaluation();

  if (evaluation?.id) {

    this.evaluationId = evaluation.id;

  }

  this.flow = new EvaluationFlow(

    config.evaluationType

  );

  this.updateInstruction();

}


  private updateInstruction(): void {

  if (!this.flow) {
    return;
  }

  if (this.flow.currentState === 'OPPONENT' && this.courtEngine) {

    const config = this.courtEngine.getOpponentSetupConfig();

    const placed = this.courtEngine.opponentBalls.length;

    this.instruction = placed < config.count
      ? `Coloque la bocha (${placed + 1} de ${config.count}).`
      : 'Ajuste la posición si es necesario y confirme.';

    return;

  }

  this.instruction =
    this.flow.getInstruction();

}

  //==============================
  // BOX / JACK
  //==============================

  async onSelection(selection: CourtSelection): Promise<void> {

  if (selection.box) {

  this.selectedBox = 'Box ' + selection.box;

  this.instruction =
    'Coloque el Jack en la cancha.';

  this.sessionService.setSelectedBox(selection.box);

  if (this.evaluationId) {

    await this.evaluationService.updateEvaluationFields(
  this.evaluationId,
  {
    selectedQuadrant: this.selectedQuadrant,
    jack: {
      x: selection.x,
      y: selection.y,
      quadrant: selection.quadrant as 'Q1' | 'Q2' | 'Q3' | 'Q4'
    },
    lastUpdatedStep: 'jack'
  }
);

  }

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

  if (this.evaluationId) {

  await this.evaluationService.updateEvaluationFields(
    this.evaluationId,
    {
      selectedQuadrant: this.selectedQuadrant,
      jack: {
        x: selection.x,
        y: selection.y,
        quadrant: this.selectedQuadrant as 'Q1' | 'Q2' | 'Q3' | 'Q4'
      }
    }
  );

}

}

  //==============================
  // LANZAMIENTOS
  //==============================

  distanceLabel?: string;

  throwLineDistanceLabel?: string;

  onThrowRegistered(ball: Throw): void {

  if (this.evaluationFinished) {
    return;
  }

  this.pendingThrow = ball;

  this.currentBall = ball;

  // Este es el lanzamiento que se está evaluando
  this.currentThrow = this.throws.length + 1;

  this.lockCourt = true;

  this.distanceLabel = ball.jack
    ? formatCourtDistance(
        pixelDistanceToMeters(ball.x - ball.jack.x, ball.y - ball.jack.y)
      )
    : undefined;

  this.throwLineDistanceLabel = formatCourtDistance(
    metersFromThrowLine(ball.y)
  );

  this.showThrowModal = true;

}

async saveThrowEvaluation(event: any): Promise<void> {

  if (!this.pendingThrow) {
    return;
  }

  //==============================
  // Guardar resultado
  //==============================

  this.pendingThrow.result = event.result;

  this.pendingThrow.observation = event.observation;

  this.throws.push(this.pendingThrow);

  // Actualizar lanzamiento actual
this.currentThrow = this.throws.length;

  this.sessionService.setThrows(this.throws);

  if (this.evaluationId) {

    await this.evaluationService.saveThrows(
      this.evaluationId,
      this.throws
    );

    const evaluation = this.evaluationService.getEvaluation();

if (evaluation) {

  evaluation.throwList = [...this.throws];

  this.evaluationService.setEvaluation(evaluation);

}

    await this.evaluationService.updateEvaluationFields(
      this.evaluationId,
      {
        currentThrow: this.throws.length,
        currentBallColor: this.ballColor,
        lastUpdatedStep: 'throw'
      }
    );

  }

  this.pendingThrow = undefined;

  this.currentBall = undefined;

  this.courtEngine.confirmThrow();

  this.showThrowModal = false;

  this.lockCourt = false;

  this.flow.next();

  this.updateInstruction();

  //==============================
  // ¿Terminó la evaluación?
  //==============================

  if (this.evaluationFinished) {

    this.instruction =
      'Evaluación finalizada.';

    return;

  }

  const nextThrow = this.throws.length + 1;

  //==============================
  // FIRST BALL
  //==============================

  if (this.evaluation === 'First Ball') {

    // Reiniciar solamente el intento
    this.courtEngine.resetAttempt();

    // Limpiar el cuadrante seleccionado
    this.selectedQuadrant = 'No seleccionado';

    // Mantener el mismo Box
    this.instruction =
      `Intento ${nextThrow} de ${this.totalThrows}: coloque nuevamente el Jack.`;

    return;

  }

  //==============================
  // RESTO DE EVALUACIONES
  //==============================

  this.instruction =
    `Realice el lanzamiento ${nextThrow} de ${this.totalThrows}.`;

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

 async finishEvaluation(): Promise<void> {

  // Guardamos por última vez los lanzamientos
  this.sessionService.setThrows(this.throws);

  if (this.evaluationId) {

  await this.evaluationService.updateEvaluationFields(
    this.evaluationId,
    {
      status: 'finished'
    }
  );

  await this.notifyAthleteIfLinked();

}
  this.evaluationService.setDetailViewMode('finish');
  this.viewMode = this.evaluationService.getDetailViewMode();
  this.flow.next();

  this.updateInstruction();
  // Al guardar/terminar, volvemos al listado (no al detalle de
  // esta evaluación puntual).
  this.router.navigate([
    '/main/evaluations/evaluations-list'
  ]);

}

private async notifyAthleteIfLinked(): Promise<void> {

  const currentEvaluation = this.evaluationService.getEvaluation();

  if (!currentEvaluation?.athleteId) {
    return;
  }

  const athlete = await this.athleteService.getAthlete(currentEvaluation.athleteId);

  if (!athlete?.linkedUserId) {
    return;
  }

  await this.notificationService.create({

    userId: athlete.linkedUserId,

    title: 'Nueva evaluación completada',

    message: `Tu entrenador registró una evaluación de ${currentEvaluation.evaluationType}.`,

    link: '/main/evaluations/evaluations-list',

    read: false,

    createdAt: new Date()

  });

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

jackDistanceLabel?: string;

onJackPending(event: any): void {

  console.log('JACK PENDING', event);

  this.pendingJack = event;

  this.lockCourt = true;

  this.jackDistanceLabel = formatCourtDistance(
    metersFromThrowLine(event.y)
  );

  this.showJackConfirmation = true;

}

confirmJack(): void {

  this.courtEngine.confirmJack();

  this.showJackConfirmation = false;

  this.lockCourt = false;

  this.flow.next();

  this.updateInstruction();

}

repositionJack(): void {

  this.courtEngine.cancelJack();

  this.pendingJack = undefined;

  this.showJackConfirmation = false;

  this.lockCourt = false;

}

//==============================
// BOCHAS RIVALES (Push On/Off, Bochada, Ricochet)
//==============================

onOpponentBallPlaced(): void {

  this.updateInstruction();

}

onOpponentSetupReady(): void {

  // A diferencia del Jack, acá NO se bloquea la cancha: el
  // entrenador puede seguir arrastrando las bochas para ajustarlas
  // mientras la tarjeta de confirmación está visible.
  this.showOpponentConfirmation = true;

  this.updateInstruction();

}

async confirmOpponentSetup(): Promise<void> {

  // Se leen las posiciones actuales del motor (no las del momento en
  // que se completó el conteo), por si el entrenador las arrastró
  // después de eso.
  const finalOpponentBalls = [...this.courtEngine.opponentBalls];

  this.courtEngine.confirmOpponentSetup();

  this.showOpponentConfirmation = false;

  this.lockCourt = false;

  if (this.evaluationId) {

    await this.evaluationService.updateEvaluationFields(
      this.evaluationId,
      {
        opponentBalls: finalOpponentBalls,
        lastUpdatedStep: 'opponent'
      }
    );

  }

  this.flow.next();

  this.updateInstruction();

}

repositionOpponentSetup(): void {

  this.courtEngine.cancelOpponentSetup();

  this.showOpponentConfirmation = false;

  this.lockCourt = false;

  this.updateInstruction();

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