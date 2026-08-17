import { ExerciseEngine } from "./exercise-engine";
import { Throw } from "../models/throw.model";

export class FirstBallEngine
extends ExerciseEngine {

    start(): void {}

    onBoxSelected(): void {}

    onJackPlaced(): void {}

    onThrowRegistered(
        ball: Throw
    ): void {}

    nextThrow(): void {}

    finish(): void {}

}