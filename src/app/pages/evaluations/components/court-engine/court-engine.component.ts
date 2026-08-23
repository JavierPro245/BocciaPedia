import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { CourtSelection } from '../../models/court-selection.model';
import { Throw } from '../../models/throw.model';
import { CourtMode } from '../../models/court-mode.model';
import { OpponentBall } from '../../models/opponent-ball.model';
import { Vec2 } from '../../engine/physics/vector';
import {
  ImpactResult,
  resolveImpact
} from '../../engine/physics/impact-resolver';
import {
  PIXELS_PER_METER_LENGTH,
  COURT_MAX_LENGTH_M,
  COURT_THROW_LINE_Y
} from '../../engine/physics/court-scale';

interface OpponentSetupConfig {
  count: number;
  roles: Array<'wall' | 'target' | undefined>;
  // Recibe el índice de colocación (0, 1, 2...) porque algunos modos
  // (Push On) necesitan una mezcla de bochas propias y rivales, no
  // todas del mismo color.
  color: (playerColor: 'red' | 'blue', index: number) => 'red' | 'blue';
}

@Component({
  selector: 'app-court-engine',
  templateUrl: './court-engine.component.html',
  styleUrls: ['./court-engine.component.scss'],
  standalone: false
})
export class CourtEngineComponent implements AfterViewInit, OnChanges {

  @Output() courtSelection = new EventEmitter<CourtSelection>();

  @Output()
  jackPending = new EventEmitter<{
    x: number;
    y: number;
    quadrant: string;
  }>();

  @Output() throwRegistered = new EventEmitter<Throw>();

  @Output()
  opponentSetupReady = new EventEmitter<OpponentBall[]>();

  // Se emite en cada bocha rival colocada (antes de completar el
  // total requerido), para que la página pueda refrescar el texto
  // de instrucción ("2 de 3", etc.).
  @Output()
  opponentBallPlaced = new EventEmitter<void>();

  @Input() ballColor:'red'|'blue'='red';

  @Input() locked = false;

  @Input()

mode: CourtMode = 'placement';

/**
 * Los lanzamientos ahora los controla EvaluationRun.
 * CourtEngine solo los dibuja.
 */
  @Input() throws: Throw[] = [];

  @ViewChild('courtCanvas',{static:true})
  canvas!:ElementRef<HTMLCanvasElement>;

  private ctx!:CanvasRenderingContext2D;

  private readonly WIDTH=600;

  private readonly HEIGHT=1200;

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

  //------------------------------------------------
  // ANIMACIÓN
  //------------------------------------------------

  private animationRunning = false;

  private animationProgress = 0;

  private animationFrame?: number;

  //------------------------------------------------
  // BOCHA ANIMADA
  //------------------------------------------------

  private animatedThrow?: Throw;

  //------------------------------------------------
  // VECTOR DE IMPACTO
  //------------------------------------------------

  private impactDX = 0;

  private impactDY = 0;

  ngOnChanges(changes: SimpleChanges): void {

  if (!this.ctx) {
    return;
  }

  if (changes['throws']) {
    this.render();
  }

}

  //------------------------------------------------

  // ESTADO

  //------------------------------------------------


  selectedBox:number|null=null;

  boxSelected = false;

  selectedQuadrant:'Q1'|'Q2'|'Q3'|'Q4'|null=null;

  jack={

    placed:false,

    x:0,

    y:0

  };

  opponentBalls: OpponentBall[] = [];

  private opponentDragIndex: number | null = null;

  private impactedBallIndex: number | null = null;

  private impactResult: ImpactResult | null = null;

  opponentSetupConfirmed = false;

  private readonly OPPONENT_BALL_RADIUS = 14;

