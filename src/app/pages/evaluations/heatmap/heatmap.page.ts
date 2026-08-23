import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Throw } from '../models/throw.model';
import { OpponentBall } from '../models/opponent-ball.model';
import { CourtMode } from '../models/court-mode.model';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { EvaluationType } from 'src/app/models/evaluation.model';
import {
  ImpactResult,
  resolveImpact
} from '../engine/physics/impact-resolver';
import {
  pixelDistanceToMeters,
  formatCourtDistance,
  PIXELS_PER_METER_LENGTH,
  COURT_MAX_LENGTH_M,
  COURT_THROW_LINE_Y
} from '../engine/physics/court-scale';

const ANIMATED_MODE_BY_TYPE: Partial<Record<EvaluationType, CourtMode>> = {
  'Push On': 'push-on',
  'Push Off': 'push-off',
  'Bochada': 'bochada',
  'Ricochet': 'ricochet'
};

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.page.html',
  styleUrls: ['./heatmap.page.scss'],
  standalone: false
})
export class HeatmapPage implements AfterViewInit {

  @ViewChild('courtCanvas',{static:true})
  canvas!:ElementRef<HTMLCanvasElement>;

  filter:'all'|'red'|'blue'='all';

  heatMode:'density'|'quality'|'precision'='density';

  throws: Throw[] = [];

  selectedBox?: number;

  //------------------------------------------------
  // VER DE A UNO
  //------------------------------------------------

  allThrows: Throw[] = [];

  viewMode: 'all' | 'one-by-one' = 'all';

  currentIndex = 0;

  evaluationType?: EvaluationType;

  opponentBalls: OpponentBall[] = [];

  private singleAnimationRunning = false;

  private singleAnimationProgress = 0;

  private singleImpactDX = 0;

  private singleImpactDY = 0;

  private readonly CELL_SIZE = 10;

  private heatMatrix: number[][] = [];

  private readonly ROWS = 120;

  private readonly COLS = 60;

  jack?: {

    x:number;

    y:number;

  };

  private ctx!:CanvasRenderingContext2D;

  private readonly WIDTH=600;

  private readonly HEIGHT=1200;

  //------------------------------------------------
  // ZOOM / DESPLAZAMIENTO (pellizcar con dos dedos)
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

  private readonly COURT={

    x:50,

    y:40,

    width:500,

    height:1000,

    border:8,

    boxesHeight:240,

    targetSize:100,

    // Punta de la V a 1,5 m de la línea de tiro (frente de las
    // casas) — ver court-scale.ts.
    vY:566

  };

  constructor(
    private evaluationService: EvaluationService
) {}

  ngAfterViewInit(): void {

  const evaluation = this.evaluationService.getEvaluation();

  console.log('EVALUATION', evaluation);
console.log('SELECTED BOX', evaluation?.selectedBox);

  if (evaluation) {

  this.allThrows = evaluation.throwList ?? [];

  this.throws = this.allThrows;

  this.selectedBox = evaluation.selectedBox;

  this.evaluationType = evaluation.evaluationType;

  this.opponentBalls = evaluation.opponentBalls ?? [];

  // First Ball cambia el jack en cada intento — verlos todos juntos
  // confunde. Para los demás tipos se mantiene la vista agregada.
  this.viewMode = evaluation.evaluationType === 'First Ball'
    ? 'one-by-one'
    : 'all';

}

  this.initializeCanvas();

  this.applyViewMode();

}

refresh(): void {

  this.applyViewMode();

}

get currentDistanceLabel(): string | undefined {

  const throwBall = this.throws[0];

  if (!throwBall?.jack) {
    return undefined;
  }

  return formatCourtDistance(
    pixelDistanceToMeters(
      throwBall.x - throwBall.jack.x,
      throwBall.y - throwBall.jack.y
    )
  );

}

  private initializeCanvas(){

    const canvas=this.canvas.nativeElement;

    canvas.width=this.WIDTH;

    canvas.height=this.HEIGHT;

    const context=canvas.getContext('2d');

    if(!context){
      return;
    }

    this.ctx=context;

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

    canvas.addEventListener(
      'touchend',
      event => this.onTouchEnd(event)
    );

    canvas.addEventListener(
      'touchcancel',
      event => this.onTouchEnd(event)
    );

  }

  //------------------------------------------------
  // ZOOM / DESPLAZAMIENTO
  //------------------------------------------------

