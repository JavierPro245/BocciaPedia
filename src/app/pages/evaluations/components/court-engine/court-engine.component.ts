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

  @Input() ballColor:'red'|'blue'='red';

  @Input() locked = false;

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

    vY:600

  };

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

  private pendingJack = {

  placed:false,

  x:0,

  y:0

};

  private pendingThrow?: Throw;

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

  }

  //------------------------------------------------

  private onCanvasClick(event:MouseEvent){

    if(this.locked){

      return;

    }

    const rect=this.canvas.nativeElement.getBoundingClientRect();

    const scaleX=this.WIDTH/rect.width;

    const scaleY=this.HEIGHT/rect.height;

    const x=(event.clientX-rect.left)*scaleX;

    const y=(event.clientY-rect.top)*scaleY;

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

    //------------------------------------------------
// JACK
//------------------------------------------------

if (!this.jack.placed) {

  if (this.pendingJack.placed) {

    return;

  }

  this.placeJack(x, y);

  return;

}

    //------------------------------------------------

    // THROW

    //------------------------------------------------

    this.addThrow(x,y);

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

    quadrant: this.getQuadrant(x, y),

    result: 'good'

  };

  this.render();

  this.throwRegistered.emit(this.pendingThrow);

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

  this.drawJack();

  this.drawThrows();

}

private drawTarget(): void {

  const c = this.COURT;

  const size = c.targetSize;

  // Posición fija del cuadrado
  const x = c.x + c.width / 2 - size / 2;

  const y = 290;

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

private drawJack(): void {

  if (this.pendingJack.placed) {

    this.ctx.beginPath();

    this.ctx.fillStyle = "#FFD54F";

    this.ctx.arc(

      this.pendingJack.x,

      this.pendingJack.y,

      12,

      0,

      Math.PI * 2

    );

    this.ctx.fill();

  }

  if (!this.jack.placed) {

    return;

  }

  this.ctx.beginPath();

  this.ctx.fillStyle = "#FFFFFF";

  this.ctx.arc(

    this.jack.x,

    this.jack.y,

    10,

    0,

    Math.PI * 2

  );

  this.ctx.fill();

  this.ctx.strokeStyle = "#666";

  this.ctx.lineWidth = 2;

  this.ctx.stroke();

}

private drawThrows(): void {

  for (const ball of this.throws) {

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

  //--------------------------------------------------
// Lanzamiento temporal
//--------------------------------------------------

if (this.pendingThrow) {

  this.ctx.beginPath();

  this.ctx.fillStyle =
    this.pendingThrow.color === 'red'
      ? 'rgba(229,57,53,0.55)'
      : 'rgba(30,136,229,0.55)';

  this.ctx.arc(
    this.pendingThrow.x,
    this.pendingThrow.y,
    14,
    0,
    Math.PI * 2
  );

  this.ctx.fill();

  this.ctx.strokeStyle = '#FFFFFF';

  this.ctx.lineWidth = 2;

  this.ctx.setLineDash([6,4]);

  this.ctx.stroke();

  this.ctx.setLineDash([]);

}

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

}