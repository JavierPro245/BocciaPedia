import { Injectable } from '@angular/core';
import { EvaluationConfig } from '../pages/evaluations/models/evaluation-config.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationSessionService {

  private config?: EvaluationConfig;

  setConfig(config: EvaluationConfig): void {
    this.config = config;
  }

  getConfig(): EvaluationConfig | undefined {
    return this.config;
  }

  clear(): void {
    this.config = undefined;
  }
}
