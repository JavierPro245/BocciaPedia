import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { MatchService } from '../services/match.service';

import { OnInit } from '@angular/core';
import { AthleteService } from 'src/app/services/athlete.service';
import { SessionService } from 'src/app/services/session.service';
import { Athlete } from 'src/app/models/athlete.model';

import { MatchRepositoryService } from 'src/app/services/match-repository.service';

import { Match } from '../models/match.model';

@Component({

selector:'app-match-create',

templateUrl:'./match-create.page.html',

styleUrls:['./match-create.page.scss'],

standalone:false

})

export class MatchCreatePage implements OnInit {

players: any[] = [];

redPlayer = '';

bluePlayer = '';

manualRedPlayer = '';
manualBluePlayer = '';

category = 'BC2';

totalEnds = 4;

// Tiempo editable por el usuario (en minutos)
minutes = 3.5;

// Tiempo en segundos que se enviará al partido
secondsPerPlayer = 360;

constructor(

  private service: MatchService,

  private repository: MatchRepositoryService,

  private router: Router,

  private athleteService: AthleteService,

  private sessionService: SessionService

){}

ngOnInit() {

  this.sessionService.currentUser$
    .subscribe(user => {

      if (!user) {
        return;
      }

      this.athleteService.listenAthletesByTrainer(

        user.uid,

        athletes => {

          this.players = athletes;

        }

      );

    });

}
get playersAreValid(): boolean {

  const redValid =
    this.redPlayer === 'manual'
      ? this.manualRedPlayer.trim().length > 0
      : !!this.redPlayer;

  const blueValid =
    this.bluePlayer === 'manual'
      ? this.manualBluePlayer.trim().length > 0
      : !!this.bluePlayer;

  if (!redValid || !blueValid) {
    return false;
  }

  const redName =
    this.redPlayer === 'manual'
      ? this.manualRedPlayer.trim().toLowerCase()
      : this.redPlayer;

  const blueName =
    this.bluePlayer === 'manual'
      ? this.manualBluePlayer.trim().toLowerCase()
      : this.bluePlayer;

  return redName !== blueName;

}

get playersAreEqual(): boolean {

  if (!this.playersAreValid) {

    const redName =
      this.redPlayer === 'manual'
        ? this.manualRedPlayer.trim().toLowerCase()
        : this.redPlayer;

    const blueName =
      this.bluePlayer === 'manual'
        ? this.manualBluePlayer.trim().toLowerCase()
        : this.bluePlayer;

    return !!redName &&
           !!blueName &&
           redName === blueName;

  }

  return false;

}

categoryChanged(): void {

  switch (this.category) {

    case 'BC1':
      this.minutes = 4.5;
      break;

    case 'BC2':
      this.minutes = 3.5;
      break;

    case 'BC3':
      this.minutes = 6;
      break;

    case 'BC4':
      this.minutes = 3.5;
      break;

  }

  this.secondsPerPlayer = Math.round(this.minutes * 60);

}

async startMatch() {

  this.secondsPerPlayer = Math.round(this.minutes * 60);

  let redId = '';
  let redName = '';

  let blueId = '';
  let blueName = '';

  // ==========================
  // Jugador rojo
  // ==========================

  if (this.redPlayer === 'manual') {

    redName = this.manualRedPlayer.trim();

  } else {

    const red = this.players.find(
      x => x.id === this.redPlayer
    );

    if (!red) {
      return;
    }

    redId = red.id!;
    redName = red.fullName;

  }

  // ==========================
  // Jugador azul
  // ==========================

  if (this.bluePlayer === 'manual') {

    blueName = this.manualBluePlayer.trim();

  } else {

    const blue = this.players.find(
      x => x.id === this.bluePlayer
    );

    if (!blue) {
      return;
    }

    blueId = blue.id!;
    blueName = blue.fullName;

  }

  // ==========================
  // Crear objeto Match
  // ==========================

  const match: Match = {

    id: '',

    redPlayerId: redId,

    redPlayer: redName,

    bluePlayerId: blueId,

    bluePlayer: blueName,

    category: this.category as any,

    totalEnds: this.totalEnds,

    currentEnd: 1,

    secondsPerPlayer: this.secondsPerPlayer,

    redTime: this.secondsPerPlayer,

    blueTime: this.secondsPerPlayer,

    redScore: 0,

    blueScore: 0,

    currentEndRedScore: 0,

    currentEndBlueScore: 0,

    redBallsPlayed: 0,

    blueBallsPlayed: 0,

    startingColor: 'red',

    jackPlayed: false,

    turn: null,

    timerRunning: false,

    isTieBreak: false,

    tieBreakWinner: null,

    ends: [],

    penalty: null,

    showRest:false,

restSeconds:0,

showPenalty:false,

penaltySeconds:0,

broadcastState:'playing',

    state: 'waiting'

  };

  // ==========================
  // Guardar en Firestore
  // ==========================

  try {

    const matchId =
      await this.repository.createMatch(match);

    match.id = matchId;

  } catch (error) {

    console.error(
      'Error creando partido:',
      error
    );

    return;

  }

  // ==========================
  // Guardar en memoria
  // ==========================

  this.service.createMatch(match);

  // ==========================
  // Ir al partido
  // ==========================

  this.router.navigate([
    '/matches/match-run'
  ]);

}

}

