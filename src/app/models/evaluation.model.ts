import { Throw } from "../pages/evaluations/models/throw.model";

export interface Evaluation {

  id?: string;

  trainerId: string;

  athleteId: string;

  athleteName: string;

  category?: string;

  evaluationType: EvaluationType;

  throws: number;

  currentThrow: number;

  distance: number;

  selectedBox?: number;

  selectedQuadrant?: string;

  jack?: Jack;

  throwList?: Throw[];

  currentBallColor?: 'red' | 'blue';

  lastUpdatedStep?: 'box' | 'jack' | 'throw';

  statistics?: EvaluationStatistics;

  notes?: string;

  date: Date;

  updatedAt?: Date;

  status: 'config' | 'running' | 'finished';

}

export interface Jack {

  x: number;

  y: number;

  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';

}

export interface EvaluationStatistics {

  excellent: number;

  good: number;

  regular: number;

  bad: number;

}

export type EvaluationType =
  | 'First Ball'
  | 'Placement'
  | 'Push On'
  | 'Push Off'
  | 'Ricochet'
  | 'Smash'
  | 'Bochada';