export interface SimulationObject {

  x: number;

  y: number;

  radius: number;

}

export class SimulationEngine {

  private objects: SimulationObject[] = [];

  private running = false;

  //------------------------------------------------
  // REGISTRAR OBJETOS
  //------------------------------------------------

  add(object: SimulationObject): void {

    this.objects.push(object);

  }

  clear(): void {

    this.objects = [];

  }

  //------------------------------------------------
  // ESTADO
  //------------------------------------------------

  get isRunning(): boolean {

    return this.running;

  }

  //------------------------------------------------
  // SIMULACIÓN
  //------------------------------------------------

  start(
    update: () => void,
    finished: () => void
  ): void {

    this.running = true;

    const start = performance.now();

    const duration = 500;

    const loop = (time: number) => {

      const progress = Math.min(

        (time - start) / duration,

        1

      );

      update();

      if (progress < 1) {

        requestAnimationFrame(loop);

      } else {

        this.running = false;

        finished();

      }

    };

    requestAnimationFrame(loop);

  }

}