  private readonly OPPONENT_SETUP: Record<CourtMode, OpponentSetupConfig> = {

    'first-ball': { count: 0, roles: [], color: () => 'red' },

    'placement': { count: 0, roles: [], color: () => 'red' },

    'smash': {
      count: 1,
      roles: [undefined],
      color: p => (p === 'red' ? 'blue' : 'red')
    },

    // 2 bochas rivales + la propia del deportista en el medio, para
    // empujarla. El entrenador acomoda las 3 con arrastre libre.
    'push-on': {
      count: 3,
      roles: [undefined, undefined, undefined],
      color: (p, index) => (index === 1 ? p : (p === 'red' ? 'blue' : 'red'))
    },

    // Bocha rival pegada al jack.
    'push-off': {
      count: 1,
      roles: [undefined],
      color: p => (p === 'red' ? 'blue' : 'red')
    },

    // Bocha rival pegada al jack (misma estructura que Push Off).
    'bochada': {
      count: 1,
      roles: [undefined],
      color: p => (p === 'red' ? 'blue' : 'red')
    },

    // Muro de 2 bochas rivales + 1 bocha rival suelta.
    'ricochet': {
      count: 3,
      roles: ['wall', 'wall', 'target'],
      color: p => (p === 'red' ? 'blue' : 'red')
    },

    // Sin física automática ni cantidad fija: el entrenador arma la
    // escena con los botones +Roja/+Azul (ver addCustomOpponentBall)
    // y arrastra libremente, tantas bochas como quiera.
    'custom': { count: 0, roles: [], color: () => 'red' }

  };

  getOpponentSetupConfig(): OpponentSetupConfig {

    return this.OPPONENT_SETUP[this.mode];

  }

  private currentStep:

'box'

|'jack'

|'opponent'

|'throw'

='box';

  private pendingJack = {

  placed:false,

  x:0,

  y:0

};

  private pendingThrow?: Throw;

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

  private suppressNextClick = false;

  //------------------------------------------------

  ngAfterViewInit(){

    this.initializeCanvas();

    this.render();

  }

  //------------------------------------------------

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

      'click',

