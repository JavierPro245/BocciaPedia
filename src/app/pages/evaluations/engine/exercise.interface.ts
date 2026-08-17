import { Throw } from "../models/throw.model";

export interface Exercise {

  readonly type: string;

  start(): void;

  nextStep(): void;

  finish(): void;

  onBoxSelected(box: number): void;

  onJackPlaced(): void;

  onThrowRegistered(ball: Throw): void;

}