import { Component, OnInit } from '@angular/core';
import { Evaluation } from 'src/app/models/evaluation.model';
import { SessionService } from 'src/app/services/session.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { EvaluationPdfService } from 'src/app/services/evaluation-pdf.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false
})
export class ReportsPage implements OnInit {

  search = '';

  evaluations: Evaluation[] = [];

  generatingId: string | null = null;

  constructor(

    private sessionService: SessionService,

    private evaluationService: EvaluationService,

    private evaluationPdfService: EvaluationPdfService,

    private toastController: ToastController

  ) {}

  ngOnInit(): void {

    const user = this.sessionService.getUser();

    if (!user) {
      return;
    }

    const callback = (evaluations: Evaluation[]) => {

      this.evaluations = evaluations.sort((a, b) => {

        const dateA = a.updatedAt
          ? new Date(a.updatedAt).getTime()
          : new Date(a.date).getTime();

        const dateB = b.updatedAt
          ? new Date(b.updatedAt).getTime()
          : new Date(b.date).getTime();

        return dateB - dateA;

      });

    };

    if (user.roles.includes('trainer')) {

      this.evaluationService.listenEvaluationsByTrainer(user.uid, callback);

    } else if (user.roles.includes('athlete') && user.athleteId) {

      this.evaluationService.listenEvaluationsByAthlete(user.athleteId, callback);

    }

  }

  get filteredEvaluations(): Evaluation[] {

    const term = this.search.toLowerCase();

    return this.evaluations.filter(evaluation =>

      evaluation.athleteName?.toLowerCase().includes(term) ||
      evaluation.evaluationType?.toLowerCase().includes(term)

    );

  }

  async downloadPdf(evaluation: Evaluation): Promise<void> {

    if (!evaluation.id) {
      return;
    }

    this.generatingId = evaluation.id;

    try {

      await this.evaluationPdfService.generatePdf(evaluation);

    } catch (error) {

      console.error('Error generando PDF:', error);

      const toast = await this.toastController.create({

        message: 'No se pudo generar el PDF de esta evaluación.',

        duration: 2500,

        color: 'danger'

      });

      await toast.present();

    } finally {

      this.generatingId = null;

    }

  }

}
