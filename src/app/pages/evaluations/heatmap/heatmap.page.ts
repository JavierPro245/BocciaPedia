import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Throw } from '../models/throw.model';
import { EvaluationService } from 'src/app/services/evaluation.service';

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

  constructor(
    private evaluationService: EvaluationService
) {}

  ngAfterViewInit(): void {

  const evaluation = this.evaluationService.getEvaluation();

  console.log('EVALUATION', evaluation);
console.log('SELECTED BOX', evaluation?.selectedBox);

  if (evaluation) {

    this.throws = evaluation.throwList ?? [];

    this.jack = evaluation.jack;

    this.selectedBox = evaluation.selectedBox;

  }

  this.initializeCanvas();

  this.render();

}

refresh(): void {

  this.render();

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

  }

  private render(){

    this.clear();

    this.drawBackground();

    switch(this.heatMode){

  case 'density':

    this.buildHeatMatrix();

    this.drawHeatCells();

    break;

  case 'quality':

    this.drawQualityMap();

    break;

  case 'precision':

    this.drawPrecisionMap();

    break;

}

    this.drawBorder();

this.drawCenterLine();

this.drawTarget();

this.drawV();

this.drawBoxes();

this.drawSelectedBox();

this.drawJack();

this.drawThrows();

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

    const y=250;

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

  private drawJack(){

  if(!this.jack){
    return;
  }

  this.ctx.beginPath();

  this.ctx.fillStyle="#FFFFFF";

  this.ctx.arc(

    this.jack.x,

    this.jack.y,

    11,

    0,

    Math.PI*2

  );

  this.ctx.fill();

  this.ctx.strokeStyle="#777";

  this.ctx.lineWidth=2;

  this.ctx.stroke();

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

  if (!this.jack) {
    return;
  }

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

    const dx = ball.x - this.jack.x;

    const dy = ball.y - this.jack.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    let color = '';

    if (distance <= 50) {

      color = '#2dd36f';

    }
    else if (distance <= 100) {

      color = '#3880ff';

    }
    else if (distance <= 150) {

      color = '#ffc409';

    }
    else {

      color = '#eb445a';

    }

    const gradient = this.ctx.createRadialGradient(

      ball.x,

      ball.y,

      0,

      ball.x,

      ball.y,

      70

    );

    gradient.addColorStop(0, color + 'AA');

    gradient.addColorStop(0.5, color + '55');

    gradient.addColorStop(1, color + '00');

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

}