import { Evaluation } from "src/app/models/evaluation.model";
import { ExerciseEngine } from "./exercise-engine";

export class ExerciseManager {

    private engine?: ExerciseEngine;

    setEngine(
        engine: ExerciseEngine
    ) {

        this.engine = engine;

    }

    getEngine(): ExerciseEngine {

        if (!this.engine) {

            throw new Error(
                "ExerciseEngine no configurado."
            );

        }

        return this.engine;

    }

}