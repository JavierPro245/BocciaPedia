import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage } from '../firebase.config';
import { Match, Penalty } from '../pages/matches/models/match.model';
import { EndResult } from '../pages/matches/models/end-result.model';

const BRAND_COLOR: [number, number, number] = [33, 90, 179];
const RED_COLOR: [number, number, number] = [229, 57, 53];
const BLUE_COLOR: [number, number, number] = [30, 136, 229];
const GREEN_COLOR: [number, number, number] = [46, 125, 50];

// Informe descargable del partido: resumen final + detalle de cada
// parcial (puntos, tiempo usado por cada lado y faltas marcadas).
@Injectable({
  providedIn: 'root'
})
export class MatchPdfService {

  // "Solo descargar informe": arma el PDF y lo entrega local (descarga
  // en el navegador, o comparte/guarda en la app nativa), sin tocar
  // Storage ni el documento del partido en Firestore.
  async generatePdf(match: Match): Promise<void> {

    const doc = this.buildDocument(match);

    await this.deliverLocally(doc, match);

  }

  // "Guardar partido con informe": además de entregarlo local, sube el
  // mismo PDF a Storage y devuelve la URL para guardarla en el
  // partido (así se puede volver a abrir después, no solo en el
  // momento).
  async generateAndSave(match: Match): Promise<string> {

    const doc = this.buildDocument(match);

    const blob = doc.output('blob');

    const fileName = this.buildFileName(match);

    const storageRef = ref(storage, `match-reports/${match.id || Date.now()}_${fileName}`);

    await uploadBytes(storageRef, blob, { contentType: 'application/pdf' });

    const url = await getDownloadURL(storageRef);

    await this.deliverLocally(doc, match);

    return url;

  }

  private buildDocument(match: Match): jsPDF {

    const doc = new jsPDF();

    let y = this.drawHeader(doc, match);

    y = this.drawFinalScore(doc, match, y);

    y = this.drawEndsTable(doc, match, y);

    this.drawFaultsSummary(doc, match, y);

    return doc;

  }

  private buildFileName(match: Match): string {

    return `partido-${this.slug(match.redPlayer)}-vs-${this.slug(match.bluePlayer)}-${match.id || Date.now()}.pdf`;

  }

  // En navegador, doc.save() descarga directo. En la app nativa
  // (Android/iOS) el WebView no maneja esa descarga automática de
  // archivos, así que en vez de eso se guarda en el almacenamiento
  // de la app y se abre la hoja nativa de "Compartir/Guardar en".
  private async deliverLocally(doc: jsPDF, match: Match): Promise<void> {

    const fileName = this.buildFileName(match);

    if (Capacitor.isNativePlatform()) {

      const base64 = doc.output('datauristring').split(',')[1];

      const written = await Filesystem.writeFile({

        path: fileName,

        data: base64,

        directory: Directory.Cache

      });

      await Share.share({

        title: fileName,

        url: written.uri

      });

      return;

    }

    doc.save(fileName);

  }

  private slug(value: string): string {

    return (value || 'jugador')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  }

  private formatTime(seconds: number): string {

    const s = Math.max(0, Math.round(seconds));

    const minutes = Math.floor(s / 60);

    const secs = s % 60;

    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  }

  private drawHeader(doc: jsPDF, match: Match): number {

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(...BRAND_COLOR);

    doc.rect(0, 0, pageWidth, 34, 'F');

    doc.setFontSize(18);

    doc.setTextColor(255, 255, 255);

    doc.text('Informe de partido', 14, 16);

    doc.setFontSize(11);

    doc.setTextColor(225, 232, 245);

    doc.text(
      `${match.redPlayer}  vs  ${match.bluePlayer}  ·  Categoría ${match.category}`,
      14,
      24
    );

    doc.setTextColor(0);

    const now = new Date();

    doc.setFontSize(9);

    doc.setTextColor(120, 120, 120);

    doc.text(
      `Generado el ${now.toLocaleDateString('es-CL')} ${now.toLocaleTimeString('es-CL')}`,
      14,
      42
    );

    doc.setTextColor(0);

    return 50;

  }

