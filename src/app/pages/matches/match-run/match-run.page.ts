import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatchService } from '../services/match.service';
import { Match } from '../models/match.model';
import { MatchRepositoryService } from 'src/app/services/match-repository.service';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { BocciaCast } from 'bocciapedia-cast';

@Component({
  selector: 'app-match-run',
  templateUrl: './match-run.page.html',
  styleUrls: ['./match-run.page.scss'],
  standalone: false
})
export class MatchRunPage implements OnInit {

  match!: Match;

  showPenalty = false;

penaltySeconds = 60;

penaltyInterval: any;

  showRest = false;

  restSeconds = 60;

  private interval?: any;

  private gameTimer?: any;

  constructor(

    private matchService: MatchService,

    private matchRepository: MatchRepositoryService,

    private alertController: AlertController,

    private router: Router,

  

  ){}

  ngOnInit(): void {

    const match = this.matchService.getMatch();

    if(!match){

      this.router.navigate(['/main/matches/match-create']);

      return;

    }

    this.match = match;

    this.startGameClock();

  }

 finishEnd(): void {

  if (this.showRest || this.showPenalty) {
    return;
  }

  // Si existe una penalización pendiente de ejecutar,
  // mostrarla antes de cerrar el END.
  if (this.match.penalty &&
      this.match.penalty.active &&
      !this.match.penalty.executed) {

    this.showPenalty = true;

    this.penaltySeconds = 60;

    this.match.showPenalty = true;

    this.match.penaltySeconds = 60;

    this.syncMatch();

    this.penaltyInterval = setInterval(() => {

  this.penaltySeconds--;

  // Variable local
  this.match.penaltySeconds = this.penaltySeconds;

  // Variable del objeto penalty
  if (this.match.penalty) {

    this.match.penalty.timeRemaining = this.penaltySeconds;

  }

  this.syncMatch();

  if (this.penaltySeconds <= 0) {

    clearInterval(this.penaltyInterval);

  }

}, 1000);

    return;

  }

  // Si la penalización ya fue ejecutada y logró el punto,
  // agregarlo al parcial antes de confirmar el END.
  if (this.match.penalty?.executed &&
      this.match.penalty.success) {

    if (this.match.penalty.team === 'red') {

      this.match.currentEndRedScore++;

    } else {

      this.match.currentEndBlueScore++;

    }

  }

  this.matchService.confirmEnd();

  // Ya no se necesita la penalización
  this.match.penalty = null;

  this.match = this.matchService.getMatch()!;

  // ¿Terminó el partido?
  if (this.match.currentEnd >= this.match.totalEnds) {

    if (this.match.redScore === this.match.blueScore) {

      this.match.isTieBreak = true;

      this.match.currentEnd++;

      this.match.redBallsPlayed = 0;
      this.match.blueBallsPlayed = 0;

      this.match.redTime = this.match.secondsPerPlayer;
      this.match.blueTime = this.match.secondsPerPlayer;

      this.match.currentEndRedScore = 0;
      this.match.currentEndBlueScore = 0;

      this.matchService.updateMatch(this.match);

      this.syncMatch();

      return;

    }

    this.match.state = 'finished';

    this.matchService.updateMatch(this.match);
    this.syncMatch();
    return;

  }

  this.startRestCountdown();

}
  async addRedPoint(): Promise<void> {

  if (this.match.isTieBreak) {
    return;
  }

  this.matchService.addPoint('red');

  this.match = this.matchService.getMatch()!;

  await this.syncMatch();

}

async addBluePoint(): Promise<void> {

  if (this.match.isTieBreak) {
    return;
  }

  this.matchService.addPoint('blue');

  this.match = this.matchService.getMatch()!;

  await this.syncMatch();

}

removeRedPoint(): void {

  this.matchService.removePoint('red');

  this.match = this.matchService.getMatch()!;

}

removeBluePoint(): void {

  this.matchService.removePoint('blue');

  this.match = this.matchService.getMatch()!;

}

