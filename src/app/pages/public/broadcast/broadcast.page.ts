import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Match, Penalty } from '../../matches/models/match.model';
import { MatchRepositoryService } from 'src/app/services/match-repository.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.page.html',
  styleUrls: ['./broadcast.page.scss'],
  standalone: false
})
export class BroadcastPage implements OnInit, OnDestroy {

  match!: Match;

  showPenalty = false;

  penaltySeconds = 60;

  showRest = false;

  restSeconds = 60;

  private unsubscribe?: () => void;

  matchId = '';

  constructor(

    private repository: MatchRepositoryService,

    private route: ActivatedRoute

  ) {}

  ngOnInit() {

    this.matchId =
      this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.matchId) {

      console.error('No se recibió el ID');

      return;

    }

    this.unsubscribe = this.repository.listenMatch(

  this.matchId,

  match => {

    console.log('========================');
    console.log('MATCH RECIBIDO');
    console.log(match);

    if (!match) {

      console.error('No existe el documento en Firestore');

      return;

    }

    this.match = match;

    // match.showRest/showPenalty son los que de verdad reflejan lo
    // que está pasando en match-run; se reflejan acá para que el
    // overlay de descanso/penalización también se vea en esta vista.
    this.showRest = match.showRest;
    this.restSeconds = match.restSeconds;

    this.showPenalty = match.showPenalty;
    this.penaltySeconds = match.penaltySeconds;

    console.log('Partido cargado correctamente');

  }

);

  }

  ngOnDestroy() {

    this.unsubscribe?.();

  }

  // Faltas pendientes de ejecutar (puede haber más de una por parcial).
  get pendingPenalties(): Penalty[] {

    return this.match?.penalties?.filter(
      p => p.active && !p.executed
    ) ?? [];

  }

  // La que se está mostrando en el overlay de penalización ahora mismo.
  get currentPenalty(): Penalty | undefined {

    return this.pendingPenalties[0];

  }

  get genderLabel(): string {

    switch (this.match?.gender) {

      case 'male': return 'MASCULINO';

      case 'female': return 'FEMENINO';

      default: return 'MIXTO';

    }

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

  get winner(): 'red' | 'blue' | 'tie' {

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

}