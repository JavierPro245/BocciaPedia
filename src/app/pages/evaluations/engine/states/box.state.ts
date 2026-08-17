import { BaseState } from "./base-state";

export class BoxState
extends BaseState {

  stateName = "BOX";

  override canPlaceBox(): boolean {

    return true;

  }

}