import { Evaluation } from "src/app/models/evaluation.model";
import { Throw } from "../models/throw.model";

export abstract class ExerciseEngine {

    constructor(
        protected evaluation: Evaluation
    ) {}

    abstract start(): void;

    abstract onBoxSelected(
        box: number
    ): void;

    abstract onJackPlaced(): void;

    abstract onThrowRegistered(
        ball: Throw
    ): void;

    abstract nextThrow(): void;

    abstract finish(): void;

}