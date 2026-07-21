import { Component, OnInit } from '@angular/core';
import { Match } from '../models/match.model';
import { MatchService } from '../services/match.service';

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

  constructor(
    private matchService: MatchService
  ) {}

  ngOnInit() {

    this.loadMatch();

    setInterval(() => {

      this.loadMatch();

    },300);

  }

  private loadMatch(){

    const match=this.matchService.getMatch();

    if(match){

      this.match=match;

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

  this.matchService.updateMatch(this.match);

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

}

}