import { Component, Input, OnInit } from '@angular/core';
import { CourtSelection } from '../models/court-selection.model';
import { Throw } from '../models/throw.model';
import { EvaluationSessionService } from 'src/app/services/evaluation-session';

@Component({
  selector: 'app-evaluation-run',
  templateUrl: './evaluation-run.page.html',
  styleUrls: ['./evaluation-run.page.scss'],
  standalone: false
})
export class EvaluationRunPage implements OnInit {

  constructor(
    private sessionService: EvaluationSessionService
  ) {}

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

  @Input() throws: Throw[] = [];

  selectedBox = 'No seleccionado';

  selectedQuadrant = 'No seleccionado';

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

      this.selectedBox = `Box ${selection.box}`;

    }

    if (selection.target) {

      this.selectedQuadrant =
        selection.quadrant ?? 'No seleccionado';

    }

  }

  //==============================
  // LANZAMIENTOS
  //==============================

  onThrowRegistered(ball: Throw): void {

  console.log('Nueva bola', ball);

  this.throws = [...this.throws, ball];

  console.log(this.throws);

  this.currentThrow = this.throws.length;

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

  private finishEvaluation(): void {

    console.log('Evaluación finalizada');

    console.log(this.throws);

    // Aquí después guardaremos en Firebase

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

}