  private touchDistance(a: Touch, b: Touch): number {

    return Math.hypot(
      a.clientX - b.clientX,
      a.clientY - b.clientY
    );

  }

  private onTouchStart(event: TouchEvent): void {

    if (event.touches.length === 2) {

      event.preventDefault();

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

    // Doble toque para restablecer el zoom.
    if (event.touches.length === 1) {

      const now = Date.now();

      if (now - this.lastTapTime < 300) {

        this.resetZoom();

      }

      this.lastTapTime = now;

    }

  }

  private onTouchMove(event: TouchEvent): void {

    if (!this.pinchState || event.touches.length !== 2) {
      return;
    }

    event.preventDefault();

    const [t1, t2] = [event.touches[0], event.touches[1]];

    const distance = this.touchDistance(t1, t2);

    const rawScale =
      this.pinchState.startScale *
      (distance / this.pinchState.startDistance);

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

  private render(): void {

  this.clear();

  //==============================
  // Cancha
  //==============================

  this.drawBackground();

  this.drawBorder();

  this.drawCenterLine();

  this.drawTarget();

  this.drawV();

  this.drawBoxes();

  this.drawSelectedBox();

  this.drawDistanceRuler();

  //==============================
  // Modo de visualización
  //==============================

  switch (this.heatMode) {

    case 'density':

      this.buildHeatMatrix();

      this.drawHeatCells();

      this.drawJack();

      this.drawThrows();

      break;

    case 'quality':

      this.drawQualityMap();

      this.drawJack();

      this.drawThrows();

      break;

    case 'precision':

      // Este modo dibuja TODO él solo
      this.drawPrecisionMap();

      break;

  }

}

  //------------------------------------------------

  private clear(){

    this.ctx.clearRect(

      0,

      0,

      this.WIDTH,

      this.HEIGHT

    );

  }

  //------------------------------------------------

  private drawBackground(){

    // Fondo del margen alrededor de la cancha, fijo y no ligado al
    // tema (claro/oscuro) — así la regla de distancias dibujada ahí
    // siempre tiene buen contraste, sin importar el modo.
    this.ctx.fillStyle="#ECECEC";

    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    this.ctx.fillStyle="#37C759";

    this.ctx.fillRect(

      this.COURT.x,

      this.COURT.y,

      this.COURT.width,

      this.COURT.height

    );

  }

  //------------------------------------------------

  private drawBorder(){

    this.ctx.strokeStyle="white";

    this.ctx.lineWidth=6;

    this.ctx.strokeRect(

      this.COURT.x,

      this.COURT.y,

      this.COURT.width,

      this.COURT.height

    );

  }

  //------------------------------------------------

  private drawCenterLine(){

    this.ctx.beginPath();

    this.ctx.setLineDash([8,8]);

    this.ctx.moveTo(

      this.COURT.x+this.COURT.width/2,

      this.COURT.y

    );

    this.ctx.lineTo(

      this.COURT.x+this.COURT.width/2,

      this.COURT.y+this.COURT.height

    );

    this.ctx.strokeStyle="rgba(255,255,255,.45)";

    this.ctx.lineWidth=2;

    this.ctx.stroke();

    this.ctx.setLineDash([]);

  }

  //------------------------------------------------

  private drawTarget(){

    const size=this.COURT.targetSize;

    const x=this.COURT.x+this.COURT.width/2-size/2;

    // Centrado a 5 m de la línea de tiro (frente de las casas).
    const y=370;

    this.ctx.strokeStyle="white";

    this.ctx.lineWidth=5;

    this.ctx.strokeRect(

      x,

      y,

      size,

      size

    );

    this.ctx.beginPath();

    this.ctx.moveTo(x+size/2,y);

    this.ctx.lineTo(x+size/2,y+size);

    this.ctx.moveTo(x,y+size/2);

    this.ctx.lineTo(x+size,y+size/2);

    this.ctx.stroke();

  }

  //------------------------------------------------

  private drawJack(): void {

  const drawn = new Set<string>();

  for (const ball of this.throws) {

    if (!ball.jack) {
      continue;
    }

    const key =
      `${Math.round(ball.jack.x)}-${Math.round(ball.jack.y)}`;

    if (drawn.has(key)) {
      continue;
    }

    drawn.add(key);

    this.ctx.beginPath();

    this.ctx.fillStyle = "#FFFFFF";

    this.ctx.arc(

      ball.jack.x,

      ball.jack.y,

      11,

      0,

      Math.PI * 2

    );

    this.ctx.fill();

    this.ctx.strokeStyle = "#777";

    this.ctx.lineWidth = 2;

    this.ctx.stroke();

  }

}

  //------------------------------------------------

  private drawThrows(): void {

  for (const ball of this.throws) {

    if (
      this.filter === 'red' &&
      ball.color !== 'red'
    ) {
      continue;
    }

    if (
      this.filter === 'blue' &&
      ball.color !== 'blue'
    ) {
      continue;
    }

    //--------------------------------------------------
    // Línea al Jack (solo modo Precisión)
    //--------------------------------------------------

    if (
      this.heatMode === 'precision' &&
      this.jack
    ) {

      this.ctx.beginPath();

      this.ctx.moveTo(
        this.jack.x,
        this.jack.y
      );

      this.ctx.lineTo(
        ball.x,
        ball.y
      );

      this.ctx.strokeStyle = 'rgba(255,255,255,0.35)';

      this.ctx.lineWidth = 2;

      this.ctx.stroke();

    }

    //--------------------------------------------------
    // Bola
    //--------------------------------------------------

    this.ctx.beginPath();

    this.ctx.fillStyle =
      ball.color === 'red'
        ? '#E53935'
        : '#1E88E5';

    this.ctx.arc(
      ball.x,
      ball.y,
      14,
      0,
      Math.PI * 2
    );

    this.ctx.fill();

    this.ctx.strokeStyle = '#FFFFFF';

    this.ctx.lineWidth = 3;

    this.ctx.stroke();

  }

}

  //------------------------------------------------

  private buildHeatMatrix(): void {

  this.heatMatrix = [];

  for (let row = 0; row < this.ROWS; row++) {

    this.heatMatrix[row] = [];

    for (let col = 0; col < this.COLS; col++) {

      this.heatMatrix[row][col] = 0;

    }

  }

  const radius = 7;

  for (const ball of this.throws) {

    if (
      this.filter === 'red' &&
      ball.color !== 'red'
    ) {
      continue;
    }

    if (
      this.filter === 'blue' &&
      ball.color !== 'blue'
    ) {
      continue;
    }

    const col = Math.floor(ball.x / this.CELL_SIZE);

    const row = Math.floor(ball.y / this.CELL_SIZE);

    for (let r = row - radius; r <= row + radius; r++) {

      for (let c = col - radius; c <= col + radius; c++) {

        if (
          r < 0 ||
          c < 0 ||
          r >= this.ROWS ||
          c >= this.COLS
        ) {
          continue;
        }

        const dx = c - col;

        const dy = r - row;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {

          this.heatMatrix[r][c] += radius - distance;

        }

      }

    }

  }

}

  //------------------------------------------------

  private getHeatColor(value: number): string {

  if (value <= 0) {

    return 'transparent';

  }

  if (value < 2) {

    return 'rgba(255,255,0,0.20)';

  }

  if (value < 4) {

    return 'rgba(255,165,0,0.30)';

  }

  if (value < 7) {

    return 'rgba(255,80,0,0.45)';

  }

  return 'rgba(255,0,0,0.60)';

}

  //------------------------------------------------

  private drawHeatCells(): void {

  for (let row = 0; row < this.ROWS; row++) {

    for (let col = 0; col < this.COLS; col++) {

      const value = this.heatMatrix[row][col];

      if (value <= 0) {
        continue;
      }

      const centerX = col * this.CELL_SIZE + this.CELL_SIZE / 2;

      const centerY = row * this.CELL_SIZE + this.CELL_SIZE / 2;

      const radius = this.CELL_SIZE * 1.8;

      const alpha = Math.min(value / 8, 0.55);

      const gradient = this.ctx.createRadialGradient(

        centerX,

        centerY,

        0,

        centerX,

        centerY,

        radius

      );

      gradient.addColorStop(

        0,

        `rgba(255,0,0,${alpha})`

      );

      gradient.addColorStop(

        0.35,

        `rgba(255,120,0,${alpha*0.75})`

      );

      gradient.addColorStop(

        0.7,

        `rgba(255,255,0,${alpha*0.45})`

      );

      gradient.addColorStop(

        1,

        `rgba(255,255,0,0)`

      );

      this.ctx.beginPath();

      this.ctx.fillStyle = gradient;

      this.ctx.arc(

        centerX,

        centerY,

        radius,

        0,

        Math.PI * 2

      );

      this.ctx.fill();

    }

  }

}

  //------------------------------------------------

  private drawQualityMap(): void {

  for (const ball of this.throws) {

    if (
      this.filter === 'red' &&
      ball.color !== 'red'
    ) {
      continue;
    }

    if (
      this.filter === 'blue' &&
      ball.color !== 'blue'
    ) {
      continue;
    }

    let color = '';

    switch (ball.result) {

      case 'excellent':

        color = '#2dd36f';

        break;

      case 'good':

        color = '#3880ff';

        break;

      case 'regular':

        color = '#ffc409';

        break;

      case 'bad':

        color = '#eb445a';

        break;

      default:

        color = '#999999';

    }

    const gradient = this.ctx.createRadialGradient(

      ball.x,

      ball.y,

      0,

      ball.x,

      ball.y,

      70

    );

    gradient.addColorStop(

      0,

      color + 'AA'

    );

    gradient.addColorStop(

      0.5,

      color + '55'

    );

    gradient.addColorStop(

      1,

      color + '00'

    );

    this.ctx.beginPath();

    this.ctx.fillStyle = gradient;

    this.ctx.arc(

      ball.x,

      ball.y,

      70,

      0,

      Math.PI * 2

    );

    this.ctx.fill();

  }

}

  //------------------------------------------------

  private drawPrecisionMap(): void {

  const drawnJacks = new Set<string>();

  for (const ball of this.throws) {

    //-----------------------------------------
    // Filtros
    //-----------------------------------------

    if (
      this.filter === 'red' &&
      ball.color !== 'red'
    ) {
      continue;
    }

    if (
      this.filter === 'blue' &&
      ball.color !== 'blue'
    ) {
      continue;
    }

    if (!ball.jack) {
      continue;
    }

    //-----------------------------------------
    // Dibujar Jack (solo una vez)
    //-----------------------------------------

    const key =
      `${Math.round(ball.jack.x)}-${Math.round(ball.jack.y)}`;

    if (!drawnJacks.has(key)) {

      drawnJacks.add(key);

      this.ctx.beginPath();

      this.ctx.fillStyle = "#FFFFFF";

      this.ctx.arc(
        ball.jack.x,
        ball.jack.y,
        10,
        0,
        Math.PI * 2
      );

      this.ctx.fill();

      this.ctx.strokeStyle = "#666";

      this.ctx.lineWidth = 2;

      this.ctx.stroke();

    }

    //-----------------------------------------
    // Distancia
    //-----------------------------------------

    const dx = ball.x - ball.jack.x;

    const dy = ball.y - ball.jack.y;

    //-----------------------------------------
    // Color según RESULTADO
    //-----------------------------------------

    let color = "#999";

    switch (ball.result) {

      case 'excellent':

        color = "#2dd36f";

        break;

      case 'good':

        color = "#3880ff";

        break;

      case 'regular':

        color = "#ffc409";

        break;

      case 'bad':

        color = "#eb445a";

        break;

    }

    //-----------------------------------------
    // Línea
    //-----------------------------------------

    this.ctx.beginPath();

    this.ctx.moveTo(
      ball.jack.x,
      ball.jack.y
    );

    this.ctx.lineTo(
      ball.x,
      ball.y
    );

    this.ctx.strokeStyle = color;

    this.ctx.lineWidth = 4;

    this.ctx.stroke();

    //-----------------------------------------
    // Texto distancia
    //-----------------------------------------

    const mx = (ball.x + ball.jack.x) / 2;

    const my = (ball.y + ball.jack.y) / 2;

    this.ctx.fillStyle = "#FFFFFF";

    this.ctx.font = "bold 15px Arial";

    this.ctx.textAlign = "center";

    this.ctx.fillText(

      formatCourtDistance(pixelDistanceToMeters(dx, dy)),

      mx,

      my - 8

    );

    //-----------------------------------------
    // Halo
    //-----------------------------------------

    const gradient =
      this.ctx.createRadialGradient(

        ball.x,

        ball.y,

        0,

        ball.x,

        ball.y,

        55

      );

    gradient.addColorStop(
      0,
      color + "AA"
    );

    gradient.addColorStop(
      0.5,
      color + "55"
    );

    gradient.addColorStop(
      1,
      color + "00"
    );

    this.ctx.beginPath();

    this.ctx.fillStyle = gradient;

    this.ctx.arc(

      ball.x,

      ball.y,

      55,

      0,

      Math.PI * 2

    );

    this.ctx.fill();

    //-----------------------------------------
    // Bocha
    //-----------------------------------------

    this.ctx.beginPath();

    this.ctx.fillStyle =
      ball.color === "red"
        ? "#E53935"
        : "#1E88E5";

    this.ctx.arc(

      ball.x,

      ball.y,

      14,

      0,

      Math.PI * 2

    );

    this.ctx.fill();

    this.ctx.strokeStyle = "#FFFFFF";

    this.ctx.lineWidth = 3;

    this.ctx.stroke();

  }

}

  //------------------------------------------------

  private drawV(){

    const c=this.COURT;

    const y=c.y+c.vY;

    this.ctx.beginPath();

    this.ctx.moveTo(

      c.x,

      y-20

    );

    this.ctx.lineTo(

      c.x+c.width/2,

      y+80

    );

    this.ctx.lineTo(

      c.x+c.width,

      y-20

    );

    this.ctx.strokeStyle="white";

    this.ctx.lineWidth=5;

    this.ctx.stroke();

  }

  //------------------------------------------------

  private drawBoxes(){

    const c=this.COURT;

    const top=c.y+c.height-c.boxesHeight;

    const w=c.width/6;

    this.ctx.strokeStyle="white";

    this.ctx.lineWidth=3;

    for(let i=0;i<6;i++){

      this.ctx.strokeRect(

        c.x+i*w,

        top,

        w,

        c.boxesHeight

      );

      this.ctx.fillStyle="white";

      this.ctx.font="bold 30px Arial";

      this.ctx.textAlign="center";

      this.ctx.fillText(

        String(i+1),

        c.x+i*w+w/2,

        top+70

      );

    }

  }

  private drawSelectedBox(): void {

  if (this.selectedBox == null) {
    return;
  }

  const c = this.COURT;

  const width = c.width / 6;

  const top = c.y + c.height - c.boxesHeight;

  this.ctx.fillStyle = "rgba(33,150,243,0.35)";

  this.ctx.fillRect(

    c.x + (this.selectedBox - 1) * width,

    top,

    width,

    c.boxesHeight

  );

}

  selectHeatMode(
  mode: 'density' | 'quality' | 'precision'
): void {

  this.heatMode = mode;

  this.refresh();

}

selectFilter(
  filter: 'all' | 'red' | 'blue'
): void {

  this.filter = filter;

  this.refresh();

}

//------------------------------------------------
// VER DE A UNO
//------------------------------------------------

setViewMode(mode: 'all' | 'one-by-one'): void {

  this.viewMode = mode;

  this.currentIndex = 0;

  this.applyViewMode();

}

previousThrow(): void {

  if (this.currentIndex > 0) {

    this.currentIndex--;

    this.applyViewMode();

  }

}

nextThrow(): void {

  if (this.currentIndex < this.allThrows.length - 1) {

    this.currentIndex++;

    this.applyViewMode();

  }

}

private applyViewMode(): void {

  if (!this.ctx) {
    return;
  }

  if (this.viewMode === 'all') {

    this.throws = this.allThrows;

    this.render();

    return;

  }

  this.throws = this.allThrows.length
    ? [this.allThrows[this.currentIndex]]
    : [];

  this.renderSingleThrow();

}

private drawStaticCourt(): void {

  this.clear();

  this.drawBackground();

  this.drawBorder();

  this.drawCenterLine();

  this.drawTarget();

  this.drawV();

  this.drawBoxes();

  this.drawSelectedBox();

  this.drawDistanceRuler();

}

//------------------------------------------------
// REGLA DE DISTANCIAS (metros reales desde la línea de tiro)
//------------------------------------------------

private drawDistanceRuler(): void {

  const c = this.COURT;

  // 0 m = frente de las casas (línea de tiro), no el borde exterior
  // de la cancha; la distancia aumenta hacia el fondo.
  const baseY = COURT_THROW_LINE_Y;

  const maxMeters = Math.floor(COURT_MAX_LENGTH_M);

  const tickX = c.x - 6;

  // Se dibuja en el margen gris claro fuera de la cancha verde, así
  // que necesita un color oscuro (blanco ahí quedaba invisible).
  this.ctx.strokeStyle = '#4A5568';

  this.ctx.fillStyle = '#2D3748';

  this.ctx.font = 'bold 13px Arial';

  this.ctx.textAlign = 'right';

  this.ctx.textBaseline = 'middle';

  this.ctx.lineWidth = 1;

  for (let half = 1; half < maxMeters * 2; half += 2) {

    const y = baseY - (half / 2) * PIXELS_PER_METER_LENGTH;

    if (y < c.y) {
      break;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(tickX - 5, y);
    this.ctx.lineTo(tickX, y);
    this.ctx.stroke();

  }

  this.ctx.lineWidth = 2;

  for (let m = 1; m <= maxMeters; m++) {

    const y = baseY - m * PIXELS_PER_METER_LENGTH;

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

private drawDot(x: number, y: number, color: string): void {

  this.ctx.beginPath();

  this.ctx.fillStyle = color;

  this.ctx.arc(x, y, 14, 0, Math.PI * 2);

  this.ctx.fill();

  this.ctx.strokeStyle = '#FFFFFF';

  this.ctx.lineWidth = 2;

  this.ctx.stroke();

}

private ballColorHex(color: 'red' | 'blue'): string {

  return color === 'red' ? '#E53935' : '#1E88E5';

}

private renderSingleThrow(): void {

  const throwBall = this.throws[0];

  this.drawStaticCourt();

  if (!throwBall) {
    return;
  }

  const courtMode = this.evaluationType
    ? ANIMATED_MODE_BY_TYPE[this.evaluationType]
    : undefined;

  const result = courtMode && throwBall.jack
    ? resolveImpact(
        courtMode,
        throwBall.color,
        { x: throwBall.x, y: throwBall.y },
        { x: throwBall.jack.x, y: throwBall.jack.y },
        this.opponentBalls
      )
    : null;

  if (result) {

    this.playSingleImpactAnimation(throwBall, result);

    return;

  }

  // Sin animación que reproducir (tipo sin impacto, o el tiro no
  // llegó a tocar la bocha objetivo): se dibuja el resultado final.
  this.drawFinalFrame(throwBall);

}

private drawFinalFrame(throwBall: Throw): void {

  if (throwBall.jack) {

    this.drawDot(throwBall.jack.x, throwBall.jack.y, '#FFFFFF');

  }

  this.opponentBalls.forEach(ball => {

    this.drawDot(ball.x, ball.y, this.ballColorHex(ball.color));

  });

  this.drawDot(throwBall.x, throwBall.y, this.ballColorHex(throwBall.color));

}

private playSingleImpactAnimation(throwBall: Throw, result: ImpactResult): void {

  if (this.singleAnimationRunning) {
    return;
  }

  this.singleAnimationRunning = true;

  this.singleAnimationProgress = 0;

  this.singleImpactDX = result.direction.x;

  this.singleImpactDY = result.direction.y;

  const duration = 500;

  const start = performance.now();

  const step = (time: number) => {

    // El entrenador pudo haber cambiado de lanzamiento/modo mientras
    // corría la animación: si ya no corresponde, se corta.
    if (this.throws[0] !== throwBall) {

      this.singleAnimationRunning = false;

      return;

    }

    const elapsed = time - start;

    this.singleAnimationProgress = Math.min(elapsed / duration, 1);

    this.drawAnimatedFrame(throwBall, result);

    if (this.singleAnimationProgress < 1) {

      requestAnimationFrame(step);

    } else {

      this.singleAnimationRunning = false;

    }

  };

  requestAnimationFrame(step);

}

private drawAnimatedFrame(throwBall: Throw, result: ImpactResult): void {

  const progress = this.singleAnimationProgress;

  this.drawStaticCourt();

  let jackX = throwBall.jack!.x;

  let jackY = throwBall.jack!.y;

  if (result.moves === 'jack') {

    jackX += this.singleImpactDX * result.distance * progress;

    jackY += this.singleImpactDY * result.distance * progress;

  }

  this.drawDot(jackX, jackY, '#FFFFFF');

  this.opponentBalls.forEach((ball, index) => {

    let x = ball.x;

    let y = ball.y;

    if (result.moves === 'opponent' && index === result.opponentIndex) {

      x += this.singleImpactDX * result.distance * progress;

      y += this.singleImpactDY * result.distance * progress;

    }

    this.drawDot(x, y, this.ballColorHex(ball.color));

  });

  let bx = throwBall.x;

  let by = throwBall.y;

  if (result.moves === 'own') {

    bx += this.singleImpactDX * result.distance * progress;

    by += this.singleImpactDY * result.distance * progress;

  }

  this.drawDot(bx, by, this.ballColorHex(throwBall.color));

}

}