import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Evaluation } from '../models/evaluation.model';
import { Throw } from '../pages/evaluations/models/throw.model';
import { StatisticsService } from './statistics';
import { pixelDistanceToMeters, formatCourtDistance } from '../pages/evaluations/engine/physics/court-scale';

type ResultKey = 'excellent' | 'good' | 'regular' | 'bad';

const RESULT_COLORS: Record<ResultKey, [number, number, number]> = {
  excellent: [45, 211, 111],
  good: [56, 128, 255],
  regular: [255, 196, 9],
  bad: [235, 68, 90]
};

const RESULT_LABELS: Record<ResultKey, string> = {
  excellent: 'Excelente',
  good: 'Buena',
  regular: 'Regular',
  bad: 'Baja'
};

const BALL_COLORS: Record<'red' | 'blue', [number, number, number]> = {
  red: [229, 57, 53],
  blue: [30, 136, 229]
};

const BRAND_COLOR: [number, number, number] = [33, 90, 179];

// Mismas proporciones/coordenadas que CourtEngineComponent (canvas
// interno 600x1200), para que el mapa del PDF se vea igual que la
// cancha real de la app en vez de un rectángulo genérico.
const COURT = {
  x: 50,
  y: 40,
  width: 500,
  height: 1000,
  boxesHeight: 240,
  targetSize: 100,
  // Punta de la V a 1,5 m de la línea de tiro (frente de las casas)
  // — ver court-scale.ts.
  vY: 566
};

const COURT_SOURCE_WIDTH = 600;
const COURT_SOURCE_HEIGHT = 1200;

@Injectable({
  providedIn: 'root'
})
export class EvaluationPdfService {

  constructor(private statisticsService: StatisticsService) {}