  private drawFinalScore(doc: jsPDF, match: Match, startY: number): number {

    let y = startY;

    const winner: 'red' | 'blue' | 'tie' =
      match.isTieBreak && match.tieBreakWinner
        ? match.tieBreakWinner
        : match.redScore > match.blueScore
          ? 'red'
          : match.blueScore > match.redScore
            ? 'blue'
            : 'tie';

    doc.setFontSize(13);

    doc.setTextColor(...RED_COLOR);

    doc.text(`${match.redPlayer}: ${match.redScore}`, 14, y);

    doc.setTextColor(...BLUE_COLOR);

    doc.text(`${match.bluePlayer}: ${match.blueScore}`, 110, y);

    y += 9;

    doc.setFontSize(11);

    doc.setTextColor(60, 60, 60);

    const winnerLabel =
      winner === 'tie'
        ? 'Empate'
        : `Ganador: ${winner === 'red' ? match.redPlayer : match.bluePlayer}`;

    doc.text(winnerLabel, 14, y);

    if (match.isTieBreak) {

      doc.text('(definido por Tie Break)', 90, y);

    }

    doc.setTextColor(0);

    return y + 10;

  }

  private drawEndsTable(doc: jsPDF, match: Match, startY: number): number {

    const ends: EndResult[] = match.ends ?? [];

    if (!ends.length) {

      doc.setFontSize(10.5);

      doc.setTextColor(120, 120, 120);

      doc.text('Este partido no registró parciales.', 14, startY);

      doc.setTextColor(0);

      return startY + 10;

    }

    const body = ends.map(end => {

      const faults = (match.penalties ?? []).filter(p => p.end === end.end);

      return [
        String(end.end),
        String(end.redScore),
        String(end.blueScore),
        this.formatTime(end.redTimeUsed ?? 0),
        this.formatTime(end.blueTimeUsed ?? 0),
        faults.length ? this.describeFaults(faults) : 'Sin faltas'
      ];

    });

    autoTable(doc, {

      startY,

      head: [[
        'END',
        `Rojo (${match.redPlayer})`,
        `Azul (${match.bluePlayer})`,
        'Tiempo rojo',
        'Tiempo azul',
        'Faltas'
      ]],

      body,

      headStyles: {
        fillColor: BRAND_COLOR,
        textColor: 255,
        fontSize: 9
      },

      bodyStyles: {
        fontSize: 9
      },

      columnStyles: {
        0: { cellWidth: 14, halign: 'center' },
        1: { cellWidth: 26, halign: 'center' },
        2: { cellWidth: 26, halign: 'center' },
        3: { cellWidth: 24, halign: 'center' },
        4: { cellWidth: 24, halign: 'center' },
        5: { cellWidth: 'auto' }
      },

      theme: 'striped'

    });

    return (doc as any).lastAutoTable.finalY + 10;

  }

  private describeFaults(faults: Penalty[]): string {

    return faults
      .map(p => {

        const team = p.team === 'red' ? 'Roja' : 'Azul';

        const status = !p.executed
          ? 'pendiente'
          : p.success
            ? 'lograda'
            : 'no lograda';

        return `${team} (${status})`;

      })
      .join('\n');

  }

  private drawFaultsSummary(doc: jsPDF, match: Match, startY: number): void {

    const penalties = match.penalties ?? [];

    doc.setFontSize(11);

    doc.setTextColor(60, 60, 60);

    doc.text(
      `Total de faltas/penalizaciones del partido: ${penalties.length}`,
      14,
      startY
    );

    doc.setTextColor(0);

    if (!penalties.length) {
      return;
    }

    const achieved = penalties.filter(p => p.executed && p.success).length;

    doc.setFontSize(9.5);

    doc.setTextColor(...GREEN_COLOR);

    doc.text(
      `${achieved} de ${penalties.length} bochas de penalización logradas.`,
      14,
      startY + 7
    );

    doc.setTextColor(0);

  }

}
