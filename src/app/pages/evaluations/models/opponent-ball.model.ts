export interface OpponentBall {

  x: number;

  y: number;

  color: 'red' | 'blue';

  placed: boolean;

  // Solo se usa en Ricochet: 'wall' son las dos bochas pegadas que
  // forman el muro, 'target' es la bocha suelta a la que se le
  // pega para que rebote en el muro hacia el jack.
  role?: 'wall' | 'target';

}