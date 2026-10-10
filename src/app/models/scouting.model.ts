export type ScoutingPlayAction =
  | 'First Ball'
  | 'Placement'
  | 'Push On'
  | 'Push Off'
  | 'Ricochet'
  | 'Smash'
  | 'Bochada'
  | 'Otro';

export type ScoutingPlayOutcome = 'success' | 'fail';

export interface ScoutingBall {

  x: number;

  y: number;

  color: 'red' | 'blue';

}

export interface ScoutingPlay {

  id: number;

  x: number;

  y: number;

  // Foto de la cancha al momento de registrar la jugada (jack +
  // bochas propias/rivales), para poder revisar el partido jugada
  // por jugada. Opcionales por compatibilidad con jugadas antiguas
  // que solo guardaban un punto (x, y).
  jack?: { x: number; y: number };

  balls?: ScoutingBall[];

  action: ScoutingPlayAction;

  outcome: ScoutingPlayOutcome;

  note: string;

  mediaUrl?: string;

  mediaType?: 'photo' | 'video';

  createdAt: Date;

}

export interface ScoutingReport {

  id?: string;

  trainerId: string;

  // Deportista propio observado en este partido. Es texto libre (no
  // un id del listado de deportistas del entrenador): el scouting
  // puede ser de un partido entre dos jugadores externos que no
  // tienen ninguna relación con el entrenador. Opcional por
  // compatibilidad con reportes creados antes de agregar este campo.
  athleteName?: string;

  // Color que usó el deportista propio en este partido; el rival usa
  // el color contrario. Se fija una sola vez al crear/editar el
  // reporte y aplica a todas las jugadas que se registren en él.
  ownColor?: 'red' | 'blue';

  opponentName: string;

  opponentCountry: string;

  category?: string;

  notes?: string;

  plays: ScoutingPlay[];

  date: Date;

  updatedAt?: Date;

}
