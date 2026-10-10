export interface EndResult {

  end: number;

  redScore: number;

  blueScore: number;

  winner: 'red' | 'blue' | 'tie';

  // Segundos de su reloj que usó cada equipo en este parcial
  // (secondsPerPlayer - tiempo restante al cerrar el END).
  redTimeUsed: number;

  blueTimeUsed: number;

}