import { Throw } from "../models/throw.model";
import { Exercise } from "./exercise.interface";

export abstract class ExerciseBase
implements Exercise {

  abstract readonly type: string;

  start(): void {}

  nextStep(): void {}

  finish(): void {}

  onBoxSelected(box:number): void {}

  onJackPlaced(): void {}

  onThrowRegistered(ball:Throw): void {}

}