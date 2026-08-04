import { EndResult } from './end-result.model';

export type MatchState =

'waiting'
| 'red-turn'
| 'blue-turn'
| 'rest'
| 'finished';

export interface Match{

  id:string;

  redPlayerId:string;

  redPlayer:string;

  bluePlayerId:string;

  bluePlayer:string;

  category:'BC1'|'BC2'|'BC3'|'BC4';

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


  penalty: {
    team: 'red' | 'blue';
    active: boolean;
    executed: boolean;
    timeRemaining: number;
    success: boolean | null;
} | null;

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