  formatTime(seconds: number): string {

  const minutes = Math.floor(seconds / 60);

  const secs = seconds % 60;

  return (
    minutes.toString().padStart(2, '0') +
    ':' +
    secs.toString().padStart(2, '0')
  );

}

startRedTimer(): void {

  this.matchService.useTurn('red');

  this.matchService.startRedTimer();

  this.match = this.matchService.getMatch()!;

}

startBlueTimer(): void {

  this.matchService.useTurn('blue');

  this.matchService.startBlueTimer();

  this.match = this.matchService.getMatch()!;

}

pauseTimers(): void {

  this.matchService.pauseTimers();

  this.match = this.matchService.getMatch()!;

}

private startGameClock(): void {

  this.gameTimer = setInterval(() => {

    if (!this.match.timerRunning) {
      return;
    }

    let changed = false;

    if (
      this.match.turn === 'red' &&
      this.match.redTime > 0
    ) {

      this.match.redTime--;

      changed = true;

    }

    if (
      this.match.turn === 'blue' &&
      this.match.blueTime > 0
    ) {

      this.match.blueTime--;

      changed = true;

    }

    if (changed) {

      this.matchService.updateMatch(this.match);

      this.syncMatch();

    }

  },1000);

}

get winner(): 'red' | 'blue' | 'tie' {

  // Si terminó un Tie Break,
  // ese define el ganador.

  if (this.match.isTieBreak && this.match.tieBreakWinner) {

    return this.match.tieBreakWinner;

  }

  if (this.match.redScore > this.match.blueScore) {

    return 'red';

  }

  if (this.match.blueScore > this.match.redScore) {

    return 'blue';

  }

  return 'tie';

}

async finishTieBreak(winner:'red'|'blue'): Promise<void> {

  this.match.tieBreakWinner = winner;

  this.match.state = 'finished';

  this.match.timerRunning = false;

  this.match.turn = null;

  this.matchService.updateMatch(this.match);

  await this.syncMatch()

  // Recargar el partido para refrescar la vista
  this.match = this.matchService.getMatch()!;

}

assignPenalty(team: 'red' | 'blue') {

  console.log('Botón presionado:', team);

  this.matchService.startPenalty(team);

  this.match = this.matchService.getMatch()!;

  console.log(this.match);

}

finishPenalty(success: boolean) {

    clearInterval(this.penaltyInterval);

    this.match.penalty!.success = success;

    this.match.penalty!.executed = true;

    this.showPenalty = false;

    this.match.showPenalty = false;

    this.match.penaltySeconds = 0;

    this.syncMatch();

}
async startRestCountdown() {

  this.showRest = true;

  this.restSeconds = 60;

  this.match.showRest = true;
  this.match.restSeconds = 60;

  await this.syncMatch();

  this.interval = setInterval(() => {

    this.restSeconds--;

    this.match.restSeconds = this.restSeconds;

    this.syncMatch();

    if (this.restSeconds <= 0) {

      clearInterval(this.interval);

      // Ocultar descanso
      this.showRest = false;

      this.match.showRest = false;
      this.match.restSeconds = 0;

      // Pasar al siguiente END
      this.matchService.nextEnd();

      this.match = this.matchService.getMatch()!;

      // Asegurar que el Broadcast reciba el cambio
      this.syncMatch();

    }

  }, 1000);

}

newMatch(){

    this.matchService.clear();

    this.router.navigate(['/matches/create']);

}

goHome(){

    this.matchService.clear();

    this.router.navigate(['/main/home']);

}

async openBroadcast() {

  try {

    console.log("ANTES");

    await BocciaCast.initialize();

    console.log("DESPUÉS");

  } catch (e: any) {

    console.error(e);

    const error = await this.alertController.create({
      header: 'ERROR',
      message: JSON.stringify(e),
      buttons: ['OK']
    });

    await error.present();

  }

}

private async syncMatch() {

  if (!this.match.id) {
    return;
  }

  try {

    await this.matchRepository.updateMatch(
      this.match.id,
      this.match
    );

  } catch (error) {

    console.error(
      'Error sincronizando partido:',
      error
    );

  }

}


}