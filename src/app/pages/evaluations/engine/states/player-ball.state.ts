import { BaseState } from "./base-state";

export class PlayerBallState
extends BaseState {

  stateName = "PLAYER_BALL";

  override canPlacePlayerBall(): boolean {

    return true;

  }

}