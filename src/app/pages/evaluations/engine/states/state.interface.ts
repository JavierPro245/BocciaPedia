import { EvaluationContext } from "../models/evaluation-context";

export interface State {

  readonly stateName: string;

  enter(
    context: EvaluationContext
  ): void;

  exit(): void;

  canPlaceBox(): boolean;

  canPlaceJack(): boolean;

  canPlaceOpponentBall(): boolean;

  canPlacePlayerBall(): boolean;

}