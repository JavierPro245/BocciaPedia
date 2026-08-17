import { EvaluationContext } from "./models/evaluation-context";
import { State } from "./states/state.interface";

export class StateManager {

  private currentState!: State;

  private context!: EvaluationContext;

  initialize(
    initialState: State,
    context: EvaluationContext
  ): void {

    this.context = context;

    this.currentState = initialState;

    this.currentState.enter(this.context);

  }

  changeState(
    newState: State
  ): void {

    this.currentState.exit();

    this.currentState = newState;

    this.currentState.enter(this.context);

  }

  getState(): State {

    return this.currentState;

  }

}