      event=>this.onCanvasClick(event)

    );

    // Arrastre de bochas rivales durante el armado previo al tiro
    // (Push On/Off, Bochada, Ricochet). No interfiere con el click
    // de arriba: si el pointerdown no cae sobre una bocha ya
    // colocada, no hace nada y el click normal sigue su curso.
    canvas.addEventListener(
      'pointerdown',
      event => this.onCanvasPointerDown(event)
    );

    canvas.addEventListener(
      'pointermove',
      event => this.onCanvasPointerMove(event)
    );

    canvas.addEventListener(
      'pointerup',
      () => this.onCanvasPointerUp()
    );

    canvas.addEventListener(
      'pointerleave',
      () => this.onCanvasPointerUp()
    );

    // Zoom con pellizco de dos dedos + doble toque para restablecer.
    // No usa "pointer" porque necesita ver ambos dedos a la vez.
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

      // Si se estaba arrastrando una bocha con un dedo y aparece un
      // segundo dedo, se corta el arrastre para que no siga
      // "pegada" al puntero mientras se hace zoom.
      this.opponentDragIndex = null;

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

      // Doble toque restablece el zoom (sin necesidad de un botón
      // aparte, ya que se eligió solo pellizco + arrastre).
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

      // Algunos navegadores disparan un "click" sintético al soltar
      // los dedos de un pellizco; se ignora ese próximo click para
      // no colocar una bocha/jack sin querer en el punto medio.
      this.suppressNextClick = true;

    }

    if (event.touches.length < 2) {

      this.pinchState = null;

    }

  }

  private clampPan(): void {

    // Límite laxo: entre más zoom, más margen para desplazarse, sin
    // necesitar medir el tamaño exacto renderizado del canvas.
    const maxPan = 300 * (this.zoomScale - 1);

    this.panX = Math.min(maxPan, Math.max(-maxPan, this.panX));

    this.panY = Math.min(maxPan, Math.max(-maxPan, this.panY));

  }

  private applyTransform(): void {

    this.canvas.nativeElement.style.transform =
      `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomScale})`;

  }

  public resetZoom(): void {

    this.zoomScale = 1;

    this.panX = 0;

    this.panY = 0;

    this.applyTransform();

  }

  //------------------------------------------------

  private toCanvasPoint(clientX: number, clientY: number): Vec2 {

    const rect = this.canvas.nativeElement.getBoundingClientRect();

    const scaleX = this.WIDTH / rect.width;

    const scaleY = this.HEIGHT / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };

  }

  //------------------------------------------------
  // ARRASTRE DE BOCHAS RIVALES
  //------------------------------------------------

  private canDragOpponentBalls(): boolean {

    if (this.locked || this.pinchState !== null) {
      return false;
    }

    // Modo personalizado: las bochas se pueden reacomodar en
    // cualquier momento, no solo durante un paso "opponent" fijo.
    if (this.mode === 'custom') {
      return true;
    }

    return (
      this.currentStep === 'opponent' &&
      this.mode !== 'smash' &&
      !this.opponentSetupConfirmed
    );

  }

  private onCanvasPointerDown(event: PointerEvent): void {

    if (!this.canDragOpponentBalls()) {
      return;
    }

    const point = this.toCanvasPoint(event.clientX, event.clientY);

    const hitIndex = this.opponentBalls.findIndex(ball =>
      Math.hypot(ball.x - point.x, ball.y - point.y) <=
        this.OPPONENT_BALL_RADIUS
    );

    if (hitIndex !== -1) {

      this.opponentDragIndex = hitIndex;

      event.preventDefault();

    }

  }

  private onCanvasPointerMove(event: PointerEvent): void {

    if (this.opponentDragIndex === null) {
      return;
    }

    const point = this.toCanvasPoint(event.clientX, event.clientY);

    this.opponentBalls[this.opponentDragIndex] = {

      ...this.opponentBalls[this.opponentDragIndex],

      x: point.x,

      y: point.y

    };

    this.render();

  }

  private onCanvasPointerUp(): void {

    if (this.opponentDragIndex !== null) {

      // El "click" sintético que sigue a un arrastre no debe
      // registrarse como un lanzamiento (relevante en modo
      // "custom", donde no hay un paso "opponent" que absorba ese
      // click sobrante).
      this.suppressNextClick = true;

    }

    this.opponentDragIndex = null;

  }

  //------------------------------------------------
  // MODO PERSONALIZADO: bochas rivales libres
  //------------------------------------------------

  public addCustomOpponentBall(color: 'red' | 'blue'): void {

    const c = this.COURT;

    const index = this.opponentBalls.length;

    // Pequeño desplazamiento por bocha para que no queden todas
    // apiladas exactamente en el mismo punto; el entrenador las
    // termina de acomodar arrastrando.
    const offset = (index % 5) * 18;

    this.opponentBalls = [

      ...this.opponentBalls,

      {
        x: c.x + c.width / 2 - 40 + offset,
        y: c.y + c.height / 2 + offset,
        color,
        placed: true
      }

    ];

    this.render();

  }

  public removeLastCustomOpponentBall(): void {

    if (!this.opponentBalls.length) {
      return;
    }

    this.opponentBalls = this.opponentBalls.slice(0, -1);

    this.render();

  }

  //------------------------------------------------

  private onCanvasClick(event:MouseEvent){

    if (this.suppressNextClick) {

      this.suppressNextClick = false;

      return;

    }

    if(this.locked){

      return;

    }

    const { x, y } = this.toCanvasPoint(event.clientX, event.clientY);

    const c=this.COURT;

    const topBoxes=c.y+c.height-c.boxesHeight;

    if (!this.boxSelected && y < topBoxes) {

  alert('Debe seleccionar primero un Box.');

  return;

}

    //------------------------------------------------

    // BOX

    //------------------------------------------------

    if(y>=topBoxes){

      this.detectBox(x,y);

      return;

    }

    //------------------------------------------------
// JACK
//------------------------------------------------

if (this.currentStep === 'jack') {

  if (this.pendingJack.placed) {

    return;

  }

  this.placeJack(x, y);

  return;

}

//------------------------------------------------
// BOCHA RIVAL
//------------------------------------------------

if (this.currentStep === 'opponent') {

  if (this.mode === 'smash') {

    // Comportamiento original de Smash: un solo toque coloca la
    // bocha rival y pasa directo al tiro, sin arrastre ni confirmación.
    this.placeOpponentBall(x, y);

    this.currentStep = 'throw';

    return;

  }

  this.handleOpponentSetupTap(x, y);

  return;

}

//------------------------------------------------
// LANZAMIENTO
//------------------------------------------------

this.addThrow(x, y);

  }
