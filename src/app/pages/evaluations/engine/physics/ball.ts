export type BallColor =
  | 'red'
  | 'blue'
  | 'white';

export class Ball {

  constructor(

    public x: number,

    public y: number,

    public radius: number,

    public color: BallColor

  ) {}

  //------------------------------------------------
  // Física
  //------------------------------------------------

  vx = 0;

  vy = 0;

  mass = 1;

  moving = false;

  //------------------------------------------------
  // Utilidades
  //------------------------------------------------

  get speed(): number {

    return Math.sqrt(

      this.vx * this.vx +

      this.vy * this.vy

    );

  }

  stop(): void {

    this.vx = 0;

    this.vy = 0;

    this.moving = false;

  }

  applyVelocity(dt: number): void {

    this.x += this.vx * dt;

    this.y += this.vy * dt;

  }

  applyFriction(amount = 0.985): void {

    this.vx *= amount;

    this.vy *= amount;

    if (this.speed < 0.05) {

      this.stop();

    }

  }

}