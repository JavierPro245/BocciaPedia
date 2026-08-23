// Cancha oficial de Boccia — medidas según capturas/Cancha_Boccia.jpg,
// confirmadas por el usuario:
//   - Ancho: 6,00 m (6 casas de 1 m cada una)
//   - Casas de lanzamiento: 2,50 m de profundidad
//   - La distancia se mide desde ADELANTE de las casas (0 m ahí, no
//     desde el fondo de toda la cancha) — la zona de juego restante
//     son 10 m (12,5 - 2,5), no 12,5.
//   - Punta de la V: 1,5 m desde el frente de las casas
//   - La V se abre del todo a los 3 m
//   - Cruz del medio: a 5 m del frente de las casas
//
// La V y el cuadrado blanco del canvas no estaban dibujados a escala
// real (eran posiciones puestas "a ojo"), así que la escala se
// calibra para que los 10 m de zona de juego llenen exactamente el
// espacio dibujado entre el frente de las casas y el fondo de la
// cancha — y la V/el cuadrado se reposicionan en base a esa escala
// (ver CourtEngineComponent, HeatmapPage y EvaluationPdfService: vY
// y el "y"/"targetY" de drawTarget).

const COURT_REAL_WIDTH_M = 6.0;

const COURT_PIXEL_WIDTH = 500;

const SCALE_X = COURT_REAL_WIDTH_M / COURT_PIXEL_WIDTH;

const COURT_PIXEL_LENGTH = 1000;

const BOX_PIXEL_HEIGHT = 240;

// Origen del área de juego dentro del canvas (600x1200), igual que
// COURT.y/COURT.height en CourtEngineComponent y HeatmapPage.
const COURT_ORIGIN_Y = 40;

// 0 m = frente de las casas (borde entre las casas y la cancha
// principal), no el borde exterior de todo el rectángulo.
export const COURT_THROW_LINE_Y = COURT_ORIGIN_Y + COURT_PIXEL_LENGTH - BOX_PIXEL_HEIGHT;

// Los 10 m de zona de juego llenan el espacio entre el frente de las
// casas y el fondo de la cancha (el resto del canvas hacia arriba).
const PLAYING_ZONE_REAL_LENGTH_M = 10.0;

const PLAYING_ZONE_PIXEL_LENGTH = COURT_THROW_LINE_Y - COURT_ORIGIN_Y;

export const PIXELS_PER_METER_LENGTH = PLAYING_ZONE_PIXEL_LENGTH / PLAYING_ZONE_REAL_LENGTH_M;

const SCALE_Y = 1 / PIXELS_PER_METER_LENGTH;

export const COURT_MAX_LENGTH_M = PLAYING_ZONE_REAL_LENGTH_M;

export function pixelDistanceToMeters(dx: number, dy: number): number {

  const realDx = dx * SCALE_X;

  const realDy = dy * SCALE_Y;

  return Math.sqrt(realDx * realDx + realDy * realDy);

}

// Distancia real (m) desde la línea de tiro (frente de las casas)
// hasta un punto y (coordenadas del canvas 600x1200) — es lo que
// mide la regla dibujada al costado de la cancha.
export function metersFromThrowLine(y: number): number {

  return pixelDistanceToMeters(0, COURT_THROW_LINE_Y - y);

}

export function formatCourtDistance(meters: number): string {

  if (meters < 1) {
    return `${Math.round(meters * 100)} cm`;
  }

  return `${meters.toFixed(2)} m`;

}
