import { Ball } from './ball';

export class PhysicsEngine {

  private balls: Ball[] = [];

  add(ball: Ball): void {

    this.balls.push(ball);

  }

  clear(): void {

    this.balls = [];

  }

  update(dt: number): void {

    this.balls.forEach(ball => {

      if (!ball.moving) {

        return;

      }

      //-------------------------
      // mover
      //-------------------------

      ball.x += ball.vx * dt;

      ball.y += ball.vy * dt;

      //-------------------------
      // fricción
      //-------------------------

      ball.vx *= 0.985;

      ball.vy *= 0.985;

      //-------------------------

      if (

        Math.abs(ball.vx) < 0.02 &&

        Math.abs(ball.vy) < 0.02

      ){

        ball.stop();

      }

    });

  }

  get running(): boolean{

    return this.balls.some(

      b=>b.moving

    );

  }

}