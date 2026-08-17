import { EvaluationContext } from "../models/evaluation-context";
import { State } from "./state.interface";

export abstract class BaseState
implements State {

  abstract stateName: string;

  enter(
    context: EvaluationContext
  ): void {}

  exit(): void {}

  canPlaceBox(): boolean {

    return false;

  }

  canPlaceJack(): boolean {

    return false;

  }

  canPlaceOpponentBall(): boolean {

    return false;

  }

  canPlacePlayerBall(): boolean {

    return false;

  }

}