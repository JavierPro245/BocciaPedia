export interface EvaluationConfig {

  athleteId: string;

  evaluationType: string;

  throws: number;

  distance: number;

  box?: number;

  target?: {

    x: number;

    y: number;

    quadrant: string;

  };

  notes?: string;

}