//------------------------------------------------
// DETECTAR BOX
//------------------------------------------------

private detectBox(x:number,y:number){

  const c=this.COURT;

  const top=c.y+c.height-c.boxesHeight;

  const width=c.width/6;

  const index=Math.floor((x-c.x)/width);

  if(index<0 || index>5){
    return;
  }

  this.selectedBox=index+1;

  this.boxSelected = true;

  this.courtSelection.emit({

    box:this.selectedBox,

    x,

    y

  });

  this.render();

  this.currentStep = 'jack';

}

//------------------------------------------------
// COLOCAR JACK
//------------------------------------------------

private placeJack(x: number, y: number): void {

  this.pendingJack = {

    placed: true,

    x,

    y

  };

  const centerX = this.COURT.x + this.COURT.width / 2;

  const centerY = this.COURT.y + this.COURT.height / 2;

  if (y < centerY) {

    this.selectedQuadrant =
      x < centerX ? 'Q1' : 'Q2';

  } else {

    this.selectedQuadrant =
      x < centerX ? 'Q4' : 'Q3';

  }

  this.render();

  this.jackPending.emit({

    x,

    y,

    quadrant: this.selectedQuadrant!

  });

}

//------------------------------------------------
// COLOCAR BOCHA RIVAL
//------------------------------------------------

private placeOpponentBall(
  x: number,
  y: number
): void {

  this.opponentBalls = [{

    x,

    y,

    // Color contrario al jugador
    color: this.ballColor === 'red'
      ? 'blue'
      : 'red',

    placed: true

  }];

  this.render();

}

//------------------------------------------------
// COLOCAR / ARMAR BOCHAS RIVALES
// (Push On, Push Off, Bochada, Ricochet)
//------------------------------------------------

private handleOpponentSetupTap(x: number, y: number): void {

  const config = this.getOpponentSetupConfig();

  if (this.opponentBalls.length >= config.count) {

    // Ya están todas colocadas: solo se pueden arrastrar
    // (ver onCanvasPointerDown/Move), un toque nuevo no hace nada.
    return;

  }

  const index = this.opponentBalls.length;

  this.opponentBalls = [

    ...this.opponentBalls,

    {
      x,
      y,
      color: config.color(this.ballColor, index),
      placed: true,
      role: config.roles[index]
    }

  ];

  this.render();

  if (this.opponentBalls.length === config.count) {

    this.opponentSetupReady.emit([...this.opponentBalls]);

  } else {

    this.opponentBallPlaced.emit();

  }

}

public confirmOpponentSetup(): void {

  this.opponentSetupConfirmed = true;

  this.currentStep = 'throw';

  this.render();

}

public cancelOpponentSetup(): void {

  this.opponentBalls = [];

  this.opponentSetupConfirmed = false;

  this.render();

}

private getQuadrant(
  x: number,
  y: number
): 'Q1' | 'Q2' | 'Q3' | 'Q4' {

  const centerX =
    this.COURT.x + this.COURT.width / 2;

  const centerY =
    this.COURT.y + this.COURT.height / 2;

  if (y < centerY) {

    return x < centerX ? 'Q1' : 'Q2';

  }

  return x < centerX ? 'Q4' : 'Q3';

}

//------------------------------------------------

  public confirmJack(): void {

  if (!this.pendingJack.placed) {

    return;

  }

  this.jack = {

    ...this.pendingJack

  };

  this.pendingJack = {

    placed: false,

    x: 0,

    y: 0

  };

  this.courtSelection.emit({

    target: true,

    x: this.jack.x,

    y: this.jack.y,

    quadrant: this.selectedQuadrant!

  });

  //------------------------------------------------
  // CAMBIAR EL PASO SEGÚN LA EVALUACIÓN
  //------------------------------------------------

  if (this.getOpponentSetupConfig().count > 0) {

    this.currentStep = 'opponent';

  } else {

    this.currentStep = 'throw';

  }

  this.render();

}

  public cancelJack(): void {

  this.pendingJack = {

    placed: false,

    x: 0,

    y: 0

  };

  this.selectedQuadrant = null;

  this.render();

}

