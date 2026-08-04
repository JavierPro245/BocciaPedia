import { Injectable } from '@angular/core';
import { Match } from '../models/match.model';
import { MatchRepositoryService } from 'src/app/services/match-repository.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private match?: Match;
  private autoSync = true;

  constructor(
  private repository: MatchRepositoryService
) {}

private async notifyChanges() {

  if (!this.autoSync) {
    return;
  }

  if (!this.match) {
    return;
  }

  if (!this.match.id) {
    return;
  }

  try {

    await this.repository.updateMatch(

      this.match.id,

      this.match

    );

  } catch (error) {

    console.error(

      'Error sincronizando partido',

      error

    );

  }

}

  // Crear un nuevo partido
  createMatch(match: Match): void {

    this.match = { ...match };

  }

  // Obtener el partido actual
  getMatch(): Match | undefined {

    return this.match;

  }

  // Actualizar el partido
  updateMatch(match: Match): void {

    this.match = { ...match };

  }

  // Sumar punto
  addPoint(team:'red'|'blue'):void{

    if(!this.match){

        return;

    }

    if(team==='red'){

        this.match.currentEndRedScore++;

    }

    else{

        this.match.currentEndBlueScore++;

    }

    this.notifyChanges();

}
  // Restar punto
  removePoint(team:'red'|'blue'):void{

    if(!this.match){

        return;

    }

    if(team==='red'){

        if(this.match.currentEndRedScore>0){

            this.match.currentEndRedScore--;

        }

    }

    else{

        if(this.match.currentEndBlueScore>0){

            this.match.currentEndBlueScore--;

        }

    }

    this.notifyChanges();

}

  // Consumir una bocha
  useBall(team: 'red' | 'blue'): void {

    if (!this.match) return;

    if (team === 'red') {

      if (this.match.redBallsPlayed < 6) {

        this.match.redBallsPlayed++;

      }

    } else {

      if (this.match.blueBallsPlayed < 6) {

        this.match.blueBallsPlayed++;

      }

    }

    this.notifyChanges();

  }

  useTurn(team:'red'|'blue'):void{

    if(!this.match){

        return;

    }

    // Si el mismo jugador ya tiene el reloj corriendo,
// ignorar un segundo clic.
if (
    this.match.timerRunning &&
    this.match.turn === team
) {
    return;
}

    // Si es el jugador que inicia el END
    // y todavía no lanzó el Jack

    // En el Tie Break no existe lanzamiento del Jack

if (!this.match.isTieBreak) {

  if (
    team === this.match.startingColor &&
    !this.match.jackPlayed
  ) {

    this.match.jackPlayed = true;

    return;

  }

}

// Consumir una bocha normalmente
this.useBall(team);

}

  // Reiniciar bochas
  resetBalls(): void {

    if (!this.match) return;

    this.match.redBallsPlayed = 0;
    this.match.blueBallsPlayed = 0;

    this.notifyChanges();

  }

  // Turno rojo
  startRedTurn(): void {

    if (!this.match) return;

    this.match.turn = 'red';
    this.match.state = 'red-turn';

    this.notifyChanges();

  }

  // Turno azul
  startBlueTurn(): void {

    if (!this.match) return;

    this.match.turn = 'blue';
    this.match.state = 'blue-turn';

    this.notifyChanges();

  }

  // Pausar partido
  pauseMatch(): void {

    if (!this.match) return;

    this.match.turn = null;
    this.match.state = 'waiting';

    this.notifyChanges();

  }

  // Siguiente END
  nextEnd(): void {

    if (!this.match) {
      this.notifyChanges();
  return;
}

// ¿Ya terminó el partido?

if (this.match.currentEnd >= this.match.totalEnds) {

  this.match.state = 'finished';
  this.notifyChanges();

  return;

}

  if (!this.match) {
    return;
  }

  this.match.currentEnd++;

  // Reiniciar marcador del END
  this.match.currentEndRedScore = 0;
  this.match.currentEndBlueScore = 0;

  // Reiniciar bochas
  this.match.redBallsPlayed = 0;
  this.match.blueBallsPlayed = 0;

  // Reiniciar cronómetros
  this.match.redTime = this.match.secondsPerPlayer;
  this.match.blueTime = this.match.secondsPerPlayer;

  // Detener tiempo
  this.match.turn = null;
  this.match.timerRunning = false;

  // Alternar quien inicia con el Jack
  this.match.startingColor =
    this.match.startingColor === 'red'
      ? 'blue'
      : 'red';

  this.match.jackPlayed = false;

  this.match.showRest = false;
this.match.restSeconds = 0;

this.match.showPenalty = false;
this.match.penaltySeconds = 0;

  this.notifyChanges();

}

  confirmEnd(): void {

  if (!this.match) {
    return;
  }

  // Determinar ganador del END

  this.notifyChanges();

  let winner: 'red' | 'blue' | 'tie' = 'tie';

  if (this.match.currentEndRedScore > this.match.currentEndBlueScore) {

    winner = 'red';

  } else if (this.match.currentEndBlueScore > this.match.currentEndRedScore) {

    winner = 'blue';

  }

  // Guardar END


  this.notifyChanges();

  this.match.ends.push({

    end: this.match.currentEnd,

    redScore: this.match.currentEndRedScore,

    blueScore: this.match.currentEndBlueScore,

    winner

  });

  // Recalcular marcador

  this.calculateScore();

  // Reiniciar marcador del END

  this.match.currentEndRedScore = 0;

  this.match.currentEndBlueScore = 0;

  this.notifyChanges();

}

