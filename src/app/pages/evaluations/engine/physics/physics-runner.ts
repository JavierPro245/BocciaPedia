import { PhysicsEngine } from './physics-engine';

export class PhysicsRunner{

  constructor(

    private physics:PhysicsEngine,

    private render:()=>void,

    private finished:()=>void

  ){}

  private last=0;

  start(){

    this.last=performance.now();

    requestAnimationFrame(this.loop);

  }

  private loop=(time:number)=>{

    const dt=(time-this.last)/16.6;

    this.last=time;

    this.physics.update(dt);

    this.render();

    if(this.physics.running){

      requestAnimationFrame(this.loop);

    }else{

      this.finished();

    }

  }

}