//------------------------------------------------
// REGISTRAR LANZAMIENTO
//------------------------------------------------

private addThrow(x: number, y: number): void {

  if (this.locked) {
    return;
  }

  this.pendingThrow = {

    id: Date.now(),

    throwNumber: this.throws.length + 1,

    x,

    y,

    color: this.ballColor,

    box: this.selectedBox ?? undefined,

    quadrant: this.getQuadrant(x, y),

    jack: {

      x: this.jack.x,

      y: this.jack.y,

      quadrant: this.selectedQuadrant!

    },

    result: 'good'

  };

  //------------------------------------------------
  // MODO SMASH
  //------------------------------------------------

  if (this.mode === 'smash') {

    this.animateImpact(

      x,

      y,

      () => {

        this.render();

        this.throwRegistered.emit(this.pendingThrow!);

      }

    );

    return;

  }

  //------------------------------------------------
  // PUSH ON / PUSH OFF / BOCHADA / RICOCHET
  //------------------------------------------------

  if (this.getOpponentSetupConfig().count > 0) {

    this.animateOpponentImpact(

      x,

      y,

      () => {

        this.render();

        this.throwRegistered.emit(this.pendingThrow!);

      }

    );

    return;

  }

  //------------------------------------------------
  // RESTO DE EVALUACIONES
  //------------------------------------------------

  this.render();

  this.throwRegistered.emit(this.pendingThrow);

}

//------------------------------------------------
// ANIMAR IMPACTO CONTRA BOCHA(S) RIVAL(ES)
// (Push On, Push Off, Bochada, Ricochet) — la decisión de qué
// impactó y qué debe animarse vive en engine/physics/impact-resolver
// (función pura), compartida con el heatmap para poder reproducir
// exactamente la misma animación al revisar un lanzamiento.
//------------------------------------------------

private animateOpponentImpact(
  throwX: number,
  throwY: number,
  callback?: () => void
): void {

  if (!this.pendingThrow || this.animationRunning) {
    return;
  }

  this.animatedThrow = { ...this.pendingThrow };

  const impactPoint: Vec2 = { x: throwX, y: throwY };

  const result = resolveImpact(
    this.mode,
    this.ballColor,
    impactPoint,
    { x: this.jack.x, y: this.jack.y },
    this.opponentBalls
  );

  if (!result) {

    // El tiro no llegó a tocar la bocha objetivo: se registra como
    // un lanzamiento normal, sin animación de impacto.
    this.animatedThrow = undefined;

    if (callback) {
      callback();
    }

    return;

  }

  this.impactResult = result;

  this.impactedBallIndex = result.opponentIndex;

  this.impactDX = result.direction.x;

  this.impactDY = result.direction.y;

  this.animationRunning = true;

  this.animationProgress = 0;

  const duration = 500;

  const start = performance.now();

  const step = (time: number) => {

    const elapsed = time - start;

    this.animationProgress = Math.min(elapsed / duration, 1);

    this.render();

    if (this.animationProgress < 1) {

      requestAnimationFrame(step);

    } else {

      this.animationRunning = false;

      this.animationProgress = 0;

      this.animatedThrow = undefined;

      this.impactedBallIndex = null;

      this.impactResult = null;

      if (callback) {
        callback();
      }

    }

  };

  requestAnimationFrame(step);

}

