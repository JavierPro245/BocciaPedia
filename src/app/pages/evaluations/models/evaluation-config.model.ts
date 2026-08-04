import { EvaluationType } from 'src/app/models/evaluation.model';

export interface EvaluationConfig {

  title: string;

  athleteId: string;

  athleteName: string;

  evaluationType: EvaluationType;

  distance: number;

  throws: number;

  notes?: string;

}