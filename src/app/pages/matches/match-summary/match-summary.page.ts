import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { Match, Penalty } from '../models/match.model';
import { EndResult } from '../models/end-result.model';
import { MatchService } from '../services/match.service';
import { MatchPdfService } from 'src/app/services/match-pdf.service';
import { MatchRepositoryService } from 'src/app/services/match-repository.service';

@Component({
  selector: 'app-match-summary',
  templateUrl: './match-summary.page.html',
  styleUrls: ['./match-summary.page.scss'],
  standalone: false
})
export class MatchSummaryPage implements OnInit {

  match: Match | null = null;

  generatingReport = false;

  constructor(
    private matchService: MatchService,
    private matchPdfService: MatchPdfService,
    private matchRepository: MatchRepositoryService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {

    this.match = this.matchService.getMatch() ?? null;

    if (!this.match) {
      this.router.navigate(['/main/home']);
    }

  }

  get winner(): 'red' | 'blue' | 'tie' {

    if (!this.match) {
      return 'tie';
    }

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

  // Faltas marcadas en un parcial puntual, para mostrarlas junto a su fila.
  faultsFor(end: EndResult): Penalty[] {

    return this.match?.penalties?.filter(p => p.end === end.end) ?? [];

  }

  // Totales para la fila de resumen al pie de la tabla.
  get totalRedTime(): number {

    return (this.match?.ends ?? []).reduce((sum, e) => sum + (e.redTimeUsed ?? 0), 0);

  }

  get totalBlueTime(): number {

    return (this.match?.ends ?? []).reduce((sum, e) => sum + (e.blueTimeUsed ?? 0), 0);

  }

  get totalFaults(): number {

    return this.match?.penalties?.length ?? 0;

  }

  formatTime(seconds: number): string {

    const s = Math.max(0, Math.round(seconds ?? 0));

    const minutes = Math.floor(s / 60);

    const secs = s % 60;

    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  }

  // Antes de generar el PDF, se le pide al árbitro/entrenador que
  // confirme que el resumen está correcto (el pedido explícito de
  // "aprobar que todo esté bien"), y que elija si además de
  // descargarlo quiere guardarlo junto con el partido para poder
  // volver a abrirlo después, o si prefiere solo descargarlo ahora.
  async confirmAndGenerateReport(): Promise<void> {

    if (!this.match || this.generatingReport) {
      return;
    }

    const alert = await this.alertController.create({

      header: 'Generar informe',

      message: '¿Confirmas que el resumen del partido (puntos, tiempo y faltas de cada parcial) es correcto?',

      buttons: [
        {
          text: 'Revisar de nuevo',
          role: 'cancel'
        },
        {
          text: 'Solo descargar',
          handler: () => this.generateReport(false)
        },
        {
          text: 'Guardar con informe',
          handler: () => this.generateReport(true)
        }
      ]

    });

    await alert.present();

  }

  private async generateReport(saveToMatch: boolean): Promise<void> {

    if (!this.match) return;

    this.generatingReport = true;

    try {

      if (saveToMatch) {

        const reportUrl = await this.matchPdfService.generateAndSave(this.match);

        this.match.reportUrl = reportUrl;
        this.match.reportGeneratedAt = Date.now();

        if (this.match.id) {

          await this.matchRepository.updateMatch(this.match.id, this.match);

        }

        this.matchService.updateMatch(this.match);

      } else {

        await this.matchPdfService.generatePdf(this.match);

      }

      const toast = await this.toastController.create({

        message: saveToMatch
          ? 'Informe generado, descargado y guardado con el partido.'
          : 'Informe generado correctamente.',

        duration: 2800,

        color: 'success'

      });

      await toast.present();

    } catch (error) {

      console.error('Error generando el informe del partido:', error);

      const toast = await this.toastController.create({
        message: 'No se pudo generar el informe. Intenta nuevamente.',
        duration: 3000,
        color: 'danger'
      });

      await toast.present();

    } finally {

      this.generatingReport = false;

    }

  }

  newMatch(): void {

    this.matchService.clear();

    this.router.navigate(['/main/matches/match-create']);

  }

  goHome(): void {

    this.matchService.clear();

    this.router.navigate(['/main/home']);

  }

}
