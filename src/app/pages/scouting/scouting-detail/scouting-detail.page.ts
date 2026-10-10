import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';

import { ScoutingBall, ScoutingPlay, ScoutingPlayAction, ScoutingReport } from 'src/app/models/scouting.model';
import { ScoutingService } from 'src/app/services/scouting.service';
import { StorageService } from 'src/app/services/storageService';
import { SessionService } from 'src/app/services/session.service';
import { ScoutingPlayModalComponent } from 'src/app/shared/components/scouting-play-modal/scouting-play-modal.component';

interface ActionSummary {
  action: ScoutingPlayAction;
  total: number;
  success: number;
  successPercent: number;
}

@Component({
  selector: 'app-scouting-detail',
  templateUrl: './scouting-detail.page.html',
  styleUrls: ['./scouting-detail.page.scss'],
  standalone: false
})
export class ScoutingDetailPage implements OnInit, AfterViewInit {

  // static:false porque <canvas #courtCanvas> vive dentro de un
  // *ngIf="report": con static:true, Angular resuelve la referencia
  // antes de que el *ngIf pase a verdadero y el canvas queda undefined
  // para siempre, por lo que la cancha nunca llega a dibujarse.
  @ViewChild('courtCanvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  report: ScoutingReport | null = null;

  uploadingPlayId: number | null = null;

  //------------------------------------------------
  // CANCHA EN VIVO (jack + bochas de la jugada actual)
  //------------------------------------------------

  // Se mantiene entre jugadas registradas a propósito: el entrenador
  // va siguiendo el partido punto a punto, reacomodando bochas sobre
  // el mismo tablero (por ejemplo tras un smash) y presionando
  // "Registrar jugada" cada vez que corresponde, en vez de partir de
  // cero cada vez.
  draftJack: { x: number; y: number } | null = null;

  draftBalls: ScoutingBall[] = [];

  // Jugada guardada que se está revisando en modo solo-lectura.
  previewPlay: ScoutingPlay | null = null;

  private ctx!: CanvasRenderingContext2D;

  private readonly WIDTH = 600;

  private readonly HEIGHT = 1200;

  private readonly BALL_RADIUS = 14;

  private readonly JACK_RADIUS = 10;

  private readonly COURT = {
    x: 50,
    y: 40,
    width: 500,
    height: 1000,
    boxesHeight: 240,
    targetSize: 100,
    vY: 566
  };

  private draggingBallIndex: number | null = null;

  private draggingJack = false;

  //------------------------------------------------
  // ZOOM / DESPLAZAMIENTO (pellizcar con dos dedos), igual que en
  // la cancha de evaluaciones (court-engine.component.ts).
  //------------------------------------------------

  private zoomScale = 1;

  private panX = 0;

  private panY = 0;

  private readonly MIN_ZOOM = 1;

  private readonly MAX_ZOOM = 3;

  private pinchState: {
    startDistance: number;
    startScale: number;
    startMidX: number;
    startMidY: number;
    startPanX: number;
    startPanY: number;
  } | null = null;

  private lastTapTime = 0;

  private suppressNextTap = false;

  constructor(
    private router: Router,
    private scoutingService: ScoutingService,
    private storageService: StorageService,
    private sessionService: SessionService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {

    this.report = this.scoutingService.getReport();

    if (!this.report) {
      this.router.navigate(['/main/scouting/scouting-list']);
    }

  }

  ngAfterViewInit(): void {

    if (!this.report) {
      return;
    }

    this.initializeCanvas();

    this.render();

  }

  get plays(): ScoutingPlay[] {
    return this.report?.plays ?? [];
  }

  get ownColor(): 'red' | 'blue' {
    return this.report?.ownColor ?? 'red';
  }

  get rivalColor(): 'red' | 'blue' {
    return this.ownColor === 'red' ? 'blue' : 'red';
  }

  editReport(): void {

    if (!this.report) {
      return;
    }

    this.scoutingService.setReport(this.report);

    this.router.navigate(['/main/scouting/scouting-create']);

  }

  //------------------------------------------------
  // CANVAS: eventos
  //------------------------------------------------

  private initializeCanvas(): void {

    const canvas = this.canvas.nativeElement;

    canvas.width = this.WIDTH;

    canvas.height = this.HEIGHT;

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    this.ctx = context;

    // Se usan eventos "pointer*" (no 'click'): con touch-action:none
    // en el canvas, algunos WebView de Android/iOS nunca sintetizan
    // el 'click' a partir de un toque, dejando el tap sin efecto.
    canvas.addEventListener('pointerdown', event => this.onCanvasPointerDown(event));

    canvas.addEventListener('pointermove', event => this.onCanvasPointerMove(event));

    canvas.addEventListener('pointerup', event => this.onCanvasPointerUp(event));

    canvas.addEventListener('pointerleave', () => this.onCanvasPointerLeave());

    // Zoom con pellizco de dos dedos + doble toque para restablecer,
    // igual que en la cancha de evaluaciones. Usa "touch" (no
    // "pointer") porque necesita ver ambos dedos a la vez.
    canvas.addEventListener(
      'touchstart',
      event => this.onTouchStart(event),
      { passive: false }
    );

    canvas.addEventListener(
      'touchmove',
      event => this.onTouchMove(event),
      { passive: false }
    );

    canvas.addEventListener('touchend', event => this.onTouchEnd(event));

    canvas.addEventListener('touchcancel', event => this.onTouchEnd(event));

  }

  //------------------------------------------------
  // ZOOM / DESPLAZAMIENTO
  //------------------------------------------------

  private touchDistance(a: Touch, b: Touch): number {

    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  }

  private onTouchStart(event: TouchEvent): void {

    if (event.touches.length === 2) {

      event.preventDefault();

      // Si se estaba arrastrando el jack o una bocha con un dedo y
      // aparece un segundo dedo, se corta el arrastre para que no
      // siga "pegado" al puntero mientras se hace zoom.
      this.draggingBallIndex = null;

      this.draggingJack = false;

      const [t1, t2] = [event.touches[0], event.touches[1]];

      this.pinchState = {

        startDistance: this.touchDistance(t1, t2),

        startScale: this.zoomScale,

        startMidX: (t1.clientX + t2.clientX) / 2,

        startMidY: (t1.clientY + t2.clientY) / 2,

        startPanX: this.panX,

        startPanY: this.panY

      };

      return;

    }

    if (event.touches.length === 1 && this.zoomScale > 1) {

      // Doble toque restablece el zoom.
      const now = Date.now();

      if (now - this.lastTapTime < 300) {

        this.resetZoom();

      }

      this.lastTapTime = now;

    }

  }

  private onTouchMove(event: TouchEvent): void {

    if (event.touches.length !== 2 || !this.pinchState) {
      return;
    }

    event.preventDefault();

    const [t1, t2] = [event.touches[0], event.touches[1]];

    const newDistance = this.touchDistance(t1, t2);

    const rawScale = this.pinchState.startScale *
      (newDistance / this.pinchState.startDistance);

    this.zoomScale = Math.min(
      this.MAX_ZOOM,
      Math.max(this.MIN_ZOOM, rawScale)
    );

    const midX = (t1.clientX + t2.clientX) / 2;

    const midY = (t1.clientY + t2.clientY) / 2;

    this.panX = this.pinchState.startPanX + (midX - this.pinchState.startMidX);

    this.panY = this.pinchState.startPanY + (midY - this.pinchState.startMidY);

    this.clampPan();

    this.applyTransform();

  }

  private onTouchEnd(event: TouchEvent): void {

    if (this.pinchState && event.touches.length < 2) {

      // Al soltar los dedos de un pellizco sigue un pointerup; se
      // ignora ese próximo tap para no mover el jack sin querer al
      // punto medio del pellizco.
      this.suppressNextTap = true;

    }

    if (event.touches.length < 2) {
      this.pinchState = null;
    }

  }

  private clampPan(): void {

    const maxPan = 300 * (this.zoomScale - 1);

    this.panX = Math.min(maxPan, Math.max(-maxPan, this.panX));

    this.panY = Math.min(maxPan, Math.max(-maxPan, this.panY));

  }

  private applyTransform(): void {

    this.canvas.nativeElement.style.transform =
      `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomScale})`;

  }

  resetZoom(): void {

    this.zoomScale = 1;

    this.panX = 0;

    this.panY = 0;

    this.applyTransform();

  }

  private toCanvasPoint(event: PointerEvent): { x: number; y: number } {

    const rect = this.canvas.nativeElement.getBoundingClientRect();

    const scaleX = this.WIDTH / rect.width;

    const scaleY = this.HEIGHT / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };

  }

  private onCanvasPointerDown(event: PointerEvent): void {

    if (this.previewPlay || this.pinchState) {
      return;
    }

    const point = this.toCanvasPoint(event);

    const hitIndex = this.draftBalls.findIndex(ball =>
      Math.hypot(ball.x - point.x, ball.y - point.y) <= this.BALL_RADIUS
    );

    if (hitIndex !== -1) {
      this.draggingBallIndex = hitIndex;
      return;
    }

    if (
      this.draftJack &&
      Math.hypot(this.draftJack.x - point.x, this.draftJack.y - point.y) <= this.JACK_RADIUS + 6
    ) {
      this.draggingJack = true;
    }

  }

  private onCanvasPointerMove(event: PointerEvent): void {

    if (this.draggingBallIndex === null && !this.draggingJack) {
      return;
    }

    const point = this.toCanvasPoint(event);

    if (this.draggingBallIndex !== null) {

      this.draftBalls[this.draggingBallIndex] = {
        ...this.draftBalls[this.draggingBallIndex],
        x: point.x,
        y: point.y
      };

    } else if (this.draggingJack) {

      this.draftJack = point;

    }

    this.render();

  }

  private onCanvasPointerUp(event: PointerEvent): void {

    const wasDragging = this.draggingBallIndex !== null || this.draggingJack;

    this.draggingBallIndex = null;

    this.draggingJack = false;

    if (this.suppressNextTap) {
      this.suppressNextTap = false;
      return;
    }

    if (wasDragging || this.previewPlay) {
      return;
    }

    // El jack solo se ubica con el primer toque sobre la cancha
    // vacía; una vez colocado, un toque en otro lado NO lo mueve
    // (para eso hay que arrastrarlo directamente, ver
    // onCanvasPointerDown/Move).
    if (this.draftJack) {
      return;
    }

    const point = this.toCanvasPoint(event);

    const c = this.COURT;

    if (point.x < c.x || point.x > c.x + c.width || point.y < c.y || point.y > c.y + c.height) {
      return;
    }

    this.draftJack = point;

    this.render();

  }

  private onCanvasPointerLeave(): void {

    this.draggingBallIndex = null;

    this.draggingJack = false;

  }

  //------------------------------------------------
  // ARMAR LA JUGADA: bochas
  //------------------------------------------------

  addOwnBall(): void {
    this.addBall(this.ownColor);
  }

  addRivalBall(): void {
    this.addBall(this.rivalColor);
  }

  private addBall(color: 'red' | 'blue'): void {

    if (this.previewPlay) {
      return;
    }

    const c = this.COURT;

    const index = this.draftBalls.length;

    // Pequeño desplazamiento por bocha para que no queden todas
    // apiladas exactamente en el mismo punto al agregarlas.
    const offset = (index % 5) * 18;

    this.draftBalls = [

      ...this.draftBalls,

      {
        x: c.x + c.width / 2 - 40 + offset,
        y: c.y + c.height / 2 + offset,
        color
      }

    ];

    this.render();

  }

  removeLastBall(): void {

    if (this.previewPlay || !this.draftBalls.length) {
      return;
    }

    this.draftBalls = this.draftBalls.slice(0, -1);

    this.render();

  }

  clearCourt(): void {

    if (this.previewPlay) {
      return;
    }

    this.draftJack = null;

    this.draftBalls = [];

    this.render();

  }

  //------------------------------------------------
  // REGISTRAR JUGADA
  //------------------------------------------------

  async registerPlay(): Promise<void> {

    if (this.previewPlay) {
      return;
    }

    const modal = await this.modalController.create({
      component: ScoutingPlayModalComponent
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (!data) {
      return;
    }

    await this.addPlay(data.action, data.outcome, data.note);

  }

  private async addPlay(
    action: ScoutingPlayAction,
    outcome: 'success' | 'fail',
    note: string
  ): Promise<void> {

    const reportId = this.report?.id;

    if (!reportId) {
      return;
    }

    const nextId = this.plays.length
      ? Math.max(...this.plays.map(p => p.id)) + 1
      : 1;

    const play: ScoutingPlay = {

      id: nextId,

      // Se conservan x/y por compatibilidad con reportes viejos que
      // solo guardaban un punto; ahora reflejan la posición del jack.
      x: this.draftJack?.x ?? 0,

      y: this.draftJack?.y ?? 0,

      jack: this.draftJack ? { ...this.draftJack } : undefined,

      balls: this.draftBalls.map(ball => ({ ...ball })),

      action,

      outcome,

      note,

      createdAt: new Date()

    };

    const updatedPlays = [...this.plays, play];

    this.report = { ...this.report!, plays: updatedPlays };

    this.scoutingService.setReport(this.report);

    await this.scoutingService.savePlays(reportId, updatedPlays);

    // La cancha NO se limpia: el entrenador sigue el partido jugada
    // por jugada sobre el mismo tablero, reacomodando lo que
    // corresponda (ej. tras un smash) antes de registrar la próxima.
    this.render();

  }

  //------------------------------------------------
  // VER UNA JUGADA YA REGISTRADA
  //------------------------------------------------

  viewPlay(play: ScoutingPlay): void {

    this.previewPlay = play;

    this.render();

  }

  closePreview(): void {

    this.previewPlay = null;

    this.render();

  }

  //------------------------------------------------
  // RESUMEN POR TIPO DE JUGADA
  //------------------------------------------------

  get actionSummary(): ActionSummary[] {

    const map = new Map<ScoutingPlayAction, { total: number; success: number }>();

    this.plays.forEach(play => {

      const entry = map.get(play.action) ?? { total: 0, success: 0 };

      entry.total++;

      if (play.outcome === 'success') {
        entry.success++;
      }

      map.set(play.action, entry);

    });

    return Array.from(map.entries())
      .map(([action, { total, success }]) => ({
        action,
        total,
        success,
        successPercent: total ? (success * 100) / total : 0
      }))
      .sort((a, b) => b.total - a.total);

  }

  async deletePlay(play: ScoutingPlay): Promise<void> {

    if (!this.report?.id) {
      return;
    }

    const alert = await this.alertController.create({

      header: 'Eliminar jugada',

      message: `¿Eliminar la jugada #${play.id}?`,

      buttons: [

        { text: 'Cancelar', role: 'cancel' },

        {

          text: 'Eliminar',

          role: 'destructive',

          handler: async () => {

            if (this.previewPlay?.id === play.id) {
              this.previewPlay = null;
            }

            const updatedPlays = this.plays.filter(p => p.id !== play.id);

            this.report = { ...this.report!, plays: updatedPlays };

            this.scoutingService.setReport(this.report);

            await this.scoutingService.savePlays(this.report.id!, updatedPlays);

            this.render();

          }

        }

      ]

    });

    await alert.present();

  }

  //------------------------------------------------
  // ADJUNTAR FOTO/VIDEO A UNA JUGADA
  //------------------------------------------------

  async attachPhoto(play: ScoutingPlay): Promise<void> {

    await this.attachMedia(play, 'photo');

  }

  async attachVideo(play: ScoutingPlay): Promise<void> {

    await this.attachMedia(play, 'video');

  }

  private async attachMedia(play: ScoutingPlay, type: 'photo' | 'video'): Promise<void> {

    const user = this.sessionService.getUser();

    const reportId = this.report?.id;

    if (!user || !reportId || this.uploadingPlayId !== null) {
      return;
    }

    try {

      const result = type === 'photo'
        ? await FilePicker.pickImages({ limit: 1, readData: true })
        : await FilePicker.pickVideos({ limit: 1, readData: true });

      if (!result.files.length) {
        return;
      }

      const pickedFile = result.files[0];

      this.uploadingPlayId = play.id;

      let mediaUrl: string;

      if (pickedFile.blob) {

        const file = new File(
          [pickedFile.blob],
          pickedFile.name ?? `scouting_${Date.now()}`,
          { type: pickedFile.mimeType ?? (type === 'photo' ? 'image/jpeg' : 'video/mp4') }
        );

        const uploaded = await this.storageService.uploadFile(file, `scouting/${type}s`);

        mediaUrl = uploaded.url;

      } else if (pickedFile.data) {

        const uploaded = await this.storageService.uploadBase64(
          pickedFile.data,
          pickedFile.mimeType ?? (type === 'photo' ? 'image/jpeg' : 'video/mp4'),
          `scouting/${type}s`,
          pickedFile.name
        );

        mediaUrl = uploaded.url;

      } else {

        throw new Error('No fue posible obtener el archivo.');

      }

      const updatedPlays = this.plays.map(p =>
        p.id === play.id ? { ...p, mediaUrl, mediaType: type } : p
      );

      this.report = { ...this.report!, plays: updatedPlays };

      this.scoutingService.setReport(this.report);

      await this.scoutingService.savePlays(reportId, updatedPlays);

    } catch (error) {

      console.error('Error adjuntando archivo:', error);

      const toast = await this.toastController.create({
        message: 'No se pudo adjuntar el archivo.',
        duration: 2500,
        color: 'danger'
      });

      await toast.present();

    } finally {

      this.uploadingPlayId = null;

    }

  }

  //------------------------------------------------
  // DIBUJO DE LA CANCHA
  //------------------------------------------------

  private render(): void {

    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

    this.drawBackground();

    this.drawBorder();

    this.drawCenterLine();

    this.drawTarget();

    this.drawV();

    this.drawBoxes();

    this.drawDistanceRuler();

    const jack = this.previewPlay ? this.previewPlay.jack : this.draftJack;

    const balls = this.previewPlay ? (this.previewPlay.balls ?? []) : this.draftBalls;

    this.drawScene(jack, balls);

  }

  private drawScene(
    jack: { x: number; y: number } | null | undefined,
    balls: ScoutingBall[]
  ): void {

    balls.forEach(ball => {

      this.drawBall(
        ball.x,
        ball.y,
        this.BALL_RADIUS,
        ball.color === 'red' ? '#E53935' : '#1E88E5'
      );

    });

    if (jack) {

      this.drawBall(jack.x, jack.y, this.JACK_RADIUS, '#FFFFFF', '#666666');

    }

  }

  private drawBall(
    x: number,
    y: number,
    radius: number,
    fillColor: string,
    borderColor: string = '#FFFFFF'
  ): void {

    this.ctx.beginPath();

    this.ctx.fillStyle = fillColor;

    this.ctx.arc(x, y, radius, 0, Math.PI * 2);

    this.ctx.fill();

    this.ctx.strokeStyle = borderColor;

    this.ctx.lineWidth = 3;

    this.ctx.stroke();

  }

  private drawBackground(): void {

    this.ctx.fillStyle = '#ECECEC';

    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    this.ctx.fillStyle = '#37C759';

    this.ctx.fillRect(this.COURT.x, this.COURT.y, this.COURT.width, this.COURT.height);

  }

  private drawBorder(): void {

    this.ctx.strokeStyle = 'white';

    this.ctx.lineWidth = 6;

    this.ctx.strokeRect(this.COURT.x, this.COURT.y, this.COURT.width, this.COURT.height);

  }

  private drawCenterLine(): void {

    const c = this.COURT;

    this.ctx.beginPath();

    this.ctx.setLineDash([8, 8]);

    this.ctx.moveTo(c.x + c.width / 2, c.y);

    this.ctx.lineTo(c.x + c.width / 2, c.y + c.height);

    this.ctx.strokeStyle = 'rgba(255,255,255,.45)';

    this.ctx.lineWidth = 2;

    this.ctx.stroke();

    this.ctx.setLineDash([]);

  }

  private drawTarget(): void {

    const c = this.COURT;

    const size = c.targetSize;

    const x = c.x + c.width / 2 - size / 2;

    const y = 370;

    this.ctx.strokeStyle = 'white';

    this.ctx.lineWidth = 5;

    this.ctx.strokeRect(x, y, size, size);

    this.ctx.beginPath();

    this.ctx.moveTo(x + size / 2, y);

    this.ctx.lineTo(x + size / 2, y + size);

    this.ctx.moveTo(x, y + size / 2);

    this.ctx.lineTo(x + size, y + size / 2);

    this.ctx.stroke();

  }

  private drawV(): void {

    const c = this.COURT;

    const y = c.vY;

    this.ctx.strokeStyle = 'white';

    this.ctx.lineWidth = 5;

    this.ctx.beginPath();

    this.ctx.moveTo(c.x, y);

    this.ctx.lineTo(c.x + c.width / 2, y + 120);

    this.ctx.lineTo(c.x + c.width, y);

    this.ctx.stroke();

  }

  private drawBoxes(): void {

    const c = this.COURT;

    const top = c.y + c.height - c.boxesHeight;

    const w = c.width / 6;

    this.ctx.strokeStyle = 'white';

    this.ctx.lineWidth = 3;

    for (let i = 0; i < 6; i++) {

      this.ctx.strokeRect(c.x + i * w, top, w, c.boxesHeight);

      this.ctx.fillStyle = 'white';

      this.ctx.font = 'bold 30px Arial';

      this.ctx.textAlign = 'center';

      this.ctx.fillText(String(i + 1), c.x + i * w + w / 2, top + 70);

    }

  }

  private drawDistanceRuler(): void {

    const c = this.COURT;

    const baseY = c.y + c.height - c.boxesHeight;

    const tickX = c.x - 6;

    this.ctx.strokeStyle = '#4A5568';

    this.ctx.fillStyle = '#2D3748';

    this.ctx.font = 'bold 13px Arial';

    this.ctx.textAlign = 'right';

    this.ctx.textBaseline = 'middle';

    this.ctx.lineWidth = 1;

    for (let half = 1; half < 20; half += 2) {

      const y = baseY - (half / 2) * 76;

      if (y < c.y) {
        break;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(tickX - 5, y);
      this.ctx.lineTo(tickX, y);
      this.ctx.stroke();

    }

    this.ctx.lineWidth = 2;

    for (let m = 1; m <= 10; m++) {

      const y = baseY - m * 76;

      if (y < c.y) {
        break;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(tickX - 10, y);
      this.ctx.lineTo(tickX, y);
      this.ctx.stroke();

      this.ctx.fillText(`${m}m`, tickX - 12, y);

    }

  }

}