  async generatePdf(evaluation: Evaluation): Promise<void> {

    const doc = new jsPDF();

    let y = this.drawHeader(doc, evaluation, 0);

    y = this.drawStatisticsChart(doc, evaluation, y);

    y = this.drawHeatmap(doc, evaluation, y);

    this.drawThrowCards(doc, evaluation, y);

    const athleteSlug = (evaluation.athleteName || 'deportista')
      .trim()
      .replace(/\s+/g, '-');

    const fileName = `evaluacion-${athleteSlug}-${evaluation.id ?? Date.now()}.pdf`;

    // En navegador, doc.save() descarga directo. En la app nativa
    // (Android/iOS) el WebView no maneja esa descarga automática de
    // archivos, así que en vez de eso se guarda en el almacenamiento
    // de la app y se abre la hoja nativa de "Compartir/Guardar en".
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

  private drawHeader(doc: jsPDF, evaluation: Evaluation, startY: number): number {

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(...BRAND_COLOR);

    doc.rect(0, 0, pageWidth, 34, 'F');

    doc.setFontSize(18);

    doc.setTextColor(255, 255, 255);

    doc.text(evaluation.title || 'Evaluación', 14, 16);

    doc.setFontSize(11);

    doc.setTextColor(225, 232, 245);

    doc.text(
      `${evaluation.athleteName} · ${evaluation.evaluationType}`,
      14,
      24
    );

    let y = 44;

    const date = evaluation.date instanceof Date
      ? evaluation.date
      : new Date(evaluation.date as unknown as string);

    const lines = [
      `Categoría: ${evaluation.category ?? '-'}`,
      `Distancia: ${evaluation.distance} m`,
      `Fecha: ${isNaN(date.getTime()) ? '-' : date.toLocaleDateString('es-CL')}`,
      `Lanzamientos registrados: ${(evaluation.throwList ?? []).length} de ${evaluation.throws}`
    ];

    doc.setFontSize(10.5);

    doc.setTextColor(70, 70, 70);

    lines.forEach(line => {

      doc.text(line, 14, y);

      y += 6;

    });

    doc.setTextColor(0);

    return y + 4;

  }

  private drawStatisticsChart(doc: jsPDF, evaluation: Evaluation, startY: number): number {

    const throws = evaluation.throwList ?? [];

    if (!throws.length) {
      return startY;
    }

    // Se calcula en el momento desde los lanzamientos reales — el
    // campo evaluation.statistics no se mantiene actualizado durante
    // la evaluación, así que no es confiable como fuente.
    const stats = this.statisticsService.getGeneralStatistics([evaluation]);

    doc.setFontSize(13);

    doc.setTextColor(30, 30, 30);

    doc.text('Resumen de resultados', 14, startY);

    const chartX = 14;

    const labelWidth = 24;

    const barMaxWidth = 120;

    const barHeight = 6.5;

    const rowGap = 4.5;

    let y = startY + 9;

    const rows: Array<{ key: ResultKey; value: number }> = [
      { key: 'excellent', value: stats.excellent },
      { key: 'good', value: stats.good },
      { key: 'regular', value: stats.regular },
      { key: 'bad', value: stats.bad }
    ];

    const maxValue = Math.max(1, stats.excellent, stats.good, stats.regular, stats.bad);

    rows.forEach(row => {

      doc.setFontSize(9.5);

      doc.setTextColor(80, 80, 80);

      doc.text(RESULT_LABELS[row.key], chartX, y + barHeight - 1.6);

      // Track de fondo
      doc.setFillColor(232, 232, 232);

      doc.roundedRect(chartX + labelWidth, y, barMaxWidth, barHeight, 1.6, 1.6, 'F');

      const width = Math.max((row.value / maxValue) * barMaxWidth, row.value > 0 ? 3 : 0);

      if (width > 0) {

        doc.setFillColor(...RESULT_COLORS[row.key]);

        doc.roundedRect(chartX + labelWidth, y, width, barHeight, 1.6, 1.6, 'F');

      }

      doc.setFontSize(10);

      doc.setTextColor(30, 30, 30);

      doc.text(
        String(row.value),
        chartX + labelWidth + barMaxWidth + 5,
        y + barHeight - 1.6
      );

      y += barHeight + rowGap;

    });

    doc.setFontSize(9);

    doc.setTextColor(130, 130, 130);

    doc.text(
      `${stats.total} lanzamientos evaluados`,
      chartX,
      y + 1
    );

    doc.setTextColor(0);

    return y + 9;

  }

  private drawHeatmap(doc: jsPDF, evaluation: Evaluation, startY: number): number {

    const throws = evaluation.throwList ?? [];

    if (!throws.length) {
      return startY;
    }

    doc.setFontSize(13);

    doc.setTextColor(30, 30, 30);

    doc.text('Mapa de lanzamientos', 14, startY);

    const canvas = this.renderHeatmapCanvas(throws, COURT_SOURCE_WIDTH, COURT_SOURCE_HEIGHT);

    const pdfWidth = 70;

    const pdfHeight = pdfWidth * (canvas.height / canvas.width);

    doc.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      14,
      startY + 5,
      pdfWidth,
      pdfHeight
    );

    // Leyenda al lado del mapa
    const legendX = 14 + pdfWidth + 10;

    let legendY = startY + 12;

    doc.setFontSize(9.5);

    (Object.keys(RESULT_LABELS) as ResultKey[]).forEach(key => {

      doc.setFillColor(...RESULT_COLORS[key]);

      doc.circle(legendX, legendY - 1.2, 2, 'F');

      doc.setTextColor(70, 70, 70);

      doc.text(RESULT_LABELS[key], legendX + 4, legendY);

      legendY += 6;

    });

    doc.setTextColor(0);

    return startY + 5 + pdfHeight + 8;

  }

