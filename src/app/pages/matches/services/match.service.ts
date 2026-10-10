import { Injectable } from '@angular/core';
import { Match, Penalty } from '../models/match.model';
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

    // Si ya se le acabó el tiempo a ese equipo, no se reanuda el
    // reloj ni se cuenta otra bocha: no le alcanzaría el tiempo para
    // tirarla.
    const timeLeft = team === 'red' ? this.match.redTime : this.match.blueTime;

    if (timeLeft <= 0) {
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

  // Todavía no se resetean los relojes acá (eso pasa recién al pasar
  // al siguiente END), así que redTime/blueTime siguen siendo lo que
  // le quedaba a cada uno al cerrar este parcial.
  this.match.ends.push({

    end: this.match.currentEnd,

    redScore: this.match.currentEndRedScore,

    blueScore: this.match.currentEndBlueScore,

    winner,

    redTimeUsed: Math.max(0, this.match.secondsPerPlayer - this.match.redTime),

    blueTimeUsed: Math.max(0, this.match.secondsPerPlayer - this.match.blueTime)

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

// Agrega una falta/penalización a la lista, sin reemplazar las que
// ya estén pendientes: así pueden acumularse varias en el mismo parcial.
startPenalty(team: 'red' | 'blue'): void {

  if (!this.match) return;

  if (!this.match.penalties) {
    this.match.penalties = [];
  }

  const penalty: Penalty = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    team,
    end: this.match.currentEnd,
    active: true,
    executed: false,
    timeRemaining: 60,
    success: null
  };

  this.match.penalties.push(penalty);

  this.notifyChanges();

}

// Resuelve una falta puntual de la lista (logró o no logró) y, si la
// logró, suma el punto al parcial en curso.
resolvePenalty(id: string, success: boolean): void {

  if (!this.match?.penalties) return;

  const penalty = this.match.penalties.find(p => p.id === id);

  if (!penalty || penalty.executed) return;

  penalty.success = success;
  penalty.executed = true;
  penalty.active = false;

  if (success) {

    if (penalty.team === 'red') {

      this.match.currentEndRedScore++;

    } else {

      this.match.currentEndBlueScore++;

    }

  }

  this.notifyChanges();

}

// Elimina una falta todavía pendiente (el árbitro se equivocó al
// marcarla). No se permite borrar una ya ejecutada, porque su
// resultado ya pudo haber sumado un punto al parcial.
removePenalty(id: string): void {

  if (!this.match?.penalties) return;

  this.match.penalties = this.match.penalties.filter(
    p => p.id !== id || p.executed
  );

  this.notifyChanges();

}

// Corrección manual del reloj (ej: el árbitro marcó mal el tiempo).
// El delta puede ser negativo; el tiempo nunca baja de 0.
adjustTime(team: 'red' | 'blue', deltaSeconds: number): void {

  if (!this.match) return;

  if (team === 'red') {

    this.match.redTime = Math.max(0, this.match.redTime + deltaSeconds);

  } else {

    this.match.blueTime = Math.max(0, this.match.blueTime + deltaSeconds);

  }

  this.notifyChanges();

}

// Corrección manual de bochas jugadas (0 a 6).
adjustBalls(team: 'red' | 'blue', delta: number): void {

  if (!this.match) return;

  if (team === 'red') {

    this.match.redBallsPlayed = Math.min(
      6,
      Math.max(0, this.match.redBallsPlayed + delta)
    );

  } else {

    this.match.blueBallsPlayed = Math.min(
      6,
      Math.max(0, this.match.blueBallsPlayed + delta)
    );

  }

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