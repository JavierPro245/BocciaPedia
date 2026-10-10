import { EndResult } from './end-result.model';

export type MatchState =

'waiting'
| 'red-turn'
| 'blue-turn'
| 'rest'
| 'finished';

// Una falta/penalización asignada por el árbitro. Se guardan todas las
// del partido en una lista (no solo una), para permitir más de una por
// parcial: cada una se resuelve de forma independiente.
export interface Penalty {

  id: string;

  team: 'red' | 'blue';

  // END en el que se marcó la falta (para mostrar historial por parcial).
  end: number;

  // true mientras está pendiente de ejecutarse.
  active: boolean;

  // true una vez que el árbitro resolvió si la logró o no.
  executed: boolean;

  timeRemaining: number;

  success: boolean | null;

}

export interface Match{

  id:string;

  redPlayerId:string;

  redPlayer:string;

  bluePlayerId:string;

  bluePlayer:string;

  category:'BC1'|'BC2'|'BC3'|'BC4';

  gender: 'male' | 'female' | 'mixed';

  // Bandera del país o escudo del club de cada lado, a elección del
  // usuario al crear el partido (no es obligatorio). '' = sin imagen
  // (Firestore no acepta `undefined` en los campos).
  redImage: string;

  blueImage: string;

  // URL del informe PDF en Storage, solo si se eligió "Guardar
  // partido con informe" ('' si se descargó nomás, sin guardar).
  reportUrl: string;

  reportGeneratedAt: number;

  totalEnds:number;

  currentEnd:number;

  secondsPerPlayer:number;

  redTime:number;

  blueTime:number;

  redScore:number;

  blueScore:number;

  currentEndRedScore:number;

 currentEndBlueScore:number;

 ends:EndResult[];

  redBallsPlayed:number;

  blueBallsPlayed:number;

  startingColor:'red'|'blue';

jackPlayed:boolean;

  isTieBreak: boolean;
tieBreakWinner: 'red' | 'blue' | null;

  turn:'red'|'blue'|null;

  timerRunning:boolean;


  // Todas las faltas/penalizaciones del partido, de cualquier END.
  // Puede haber varias pendientes a la vez dentro del mismo parcial.
  penalties: Penalty[];

showRest:boolean;

restSeconds:number;

showPenalty:boolean;

penaltySeconds:number;

broadcastState:
'playing'
|'rest'
|'penalty'
|'finished';

  state:MatchState;

}