  private renderHeatmapCanvas(
    throws: Throw[],
    width: number,
    height: number
  ): HTMLCanvasElement {

    const canvas = document.createElement('canvas');

    canvas.width = width;

    canvas.height = height;

    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ECECEC';

    ctx.fillRect(0, 0, width, height);

    this.drawCourtSurface(ctx);

    // Jacks (sin repetir posiciones iguales, como en el heatmap real).
    const drawnJacks = new Set<string>();

    throws.forEach(t => {

      if (!t.jack) {
        return;
      }

      const key = `${Math.round(t.jack.x)}-${Math.round(t.jack.y)}`;

      if (drawnJacks.has(key)) {
        return;
      }

      drawnJacks.add(key);

      this.drawDot(ctx, t.jack.x, t.jack.y, 9, '#FFFFFF', '#666666');

    });

    // Lanzamientos coloreados por resultado (misma leyenda que en pantalla).
    throws.forEach(t => {

      const [r, g, b] = RESULT_COLORS[(t.result as ResultKey) ?? 'good'] ?? [153, 153, 153];

      this.drawDot(ctx, t.x, t.y, 9, `rgb(${r},${g},${b})`, '#FFFFFF');

    });

    // El canvas fuente es 600x1200 para que las coordenadas de los
    // lanzamientos calcen con las de CourtEngineComponent, pero eso
    // deja mucho margen gris vacío alrededor (sobre todo abajo). Se
    // recorta a solo la cancha + un margen chico antes de insertarlo
    // en el PDF, para que no se vea una franja gris enorme.
    const margin = 15;

    const cropX = COURT.x - margin;

    const cropY = COURT.y - margin;

    const cropWidth = COURT.width + margin * 2;

    const cropHeight = COURT.height + margin * 2;

    const cropped = document.createElement('canvas');

    cropped.width = cropWidth;

    cropped.height = cropHeight;

    cropped.getContext('2d')!.drawImage(
      canvas,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    return cropped;

  }

  /**
   * Replica el dibujo de CourtEngineComponent (fondo con degradé,
   * borde, línea central, blanco con cruz, "V" y cajas numeradas) en
   * un canvas 600x1200 fuera de pantalla, para que el mapa del PDF se
   * vea como la cancha real y no un rectángulo verde genérico.
   */
  private drawCourtSurface(ctx: CanvasRenderingContext2D): void {

    const c = COURT;

    const gradient = ctx.createLinearGradient(0, c.y, 0, c.y + c.height);

    gradient.addColorStop(0, '#3BCB61');

    gradient.addColorStop(1, '#2FAF52');

    ctx.fillStyle = gradient;

    ctx.fillRect(c.x, c.y, c.width, c.height);

    ctx.strokeStyle = '#FFFFFF';

    ctx.lineWidth = 5;

    ctx.strokeRect(c.x, c.y, c.width, c.height);

    // Línea central punteada
    ctx.strokeStyle = '#5AD66F';

    ctx.lineWidth = 2;

    ctx.setLineDash([8, 8]);

    ctx.beginPath();

    ctx.moveTo(c.x + c.width / 2, c.y);

    ctx.lineTo(c.x + c.width / 2, c.y + c.height);

    ctx.stroke();

    ctx.setLineDash([]);

    // Blanco (cuadrado + cruz)
    const targetSize = c.targetSize;

    const targetX = c.x + c.width / 2 - targetSize / 2;

    // Centrado a 5 m de la línea de tiro (frente de las casas).
    const targetY = 370;

    ctx.strokeStyle = '#FFFFFF';

    ctx.lineWidth = 5;

    ctx.strokeRect(targetX, targetY, targetSize, targetSize);

    ctx.beginPath();

    ctx.moveTo(targetX + targetSize / 2, targetY);

    ctx.lineTo(targetX + targetSize / 2, targetY + targetSize);

    ctx.moveTo(targetX, targetY + targetSize / 2);

    ctx.lineTo(targetX + targetSize, targetY + targetSize / 2);

    ctx.stroke();

    // V central
    ctx.beginPath();

    ctx.moveTo(c.x, c.vY);

    ctx.lineTo(c.x + c.width / 2, c.vY + 120);

    ctx.lineTo(c.x + c.width, c.vY);

    ctx.stroke();

    // Cajas numeradas
    const top = c.y + c.height - c.boxesHeight;

    const boxWidth = c.width / 6;

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(c.x, top);

    ctx.lineTo(c.x + c.width, top);

    ctx.stroke();

    for (let i = 0; i <= 6; i++) {

      const x = c.x + boxWidth * i;

      ctx.beginPath();

      ctx.moveTo(x, top);

      ctx.lineTo(x, c.y + c.height);

      ctx.stroke();

    }

    ctx.fillStyle = '#FFFFFF';

    ctx.font = 'bold 28px Arial';

    ctx.textAlign = 'center';

    ctx.textBaseline = 'middle';

    for (let i = 0; i < 6; i++) {

      ctx.fillText(String(i + 1), c.x + boxWidth * i + boxWidth / 2, top + 35);

    }

  }

  private drawDot(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    fill: string,
    stroke: string
  ): void {

    ctx.beginPath();

    ctx.fillStyle = fill;

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fill();

    ctx.strokeStyle = stroke;

    ctx.lineWidth = 1.4;

    ctx.stroke();

  }

  private drawThrowCards(doc: jsPDF, evaluation: Evaluation, startY: number): void {

    const throws = evaluation.throwList ?? [];

    if (!throws.length) {
      return;
    }

    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 14;

    const cardWidth = pageWidth - marginX * 2;

    const bottomMargin = 16;

    let y = startY;

    doc.setFontSize(13);

    doc.setTextColor(30, 30, 30);

    doc.text('Detalle de lanzamientos', marginX, y);

    y += 8;

    throws.forEach(t => {

      const observation = (t.observation ?? '').trim();

      const commentLines = observation
        ? doc.splitTextToSize(observation, cardWidth - 12)
        : [];

      const cardHeight = 18 + commentLines.length * 5;

      if (y + cardHeight > pageHeight - bottomMargin) {

        doc.addPage();

        y = 20;

      }

      this.drawThrowCard(doc, t, marginX, y, cardWidth, cardHeight, commentLines);

      y += cardHeight + 4;

    });

  }

  private drawThrowCard(
    doc: jsPDF,
    t: Throw,
    x: number,
    y: number,
    width: number,
    height: number,
    commentLines: string[]
  ): void {

    doc.setFillColor(248, 249, 251);

    doc.setDrawColor(228, 231, 236);

    doc.roundedRect(x, y, width, height, 2, 2, 'FD');

    const ballColor = BALL_COLORS[(t.color as 'red' | 'blue') ?? 'red'];

    doc.setFillColor(...ballColor);

    doc.circle(x + 8, y + 9, 3, 'F');

    doc.setFontSize(10.5);

    doc.setTextColor(30, 30, 30);

    doc.text(`Lanzamiento ${t.throwNumber}`, x + 14, y + 10.5);

    const resultKey = (t.result as ResultKey) ?? 'good';

    const badgeLabel = RESULT_LABELS[resultKey] ?? '-';

    const badgeWidth = doc.getTextWidth(badgeLabel) + 8;

    const badgeX = x + width - badgeWidth - 4;

    doc.setFillColor(...(RESULT_COLORS[resultKey] ?? [153, 153, 153]));

    doc.roundedRect(badgeX, y + 4, badgeWidth, 8, 2, 2, 'F');

    doc.setFontSize(8.5);

    doc.setTextColor(255, 255, 255);

    doc.text(badgeLabel, badgeX + badgeWidth / 2, y + 9.5, { align: 'center' });

    const distance = t.jack
      ? `${formatCourtDistance(pixelDistanceToMeters(t.x - t.jack.x, t.y - t.jack.y))} al jack`
      : 'sin jack de referencia';

    doc.setFontSize(9);

    doc.setTextColor(110, 110, 110);

    doc.text(
      `Cuadrante ${t.quadrant ?? '-'} · ${distance}`,
      x + 14,
      y + 16
    );

    if (commentLines.length) {

      doc.setFontSize(9);

      doc.setTextColor(70, 70, 70);

      doc.text(commentLines, x + 8, y + 22);

    }

    doc.setTextColor(0);

  }

}
