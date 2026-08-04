import { Component, OnInit } from '@angular/core';
import { Match } from '../models/match.model';
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

    }

  );

}

ngOnDestroy() {

  this.unsubscribe?.();

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