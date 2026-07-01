import { Injectable } from '@angular/core';
import { Evaluation } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private evaluation!: Evaluation;

  setEvaluation(evaluation: Evaluation){

    this.evaluation = evaluation;

  }

  getEvaluation(){

    return this.evaluation;

  }

}