private calculateScore(): void {

  if (!this.match) {
    return;
  }

  const match = this.match;

  match.redScore = 0;
  match.blueScore = 0;

  match.ends.forEach(end => {

    match.redScore += end.redScore;
    match.blueScore += end.blueScore;

  });

}

  // Finalizar partido
  finishMatch(): void {

    if (!this.match) return;

    this.match.state = 'finished';

    this.notifyChanges();

  }

  // Eliminar partido
  clear(): void {

    this.match = undefined;

  }

  startRedTimer(): void {

    if (!this.match) {
        return;
    }

    // Ya está corriendo el reloj rojo
    if (this.match.timerRunning && this.match.turn === 'red') {
      this.notifyChanges();
        return;
    }

    this.match.turn = 'red';
    this.match.timerRunning = true;

    this.notifyChanges();

}

startBlueTimer(): void {

    if (!this.match) {
        return;
    }

    // Ya está corriendo el reloj azul
    if (this.match.timerRunning && this.match.turn === 'blue') {
      this.notifyChanges();
        return;
    }

    this.match.turn = 'blue';
    this.match.timerRunning = true;

    this.notifyChanges();

}

pauseTimers(){

    if(!this.match)return;

    this.match.timerRunning=false;

    this.match.turn=null;

    this.notifyChanges();

}

startPenalty(team: 'red' | 'blue') {

  if (!this.match) return;

  this.match.penalty = {
    team,
    active: true,
    executed: false,
    timeRemaining: 60,
    success: null
};

this.notifyChanges();

}

updatePenaltyTime(seconds: number) {

  if (!this.match?.penalty) return;

  this.match.penalty.timeRemaining = seconds;

  this.notifyChanges();

}

finishPenalty(scored: boolean) {

  if (!this.match?.penalty) return;

  if (scored) {

    if (this.match.penalty.team === 'red') {

      this.match.redScore++;

    } else {

      this.match.blueScore++;

    }

  }

  this.match.penalty = null;
  this.notifyChanges();

}

updateBroadcastState(
  data: Partial<Match>
): void {

  if (!this.match) {
    return;
  }

  this.match = {
    ...this.match,
    ...data
  };

  this.notifyChanges();

}

}