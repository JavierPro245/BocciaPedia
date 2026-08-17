import { BaseState } from "./base-state";

export class OpponentBallState
extends BaseState {

  stateName = "OPPONENT_BALL";

  override canPlaceOpponentBall(): boolean {

    return true;

  }

}