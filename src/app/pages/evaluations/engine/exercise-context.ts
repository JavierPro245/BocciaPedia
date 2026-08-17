import { Throw } from "../models/throw.model";

export interface ExerciseContext {

  evaluationId: string;

  currentThrow: number;

  totalThrows: number;

  selectedBox?: number;

  selectedQuadrant?: string;

  throws: Throw[];

}