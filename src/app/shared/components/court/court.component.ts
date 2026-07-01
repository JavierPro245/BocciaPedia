import {
AfterViewInit,
Component,
ElementRef,
ViewChild
} from '@angular/core';

@Component({
selector:'app-court',
templateUrl:'./court.component.html',
styleUrls:['./court.component.scss'],
standalone:false
})

export class CourtComponent implements AfterViewInit{

@ViewChild('courtCanvas',{static:true})

canvas!:ElementRef<HTMLCanvasElement>;

private ctx!:CanvasRenderingContext2D;

ngAfterViewInit(){

this.initializeCanvas();

this.drawCourt();

}

private initializeCanvas(){

const canvas=this.canvas.nativeElement;

canvas.width=600;

canvas.height=1200;

const context=canvas.getContext('2d');

if(!context){

return;

}

this.ctx=context;

}

private drawCourt(){

const ctx=this.ctx;

ctx.clearRect(0,0,600,1200);

ctx.fillStyle='#28B44B';

ctx.fillRect(40,40,520,1120);

ctx.strokeStyle='white';

ctx.lineWidth=6;

ctx.strokeRect(40,40,520,1120);

}

}
