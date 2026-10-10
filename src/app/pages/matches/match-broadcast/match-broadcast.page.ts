import { Component, OnInit } from '@angular/core';
import { Match, Penalty } from '../models/match.model';
import { ActivatedRoute } from '@angular/router';
import { MatchRepositoryService } from 'src/app/services/match-repository.service';

@Component({
  selector: 'app-match-broadcast',
  templateUrl: './match-broadcast.page.html',
  styleUrls: ['./match-broadcast.page.scss'],
  standalone: false
})
export class MatchBroadcastPage implements OnInit {

  match!: Match;

  showPenalty = false;

penaltySeconds = 60;

penaltyInterval: any;

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

    console.error('No se recibió el ID del partido');

    return;

  }

  this.unsubscribe = this.repository.listenMatch(

    this.matchId,

    match => {

      if (!match) {
        return;
      }

      this.match = match;

      // match.showRest/showPenalty son los que de verdad reflejan lo
      // que está pasando en match-run; se reflejan acá para que el
      // overlay de descanso/penalización también se vea en la TV.
      this.showRest = match.showRest;
      this.restSeconds = match.restSeconds;

      this.showPenalty = match.showPenalty;
      this.penaltySeconds = match.penaltySeconds;

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

finishTieBreak(winner:'red'|'blue'): void {

  this.match.tieBreakWinner = winner;

  this.match.state = 'finished';

  this.match.timerRunning = false;

  this.match.turn = null;

  this.repository.updateMatch(
  this.match.id,
  this.match
);

}

}