private render(){

  this.clear();

  this.drawBackground();

  this.drawBorder();

  this.drawCenterLine();

  this.drawTarget();

  this.drawV();

  this.drawBoxes();

  this.drawSelectedBox();

  this.drawDistanceRuler();

  this.drawJack();

  // NUEVO
  this.drawOpponentBall();

  this.drawThrows();

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

  // Marcas menores cada 0,5 m, sin etiqueta (para ubicar distancias
  // intermedias como 7,5 m).
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

  // Marcas principales cada 1 m, con etiqueta.
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

private drawTarget(): void {

  const c = this.COURT;

  const size = c.targetSize;

  // Centrado a 5 m de la línea de tiro (frente de las casas).
  const x = c.x + c.width / 2 - size / 2;

  const y = 370;

  this.ctx.strokeStyle = "#FFFFFF";

  this.ctx.lineWidth = 5;

  this.ctx.strokeRect(
    x,
    y,
    size,
    size
  );

  this.ctx.beginPath();

  this.ctx.moveTo(
    x + size / 2,
    y
  );

  this.ctx.lineTo(
    x + size / 2,
    y + size
  );

  this.ctx.moveTo(
    x,
    y + size / 2
  );

  this.ctx.lineTo(
    x + size,
    y + size / 2
  );

  this.ctx.stroke();

}

private drawOpponentBall(): void {

  this.opponentBalls.forEach((ball, index) => {

    if (!ball.placed) {
      return;
    }

    let x = ball.x;

    let y = ball.y;

    // Cada modo evalúa una bocha distinta, y esa es la que se anima:
    // - Smash: conserva su animación original (sin cambios).
    // - Push On/Off: se está evaluando si el deportista logra
    //   desplazar esta bocha (propia o rival), así que es la que se
    //   mueve — la bocha del deportista queda donde tocó.
    // - Bochada: lo que se separa/mueve es el jack (ver drawJack),
    //   esta bocha rival queda estática.
    // - Ricochet: se está evaluando dónde termina la bocha del
    //   deportista, así que esta queda estática (ver drawThrows).
    const shouldDisplace = this.animationRunning && (
      this.mode === 'smash' ||
      (this.impactResult?.moves === 'opponent' && index === this.impactedBallIndex)
    );

    if (shouldDisplace) {

      const travelDistance = this.mode === 'smash' ? 45 : (this.impactResult?.distance ?? 0);

      x += this.impactDX * travelDistance * this.animationProgress;

      y += this.impactDY * travelDistance * this.animationProgress;

    }

    this.drawBall(

      x,

      y,

      14,

      ball.color === 'red'
        ? '#E53935'
        : '#1E88E5'

    );

  });

}
//------------------------------------------------
// DIBUJAR BOCHA
//------------------------------------------------

private drawBall(

  x: number,

  y: number,

  radius: number,

  fillColor: string,

  borderColor: string = '#FFFFFF',

  borderWidth: number = 2,

  dashed: boolean = false

): void {

  this.ctx.beginPath();

  if (dashed) {

    this.ctx.setLineDash([8, 6]);

  } else {

    this.ctx.setLineDash([]);

  }

  this.ctx.fillStyle = fillColor;

  this.ctx.arc(

    x,

    y,

    radius,

    0,

    Math.PI * 2

  );

  this.ctx.fill();

  this.ctx.strokeStyle = borderColor;

  this.ctx.lineWidth = borderWidth;

  this.ctx.stroke();

  this.ctx.setLineDash([]);

}

private drawJack(): void {

  //------------------------------------------------
  // JACK PENDIENTE
  //------------------------------------------------

  if (this.pendingJack.placed) {

    this.drawBall(

      this.pendingJack.x,

      this.pendingJack.y,

      12,

      "#FFD54F",

      "#666666"

    );

  }

  //------------------------------------------------
  // JACK CONFIRMADA
  //------------------------------------------------

  if (!this.jack.placed) {

    return;

  }

  let x = this.jack.x;

  let y = this.jack.y;

  // Durante la animación la Jack se desplaza en Smash (sin cambios)
  // y en Bochada (ahí se está separando el jack de la bocha rival
  // pegada a él, así que es el jack el que se mueve, según lo
  // resuelto por impact-resolver). En los demás modos nuevos el jack
  // se queda fijo.
  const jackMoves = this.animationRunning && (
    this.mode === 'smash' ||
    this.impactResult?.moves === 'jack'
  );

  if (jackMoves) {

  const distance = this.mode === 'smash' ? 25 : (this.impactResult?.distance ?? 0);

  x += this.impactDX
      * distance
      * this.animationProgress;

  y += this.impactDY
      * distance
      * this.animationProgress;

}

  this.drawBall(

    x,

    y,

    10,

    "#FFFFFF",

    "#666666"

  );

}

private drawThrows(): void {

  //------------------------------------------------
  // BOCHAS CONFIRMADAS
  //------------------------------------------------

  this.throws.forEach(ball => {

    this.drawBall(

      ball.x,

      ball.y,

      14,

      ball.color === 'red'
        ? '#E53935'
        : '#1E88E5'

    );

  });

  //------------------------------------------------
  // BOCHA ANIMADA
  //------------------------------------------------

  if (this.animationRunning && this.animatedThrow) {

    // La bocha del deportista solo "viaja" en Smash (sin cambios) y
    // en Ricochet (moves === 'own', hasta el jack). En Push On/Off y
    // Bochada se evalúa la otra bocha (ver drawOpponentBall/drawJack)
    // — la del deportista queda fija donde tocó.
    const ownMoves =
      this.mode === 'smash' ||
      this.impactResult?.moves === 'own';

    if (!ownMoves) {

      this.drawBall(

        this.animatedThrow.x,

        this.animatedThrow.y,

        14,

        this.animatedThrow.color === 'red'
          ? '#E53935'
          : '#1E88E5'

      );

      return;

    }

    const distance = this.mode === 'smash'
      ? 120
      : (this.impactResult?.distance ?? 0);

    const x =
      this.animatedThrow.x +
      this.impactDX *
      distance *
      this.animationProgress;

    const y =
      this.animatedThrow.y +
      this.impactDY *
      distance *
      this.animationProgress;

    this.drawBall(

      x,

      y,

      14,

      this.animatedThrow.color === 'red'
        ? '#E53935'
        : '#1E88E5'

    );

    return;

  }

  //------------------------------------------------
  // BOCHA PENDIENTE
  //------------------------------------------------

  if (!this.pendingThrow) {

    return;

  }

  this.drawBall(

    this.pendingThrow.x,

    this.pendingThrow.y,

    14,

    this.pendingThrow.color === 'red'
      ? '#E53935'
      : '#1E88E5',

    '#FFFFFF',

    2,

    true

  );

}

//------------------------------------------------
// LIMPIAR
//------------------------------------------------

private clear(): void {

  this.ctx.clearRect(
    0,
    0,
    this.WIDTH,
    this.HEIGHT
  );

}

//------------------------------------------------
// FONDO
//------------------------------------------------

private drawBackground(): void {

  const c = this.COURT;

  this.ctx.fillStyle = "#ECECEC";

  this.ctx.fillRect(

    c.x - 18,

    c.y - 18,

    c.width + 36,

    c.height + 36

  );

  const gradient = this.ctx.createLinearGradient(

    0,

    c.y,

    0,

    c.y + c.height

  );

  gradient.addColorStop(0, "#3BCB61");

  gradient.addColorStop(1, "#2FAF52");

  this.ctx.fillStyle = gradient;

  this.ctx.fillRect(

    c.x,

    c.y,

    c.width,

    c.height

  );

}

//------------------------------------------------
// BORDE
//------------------------------------------------

private drawBorder(): void {

  const c = this.COURT;

  this.ctx.strokeStyle = "white";

  this.ctx.lineWidth = 5;

  this.ctx.strokeRect(

    c.x,

    c.y,

    c.width,

    c.height

  );

}

//------------------------------------------------
// LINEA CENTRAL
//------------------------------------------------

private drawCenterLine(): void {

  const c = this.COURT;

  this.ctx.strokeStyle = "#5AD66F";

  this.ctx.lineWidth = 2;

  this.ctx.setLineDash([8,8]);

  this.ctx.beginPath();

  this.ctx.moveTo(

    c.x + c.width/2,

    c.y

  );

  this.ctx.lineTo(

    c.x + c.width/2,

    c.y + c.height

  );

  this.ctx.stroke();

  this.ctx.setLineDash([]);

}

//------------------------------------------------
// V CENTRAL
//------------------------------------------------

private drawV(): void {

  const c = this.COURT;

  const y = c.vY;

  this.ctx.strokeStyle = "#FFFFFF";

  this.ctx.lineWidth = 5;

  this.ctx.beginPath();

  this.ctx.moveTo(
    c.x,
    y
  );

  this.ctx.lineTo(
    c.x + c.width / 2,
    y + 120
  );

  this.ctx.lineTo(
    c.x + c.width,
    y
  );

  this.ctx.stroke();

}

//------------------------------------------------
// BOXES
//------------------------------------------------

private drawBoxes(): void {

  const c = this.COURT;

  const top = c.y + c.height - c.boxesHeight;

  const width = c.width / 6;

  this.ctx.strokeStyle = "#FFFFFF";

  this.ctx.lineWidth = 4;

  // Línea superior
  this.ctx.beginPath();

  this.ctx.moveTo(c.x, top);

  this.ctx.lineTo(c.x + c.width, top);

  this.ctx.stroke();

  // Divisiones
  for (let i = 0; i <= 6; i++) {

    const x = c.x + width * i;

    this.ctx.beginPath();

    this.ctx.moveTo(x, top);

    this.ctx.lineTo(x, c.y + c.height);

    this.ctx.stroke();

  }

  // Números
  this.ctx.fillStyle = "#FFFFFF";

  this.ctx.font = "bold 28px Arial";

  this.ctx.textAlign = "center";

  this.ctx.textBaseline = "middle";

  for (let i = 0; i < 6; i++) {

    this.ctx.fillText(

      String(i + 1),

      c.x + width * i + width / 2,

      top + 35

    );

  }

}

//------------------------------------------------
// BOX SELECCIONADO
//------------------------------------------------

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

public confirmThrow(): void {

  this.pendingThrow = undefined;

  this.render();

}

public cancelThrow(): void {

  this.pendingThrow = undefined;

  this.render();

}

//==================================================
// REINICIAR INTENTO (FIRST BALL)
// Mantiene el Box seleccionado
// Elimina Jack y bochas
//==================================================

public resetAttempt(): void {

  // Mantener Box

  this.jack = {

    placed: false,

    x: 0,

    y: 0

  };

  this.pendingJack = {

    placed: false,

    x: 0,

    y: 0

  };

  this.opponentBalls = [];

  this.opponentSetupConfirmed = false;

  this.impactedBallIndex = null;

  this.impactResult = null;

  this.selectedQuadrant = null;

  this.pendingThrow = undefined;

  this.throws = [];

  this.currentStep = 'jack';

  this.render();

}

//------------------------------------------------
// ANIMAR IMPACTO
//------------------------------------------------

private animateImpact(
  throwX: number,
  throwY: number,
  callback?: () => void
): void {

  if (!this.pendingThrow) {
    return;
  }

  if (this.animationRunning) {
    return;
  }

  //------------------------------------------------
  // Guardar una copia de la bocha para animarla
  //------------------------------------------------

  this.animatedThrow = {

    ...this.pendingThrow

  };

  //------------------------------------------------
  // Dirección del impacto
  //------------------------------------------------

  const dx = this.jack.x - throwX;

  const dy = this.jack.y - throwY;

  const length =
    Math.sqrt(dx * dx + dy * dy) || 1;

  this.impactDX = dx / length;

  this.impactDY = dy / length;

  //------------------------------------------------

  this.animationRunning = true;

  this.animationProgress = 0;

  const duration = 500;

  const start = performance.now();

  const step = (time: number) => {

    const elapsed = time - start;

    this.animationProgress =
      Math.min(elapsed / duration, 1);

    this.render();

    if (this.animationProgress < 1) {

      requestAnimationFrame(step);

    } else {

      this.animationRunning = false;

      this.animationProgress = 0;

      this.animatedThrow = undefined;

      if (callback) {

        callback();

      }

    }

  };

  requestAnimationFrame(step);

}

}