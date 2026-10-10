import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Match, Penalty } from '../../models/match.model';
import { MatchService } from '../../services/match.service';
import { MatchVoiceService } from '../../services/match-voice.service';

// Menú de ajustes del partido en vivo: corregir tiempo, bochas jugadas
// y faltas/penalizaciones, por si el árbitro se equivoca al marcarlas.
@Component({
  selector: 'app-match-settings-modal',
  templateUrl: './match-settings-modal.component.html',
  styleUrls: ['./match-settings-modal.component.scss'],
  standalone: false
})
export class MatchSettingsModalComponent implements OnInit, OnDestroy {

  @Input({ required: true }) match!: Match;

  voiceEnabled = true;

  private refreshInterval: any;

  constructor(
    private matchService: MatchService,
    private matchVoice: MatchVoiceService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {

    this.voiceEnabled = this.matchVoice.isEnabled();

    // El reloj del partido sigue corriendo en la pantalla de fondo
    // mientras este menú está abierto; se refresca seguido para no
    // mostrar tiempo ni bochas desactualizados.
    this.refreshInterval = setInterval(() => {

      const match = this.matchService.getMatch();

      if (match) {
        this.match = match;
      }

    }, 500);

  }

  ngOnDestroy(): void {

    clearInterval(this.refreshInterval);

  }

  // Faltas del parcial actual (pendientes y ya resueltas), para ver el
  // historial y poder corregir una marcada por error.
  get currentEndPenalties(): Penalty[] {

    return (this.match.penalties ?? [])
      .filter(p => p.end === this.match.currentEnd)
      .slice()
      .reverse();

  }

  adjustTime(team: 'red' | 'blue', deltaSeconds: number): void {

    this.matchService.adjustTime(team, deltaSeconds);

    this.match = this.matchService.getMatch()!;

  }

  adjustBalls(team: 'red' | 'blue', delta: number): void {

    this.matchService.adjustBalls(team, delta);

    this.match = this.matchService.getMatch()!;

  }

  // Una falta de un equipo le da el tiro de penalización al contrario
  // (mismo criterio que los botones ⚠ Falta Roja/Azul de la pantalla
  // principal).
  addFault(teamAtFault: 'red' | 'blue'): void {

    const penaltyTeam = teamAtFault === 'red' ? 'blue' : 'red';

    this.matchService.startPenalty(penaltyTeam);

    this.match = this.matchService.getMatch()!;

  }

  removePenalty(id: string): void {

    this.matchService.removePenalty(id);

    this.match = this.matchService.getMatch()!;

  }

  toggleVoice(enabled: boolean): void {

    this.voiceEnabled = enabled;

    this.matchVoice.setEnabled(enabled);

  }

  // Para que el árbitro pueda confirmar al toque que el audio del
  // dispositivo funciona, sin tener que esperar a que el reloj llegue
  // a algún umbral.
  testVoice(): void {

    this.matchVoice.speak('One minute', true);

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

  dismiss(): void {

    this.modalController.dismiss();

  }

}
