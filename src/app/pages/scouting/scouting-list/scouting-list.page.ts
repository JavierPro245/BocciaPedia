import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { ScoutingReport } from 'src/app/models/scouting.model';
import { SessionService } from 'src/app/services/session.service';
import { ScoutingService } from 'src/app/services/scouting.service';

@Component({
  selector: 'app-scouting-list',
  templateUrl: './scouting-list.page.html',
  styleUrls: ['./scouting-list.page.scss'],
  standalone: false
})
export class ScoutingListPage implements OnInit {

  search = '';

  reports: ScoutingReport[] = [];

  constructor(
    private router: Router,
    private scoutingService: ScoutingService,
    private sessionService: SessionService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {

    const user = this.sessionService.getUser();

    if (!user) {
      return;
    }

    this.scoutingService.listenReportsByTrainer(user.uid, reports => {

      this.reports = reports.sort((a, b) => {

        const dateA = a.updatedAt
          ? new Date(a.updatedAt).getTime()
          : new Date(a.date).getTime();

        const dateB = b.updatedAt
          ? new Date(b.updatedAt).getTime()
          : new Date(b.date).getTime();

        return dateB - dateA;

      });

    });

  }

  get filteredReports() {

    return this.reports.filter(report =>

      report.opponentName.toLowerCase().includes(this.search.toLowerCase()) ||

      report.opponentCountry.toLowerCase().includes(this.search.toLowerCase())

    );

  }

  newReport() {

    this.scoutingService.clearReport();

    this.router.navigate(['/main/scouting/scouting-create']);

  }

  openReport(report: ScoutingReport) {

    this.scoutingService.setReport(report);

    this.router.navigate(['/main/scouting/scouting-detail']);

  }

  async confirmDelete(report: ScoutingReport) {

    const alert = await this.alertController.create({

      header: 'Eliminar scouting',

      message: `¿Seguro que quieres eliminar el scouting de ${report.opponentName}?`,

      buttons: [

        { text: 'Cancelar', role: 'cancel' },

        {

          text: 'Eliminar',

          role: 'destructive',

          handler: async () => {

            if (!report.id) {
              return;
            }

            await this.scoutingService.deleteReport(report.id);

            const toast = await this.toastController.create({
              message: 'Scouting eliminado.',
              duration: 2000,
              color: 'success'
            });

            await toast.present();

          }

        }

      ]

    });

    await alert.present();

  }

}
