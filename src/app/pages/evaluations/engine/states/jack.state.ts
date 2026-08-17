import { BaseState } from "./base-state";

export class JackState
extends BaseState {

  stateName = "JACK";

  override canPlaceJack(): boolean {

    return true;

  }

}