export type ThrowResult =
  | 'excellent'
  | 'good'
  | 'regular'
  | 'bad';

export interface Throw {

  id: number;

  throwNumber: number;

  x: number;

  y: number;

  color: 'red' | 'blue';

  box?: number;

  quadrant?: 'Q1' | 'Q2' | 'Q3' | 'Q4';

  result?: ThrowResult;

  observation?: string;

}