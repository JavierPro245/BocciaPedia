export interface Evaluation {

  id?: string;

  athleteId: string;

  athleteName: string;

  // Opcional por ahora
  category?: string;

  evaluationType: EvaluationType;

  throws: number;

  currentThrow: number;

  distance: number;

  selectedBox?: number;

  selectedQuadrant?: string;

  notes?: string;

  date: Date;

  status: 'config' | 'running' | 'finished';

}

export type EvaluationType =
  | 'First Ball'
  | 'Placement'
  | 'Push On'
  | 'Push Off'
  | 'Ricochet'
  | 'Smash'
  | 'Bochada';