import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ScoutingReport } from 'src/app/models/scouting.model';
import { ScoutingService } from 'src/app/services/scouting.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-scouting-create',
  templateUrl: './scouting-create.page.html',
  styleUrls: ['./scouting-create.page.scss'],
  standalone: false
})
export class ScoutingCreatePage implements OnInit {

  // Texto libre (no un selector del listado de deportistas del
  // entrenador): el scouting puede ser de un partido entre dos
  // jugadores que no tienen ninguna relación con el entrenador.
  athleteName = '';

  opponentName = '';

  opponentCountry = '';

  category = '';

  notes = '';

  ownColor: 'red' | 'blue' = 'red';

  editingReport: ScoutingReport | null = null;

  saving = false;

  constructor(
    private router: Router,
    private scoutingService: ScoutingService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {

    this.editingReport = this.scoutingService.getReport();

    if (this.editingReport) {

      this.athleteName = this.editingReport.athleteName ?? '';

      this.opponentName = this.editingReport.opponentName;

      this.opponentCountry = this.editingReport.opponentCountry;

      this.category = this.editingReport.category ?? '';

      this.notes = this.editingReport.notes ?? '';

      this.ownColor = this.editingReport.ownColor ?? 'red';

    }

  }

  async save() {

    if (!this.opponentName.trim() || !this.athleteName.trim() || this.saving) {
      return;
    }

    const user = this.sessionService.getUser();

    if (!user) {
      return;
    }

    this.saving = true;

    try {

      // Nota: Firestore rechaza valores "undefined" en addDoc/updateDoc
      // (no está habilitado ignoreUndefinedProperties), por eso los
      // campos opcionales usan '' en vez de undefined como respaldo.
      if (this.editingReport?.id) {

        const fields: Partial<ScoutingReport> = {
          athleteName: this.athleteName.trim(),
          ownColor: this.ownColor,
          opponentName: this.opponentName.trim(),
          opponentCountry: this.opponentCountry.trim(),
          category: this.category.trim(),
          notes: this.notes.trim()
        };

        await this.scoutingService.updateReportFields(this.editingReport.id, fields);

        this.scoutingService.setReport({
          ...this.editingReport,
          ...fields
        });

      } else {

        const report: ScoutingReport = {

          trainerId: user.uid,

          athleteName: this.athleteName.trim(),

          ownColor: this.ownColor,

          opponentName: this.opponentName.trim(),

          opponentCountry: this.opponentCountry.trim(),

          category: this.category.trim(),

          notes: this.notes.trim(),

          plays: [],

          date: new Date()

        };

        const id = await this.scoutingService.createReport(report);

        this.scoutingService.setReport({ id, ...report });

      }

      this.router.navigate(['/main/scouting/scouting-detail']);

    } catch (error) {

      console.error('Error guardando scouting:', error);

    } finally {

      this.saving = false;

    }

  }

}
